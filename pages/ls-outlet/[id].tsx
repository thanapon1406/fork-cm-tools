import Button from '@/components/Button'
import Card from '@/components/Card'
import DateTimeRangePicker from '@/components/Form/DateTimeRangePicker'
import Input from '@/components/Form/Input'
import Table from '@/components/Table'
import MainLayout from '@/layout/MainLayout'
import { retrieveToken } from '@/services/fetch/auth'
import { listLsOulet } from '@/services/ls-outlet'
import {
  Breadcrumb, Col, notification,
  Row, Typography
} from 'antd'
import { Field, Form, Formik } from 'formik'
import jwt_decode from 'jwt-decode'
import moment from 'moment'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ReactElement, useEffect, useState } from 'react'
import * as Yup from 'yup'

const { Title } = Typography

interface filterObject {
  keyword?: string
  ls_config_id?: string | string[] | undefined
  outlet_id?: number
  start_date?: string
  end_date?: string
  status?: string
}

interface Props { }

export default function LogisticSubsidize({ }: Props): ReactElement {
  const dateFormat = 'YYYY-MM-DDTHH:mm:ss.000Z'
  const Router = useRouter()
  const initialValues = {
    keyword: '',
    status: 'active',
    show_date: {
      start: '',
      end: ''
    },
  }
  const { id } = Router.query

  let [dataTable, setDataTable] = useState([])
  let [_isLoading, setIsLoading] = useState(true)

  let [filter, setFilter] = useState<filterObject>({
    keyword: '',
    status: 'active'
  })

  const Schema = Yup.object().shape({})

  const fetchData = async (filterObj: filterObject = filter) => {
    filter.ls_config_id = id
    const reqBody = {
      ...filterObj,
    }
    setIsLoading(true)
    const { result, success } = await listLsOulet(reqBody)
    console.log('result: ', result)
    console.log('success: ', success)
    if (success) {
      const { meta, data } = result
      setDataTable(data)
      setIsLoading(false)
      setFilter(filterObj)
    } else {
      const token: string = retrieveToken()
      const decoded: any = jwt_decode(token)
      const exp = decoded.exp
      const now = Math.floor(new Date().getTime() / 1000)
      if (now <= exp) {
        notification.warning({
          message: `ผิดพลาด`,
          description: 'ไม่สามารถค้นหา LS Outlet ได้',
          duration: 3,
        })
      }
      setIsLoading(false)
    }
  }

  const handleSubmit = (values: any) => {
    let reqFilter: filterObject = {
      keyword: values.keyword,
      ls_config_id: id,
      status: 'active',
      start_date: values?.show_date?.start,
      end_date: values?.show_date?.end
    }
    fetchData(reqFilter)
  }

  const handelDataTableLoad = (pagination: any) => {
    console.log(`pagination`, pagination)
    fetchData(filter)
  }

  const resetFetchData = () => {
    fetchData(
      {
        keyword: '',
        ls_config_id: id,
        status: 'active',
      },
    )
  }

  useEffect(() => {
    if (id) {
      fetchData()
    }
  }, [id])

  const column = [
    {
      title: 'Outlet ID',
      dataIndex: 'outlet_id',
      align: 'center',
      render: (row: any) => {
        return <Link href={`/userprofile/merchant/` + row}><a>{row}</a></Link>
      },
    },
    {
      title: 'ร้านอาหาร',
      dataIndex: 'outlet_name',
      align: 'center',
    },

    {
      title: 'วันและเวลาที่เริ่ม',
      dataIndex: 'start_date',
      align: 'center',
      render: (row: any) => {
        return moment(row).format('YYYY-MM-DD HH:mm')
      },
    },
    {
      title: 'วันและเวลาที่สิ้นสุด',
      dataIndex: 'end_date',
      align: 'center',
      render: (row: any) => {
        return row !== undefined ? moment(row).format('YYYY-MM-DD HH:mm') : "-"
      },
    },

  ]

  return (
    <MainLayout>
      <Row justify="space-around" align="middle">
        <Col span={24}>
          <Title level={4}>LS Outlet</Title>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>
              <a
                onClick={() => {
                  Router.push('/ls-config')
                }}
              >
                LS Outlet
              </a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>รายการ LS Outlet</Breadcrumb.Item>
          </Breadcrumb>
        </Col>

      </Row>
      <Card>
        <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={Schema}>
          {({ values, resetForm }) => (
            <Form>
              <Row gutter={24}>
                <Col className="gutter-row" span={12}>
                  <Field
                    label={{ text: 'ค้นหา' }}
                    name="keyword"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="keyword"
                    placeholder="ค้นหา"
                  />
                </Col>
                <Col
                  className="gutter-row"
                  span={12}
                >
                  <Field
                    label={{ text: 'วันที่และเวลาเริ่ม-สิ้นสุด' }}
                    name="show_date"
                    component={DateTimeRangePicker}
                    id="show_date"
                    placeholder="show_date"
                  />
                </Col>
              </Row>
              <Row gutter={24}>
                <Col className="gutter-row" span={24} style={{ textAlign: 'right' }}>
                  <Button style={{ width: '120px' }} type="primary" size="middle" htmlType="submit">
                    ค้นหา
                  </Button>
                  <Button
                    style={{ width: '120px', marginLeft: '10px' }}
                    type="default"
                    size="middle"
                    htmlType="reset"
                    onClick={() => {
                      resetForm()
                      resetFetchData()
                    }}
                  >
                    เคลียร์
                  </Button>
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
      </Card>
      <Card>
        <Table
          config={{
            dataTableTitle: 'รายการร้านค้า',
            loading: _isLoading,
            tableName: 'ls-outlet',
            tableColumns: column,
            dataSource: dataTable,
            handelDataTableLoad: handelDataTableLoad,
            pagination: false,
          }}
        />
      </Card>
    </MainLayout>
  )
}
