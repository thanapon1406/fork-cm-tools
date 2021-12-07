import Button from '@/components/Button'
import Card from '@/components/Card'
import DateRangePicker from '@/components/Form/DateRangePicker'
import Input from '@/components/Form/Input'
import Select from '@/components/Form/Select'
import Table from '@/components/Table'
import MainLayout from '@/layout/MainLayout'
import { consumerList } from '@/services/consumer'
import { personState } from '@/store'
import { Breadcrumb, Col, Row, Space, Typography } from 'antd'
import { Field, Form, Formik } from 'formik'
import moment from 'moment'
import React, { ReactElement, useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import * as Yup from 'yup'

const { Title } = Typography

interface Props { }

interface Pagination {
  total: number
  current: number
  pageSize: number
}

interface filterObject {
  keyword?: string
  ranking?: string
  login_start_date?: string
  login_end_date?: string
  update_start_date?: string
  update_end_date?: string
}

export default function Merchant({ }: Props): ReactElement {
  const [userObj, setUserObj] = useRecoilState(personState)
  const initialValues = {
    keyword: '',
    ranking: '',
    login_date: {
      start: null,
      end: null,
    },
    update_date: {
      start: null,
      end: null,
    },
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
    ranking: '',
    login_start_date: '',
    login_end_date: '',
    update_start_date: '',
    update_end_date: '',
  })

  useEffect(() => {
    fetchData()
  }, [])

  const Schema = Yup.object().shape({})

  const fetchData = async (filterObj: filterObject = filter, paging: Pagination = pagination) => {
    const reqBody = {
      page: paging.current,
      per_page: paging.pageSize,
      ...filterObj,
    }
    console.log(`reqBody`, reqBody)
    setIsLoading(true)
    const { result, success } = await consumerList(reqBody)
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
    }
  }

  const handleSubmit = (values: any) => {
    console.log(`values`, values)
    let reqFilter: filterObject = {
      keyword: values.keyword,
      ranking: values.ranking,
      login_start_date: values.login_date.start || '',
      login_end_date: values.login_date.end || '',
      update_start_date: values.update_date.start || '',
      update_end_date: values.update_date.end || '',
    }
    fetchData(reqFilter, { current: 1, total: 0, pageSize: 10 })
  }

  const handelDataTableLoad = (pagination: any) => {
    console.log(`pagination`, pagination)
    fetchData(filter, pagination)
  }

  const customViewAction = (data: any) => {
    console.log(`data`, pagination)
    fetchData(filter, pagination)
  }

  const statusMapping: any = {
    uploaded: 'รอตรวจสอบ',
    approved: 'อนุมัติ',
    're-approved': 'ขอเอกสารเพิ่ม',
    rejected: 'ไม่ผ่าน',
  }

  const column = [
    {
      title: 'Consumer ID',
      dataIndex: 'id',
      align: 'center',
    },
    {
      title: 'เบอร์โทรศัพท์',
      dataIndex: 'tel',
      align: 'center',
    },
    {
      title: 'Social login name',
      align: 'center',
      render: (row: any) => {
        return row['social_login_first_name'] != undefined ? row['social_login_first_name'] : '' + ' ' + row['social_login_last_name'] != undefined ? row['social_login_last_name'] : ''
      },
    },
    {
      title: 'ชื่อและนามสกุล',
      align: 'center',
      render: (row: any) => {
        return row['first_name'] != undefined ? row['first_name'] : '' + ' ' + row['last_name'] != undefined ? row['last_name'] : ''
      },
    },
    {
      title: 'Point',
      dataIndex: 'point',
      align: 'center',
    },
    {
      title: 'Ranking',
      dataIndex: 'ranking',
      align: 'center',
    },
    {
      title: 'e-kyc',
      align: 'center',
      render: (row: any) => {
        return statusMapping[row['confirm_e_kyc']]
      },
    },
    {
      title: 'วันที่เข้าสู่ระบบล่าสุด',
      dataIndex: 'login_at',
      align: 'center',
      render: (row: any) => {
        return moment(row).format('YYYY-MM-DD HH:mm')
      },
    },
    {
      title: 'วันที่อัพเดตข้อมูล',
      dataIndex: 'updated_at',
      align: 'center',
      render: (row: any) => {
        return moment(row).format('YYYY-MM-DD HH:mm')
      },
    },
  ]

  return (
    <MainLayout>
      <Title level={4}>User Consumer</Title>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>User Consumer</Breadcrumb.Item>
        <Breadcrumb.Item>Consumer Profile</Breadcrumb.Item>
      </Breadcrumb>
      <Card>
        <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={Schema}>
          {(values) => (
            <Form>
              <Row gutter={16}>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'ค้นหา' }}
                    name="keyword"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="keyword"
                    placeholder="ค้นหา"
                  />
                  <div className="ant-form ant-form-vertical">
                    <Space>
                      <Button
                        style={{ width: '120px', marginTop: '31px' }}
                        type="primary"
                        size="middle"
                        htmlType="submit"
                      >
                        ค้นหา
                      </Button>
                    </Space>
                  </div>
                </Col>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'ranking' }}
                    name="ranking"
                    component={Select}
                    id="ranking"
                    placeholder="ranking"
                    defaultValue={{ value: 'all' }}
                    selectOption={[
                      {
                        name: 'ทุก ranking',
                        value: '',
                      },
                      {
                        name: 'Babyshark',
                        value: 'Babyshark',
                      },
                    ]}
                  />
                </Col>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'วันที่เข้าสู่ระบบล่าสุด' }}
                    name="login_date"
                    component={DateRangePicker}
                    id="login_date"
                    placeholder="login_date"
                  />
                </Col>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'วันเวลาที่อัพเดท' }}
                    name="update_date"
                    component={DateRangePicker}
                    id="update_date"
                    placeholder="update_date"
                  />
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
      </Card>
      <Card>
        <Table
          config={{
            dataTableTitle: 'บัญชีลูกค้า',
            loading: _isLoading,
            tableName: 'consumer',
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
