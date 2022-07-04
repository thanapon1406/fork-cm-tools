import Button from '@/components/Button'
import Card from '@/components/Card'
import Input from '@/components/Form/Input'
import Table from '@/components/Table'
import MainLayout from '@/layout/MainLayout'
import { retrieveToken } from '@/services/fetch/auth'
import { deleteLsConfig, listLsConfig } from '@/services/ls-config'
import { DeleteFilled, EditFilled, ExclamationCircleOutlined } from '@ant-design/icons'
import {
  Breadcrumb,
  Button as ButtonAntd,
  Col,
  Modal,
  notification,
  Row,
  Tooltip,
  Typography,
} from 'antd'
import { Field, Form, Formik } from 'formik'
import jwt_decode from 'jwt-decode'
import moment from 'moment'
import { useRouter } from 'next/router'
import { ReactElement, useEffect, useState } from 'react'
import * as Yup from 'yup'

const { Title } = Typography

interface Pagination {
  total: number
  current: number
  pageSize: number
}

interface filterObject {
  keyword?: string
}

interface Props {}

export default function LogisticSubsidize({}: Props): ReactElement {
  const Router = useRouter()
  const initialValues = {
    keyword: '',
  }

  let [dataTable, setDataTable] = useState([])
  let [_isLoading, setIsLoading] = useState(true)
  let [pagination, setPagination] = useState<Pagination>({
    total: 0,
    current: 1,
    pageSize: 10,
  })
  let [filter, setFilter] = useState<filterObject>({
    keyword: '',
  })

  const Schema = Yup.object().shape({})

  const fetchData = async (filterObj: filterObject = filter, paging: Pagination = pagination) => {
    const reqBody = {
      page: paging.current,
      per_page: paging.pageSize,
      ...filterObj,
    }
    // console.log(`reqBody`, reqBody)
    setIsLoading(true)
    const { result, success } = await listLsConfig(reqBody)
    console.log('result: ', result)
    console.log('success: ', success)
    if (success) {
      const { meta, data } = result
      setPagination({
        pageSize: paging.pageSize,
        current: meta.page,
        total: meta.total_count,
      })
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
          description: 'ไม่สามารถค้นหา LS Config ได้',
          duration: 3,
        })
      }
      setIsLoading(false)
    }
  }

  const handleSubmit = (values: any) => {
    console.log(`values`, values)
    let reqFilter: filterObject = {
      keyword: values.keyword,
    }
    fetchData(reqFilter, { current: 1, total: 0, pageSize: 10 })
  }

  const handelDataTableLoad = (pagination: any) => {
    console.log(`pagination`, pagination)
    fetchData(filter, pagination)
  }

  const handleDelete = async (data: any) => {
    console.log(`handle delete ls config id: `, data.id)
    const modelContent = (
      <>
        คุณต้องการลบ
        <span style={{ padding: '0 4px', color: 'red' }}>{data?.name}</span>
        ใช่หรือไม่?
      </>
    )

    const deleteLs = async () => {
      const req = {
        id: data.id,
      }
      const { result, success } = await deleteLsConfig(req)
      if (success) {
        notification.success({
          message: 'สำเร็จ',
          description: `ลบรายการ ${data?.name} เรียบร้อยแล้ว`,
        })

        fetchData(filter, pagination)
      } else {
        const { detail = '' } = result
        if (detail === 'ALLOEDLIST_IS_MORE_THAN_ONE') {
          notification.error({
            message: 'แจ้งเตือน',
            description: `กรุณาลบร้านอาหารที่ใช้งานใน LS Logistic ก่อนลบรายการนี้`,
          })
        }
      }
    }

    Modal.confirm({
      title: 'Delete',
      icon: <ExclamationCircleOutlined />,
      content: modelContent,
      okText: 'ลบ',
      cancelText: 'ยกเลิก',
      onOk: deleteLs,
    })
  }

  const resetFetchData = () => {
    fetchData(
      { keyword: '' },
      {
        total: 0,
        current: 1,
        pageSize: 10,
      }
    )
  }

  useEffect(() => {
    fetchData()
  }, [])

  const column = [
    // {
    //   title: 'ID',
    //   dataIndex: 'id',
    //   align: 'center',
    // },
    {
      title: 'LS Configure',
      dataIndex: 'name',
      align: 'left',
    },
    {
      title: 'จำนวนร้านที่เพิ่ม',
      dataIndex: 'total_merchant_add',
      align: 'center',
      render: (row: any) => {
        return row ? row : 0
      },
    },
    {
      title: 'จำนวนร้านที่เข้าร่วม',
      dataIndex: 'total_merchant_join',
      align: 'center',
      render: (row: any) => {
        return row ? row : 0
      },
    },
    {
      title: 'วันและเวลาที่สร้าง',
      dataIndex: 'created_at',
      align: 'center',
      render: (row: any) => {
        return moment(row).format('YYYY-MM-DD HH:mm')
      },
    },
    {
      title: '',
      dataIndex: 'id',
      align: 'center',
      render: (row: any, data: any) => {
        return (
          <>
            <Tooltip title="แก้ไข">
              <ButtonAntd
                icon={<EditFilled />}
                onClick={() => {
                  console.log('edit ls config id: ', row)
                  Router.push(`ls-config/${row}`)
                }}
              ></ButtonAntd>
            </Tooltip>
            <Tooltip title="ลบ">
              <ButtonAntd
                icon={<DeleteFilled />}
                onClick={() => {
                  handleDelete(data)
                }}
                style={{
                  marginLeft: '5px',
                }}
              ></ButtonAntd>
            </Tooltip>
          </>
        )
      },
    },
  ]

  return (
    <MainLayout>
      <Row justify="space-around" align="middle">
        <Col span={8}>
          <Title level={4}>Logistic Subsidize</Title>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>
              <a
                onClick={() => {
                  Router.push('/ls-config')
                }}
              >
                Logistic Subsidize
              </a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>รายการ Logistic Subsidize</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col span={8} offset={8} style={{ textAlign: 'end' }}>
          <Button
            style={{ width: '180px', marginTop: '31px' }}
            type="primary"
            size="middle"
            onClick={() => {
              Router.push('/ls-config/create')
            }}
            className="confirm-button"
          >
            + สร้าง Logistic Subsidize
          </Button>
        </Col>
      </Row>
      <Card>
        <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={Schema}>
          {({ values, resetForm }) => (
            <Form>
              <Row gutter={24}>
                <Col className="gutter-row" span={24}>
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
            dataTableTitle: 'รายการกำหนดค่าจัดส่ง',
            loading: _isLoading,
            tableName: 'ls-config',
            tableColumns: column,
            action: ['view'],
            dataSource: dataTable,
            handelDataTableLoad: handelDataTableLoad,
            pagination: pagination,
          }}
        />
      </Card>
    </MainLayout>
  )
}
