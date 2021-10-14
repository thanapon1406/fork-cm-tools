import Button from '@/components/Button'
import Card from '@/components/Card'
import Input from '@/components/Form/Input'
import Select from '@/components/Form/Select'
import Table from '@/components/Table'
import MainLayout from '@/layout/MainLayout'
import { getRider } from '@/services/rider'
import { Breadcrumb, Col, Row, Space, Typography } from 'antd'
import { Field, Form, Formik } from 'formik'
import Moment from 'moment'
import React, { ReactElement, useEffect, useState } from 'react'
const { Title } = Typography

interface Props {}
interface Pagination {
  total: number
  current: number
  pageSize: number
}
interface filterObject {
  keyword?: string
  working_status?: string
  job_status?: string
  status?: string
  ekyc_status?: string
  include?: string
}
export default function Rider({}: Props): ReactElement {
  let [dataTable, setDataTable] = useState([])
  let [_isLoading, setIsLoading] = useState(true)
  let [pagination, setPagination] = useState<Pagination>({
    total: 0,
    current: 1,
    pageSize: 10,
  })
  let [filter, setFilter] = useState<filterObject>({
    keyword: '',
    working_status: '',
    job_status: '',
    status: 'approved',
    ekyc_status: 'approved',
    include: 'job_count',
  })
  const initialValues = {
    keyword: '',
    working_status: '',
    job_status: '',
  }

  const handleSubmit = (values: any) => {
    console.log(`values`, values)
    let reqFilter: filterObject = {
      keyword: values.keyword,
      working_status: values.working_status,
      job_status: values.job_status,
      status: 'approved',
      ekyc_status: 'approved',
      include: 'job_count',
    }
    fetchData(reqFilter, { current: 1, total: 0, pageSize: 10 })
  }

  const handelDataTableLoad = (pagination: any) => {
    console.log(`pagination`, pagination)
    fetchData(filter, pagination)
  }

  const fetchData = async (filterObj: filterObject = filter, paging: Pagination = pagination) => {
    const reqBody = {
      page: paging.current,
      per_page: paging.pageSize,
      ...filterObj,
    }
    setIsLoading(true)
    const { result, success } = await getRider(reqBody)

    if (success) {
      const { meta, data } = result
      setDataTable(data)
      setPagination({
        pageSize: paging.pageSize,
        current: meta.page,
        total: meta.total_count,
      })
      setIsLoading(false)
      setFilter(filterObj)
    }
  }

  const column = [
    {
      title: 'Rider ID',
      dataIndex: 'code',
      align: 'center',
      render: (row: any) => {
        return row
      },
    },
    {
      title: 'ชื่อ Rider',
      dataIndex: 'first_name',
      render: (text: any, record: any) => {
        let fullName = record.first_name + ' ' + record.last_name
        return fullName
      },
    },
    {
      title: 'เบอร์โทร',
      dataIndex: 'phone',
      align: 'center',
      render: (text: any, record: any) => {
        let phone = '-'
        if (record.phone) {
          phone = record.country_code + '-' + record.phone
          // phone = record.country_code + '-' + record.phone.replace('-', '').slice(2, 7) + "000"
        }
        return phone
      },
    },
    {
      title: 'สถานะ Rider',
      dataIndex: 'working_status',
      align: 'center',
      render: (row: any) => {
        return row == 'offline' ? 'in-active' : 'active'
      },
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      align: 'center',
      render: (row: any) => {
        return row
      },
    },
    {
      title: 'สถานะรับงาน',
      dataIndex: 'job_count',
      align: 'center',
      render: (row: any) => {
        return row > 0 ? 'รับงาน' : 'ว่างงาน'
      },
    },
    {
      title: 'Approved Date',
      dataIndex: 'updated_at',
      align: 'center',
      render: (text: any, record: any) => {
        return Moment(text).format('YYYY-MM-DD HH:mm')
      },
    },
  ]

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <MainLayout>
      <Title level={4}>User Profile</Title>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>User Profile</Breadcrumb.Item>
        <Breadcrumb.Item>Rider Profile</Breadcrumb.Item>
      </Breadcrumb>
      <Card>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          // validationSchema={Schema}
        >
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
                    label={{ text: 'สถานะ Rider' }}
                    name="working_status"
                    component={Select}
                    id="working_status"
                    placeholder="working_status"
                    defaultValue={{ value: 'ทุกสถานะ' }}
                    selectOption={[
                      {
                        name: 'ทุกสถานะ',
                        value: '',
                      },
                      {
                        name: 'active',
                        value: 'online',
                      },
                      {
                        name: 'in-active',
                        value: 'offline',
                      },
                    ]}
                  />
                </Col>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'สถานะรับงาน' }}
                    name="job_status"
                    component={Select}
                    id="job_status"
                    placeholder="job_status"
                    defaultValue={{ value: 'ทุกสถานะ' }}
                    selectOption={[
                      {
                        name: 'ทุกสถานะ',
                        value: '',
                      },
                      {
                        name: 'ว่างงาน',
                        value: 'available',
                      },
                      {
                        name: 'รับงาน',
                        value: 'unavailable',
                      },
                    ]}
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
            dataTableTitle: 'รายการรอการตรวจสอบ',
            loading: _isLoading,
            tableName: 'userprofile/rider',
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
