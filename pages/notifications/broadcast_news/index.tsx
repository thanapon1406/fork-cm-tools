import Button from '@/components/Button'
import Card from '@/components/Card'
import DateTimeRangePicker from '@/components/Form/DateTimeRangePicker'
import Input from '@/components/Form/Input'
import Select from '@/components/Form/Select'
import Table from '@/components/Table'
import MainLayout from '@/layout/MainLayout'
import { getBroadcastNewList } from '@/services/broadcastNews'
import { Breadcrumb, Col, Row, Typography } from 'antd'
import { Field, Form, Formik } from 'formik'
import _ from 'lodash'
import Moment from 'moment'
import { useRouter } from 'next/router'
import React, { ReactElement, useEffect, useState } from 'react'
import * as Yup from 'yup'
const { Title } = Typography

interface Props { }
interface Pagination {
  total: number
  current: number
  pageSize: number
}
interface SearchValue {
  title?: string
  active_status?: string
  status?: string
  app_type?: string
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_type?: string;
  schedule_start_date?: string;
  schedule_end_date?: string;
  created_start_date?: string;
  created_end_date?: string;
}

const NotificationsBroadcastNews = (): ReactElement => {
  const Router = useRouter()
  const initialValues = {
    title: '',
    active_status: 'all',
    status: 'all',
    app_type: 'all',
    schedule_start_date: '',
    schedule_end_date: '',
    created_start_date: '',
    created_end_date: '',
  }
  let [filter, setFilter] = useState<SearchValue>(initialValues)
  const Schema = Yup.object().shape({})
  let [mockData, setMockData] = useState([])
  let [pagination, setPagination] = useState<Pagination>({
    total: 0,
    current: 1,
    pageSize: 10,
  })
  let [isLoading, setIsLoading] = useState(true)

  const fetchData = async (filterObj: SearchValue = filter, paging: Pagination = pagination) => {
    const reqBody = {
      page: paging.current,
      per_page: paging.pageSize,
      ...filterObj,
    }
    if (reqBody.app_type == "all") {
      delete (reqBody.app_type)
    }
    if (reqBody.active_status == "all") {
      delete (reqBody.active_status)
    }
    if (reqBody.status == "all") {
      delete (reqBody.status)
    }

    setIsLoading(true)
    const { result, success } = await getBroadcastNewList(reqBody)

    if (success) {
      const { meta, data } = result
      setMockData(data)
      setPagination({
        pageSize: paging.pageSize,
        current: meta.page,
        total: meta.total_count,
      })
      setIsLoading(false)
      setFilter(filterObj)
    }
  }
  const handelDataTableLoad = (pagination: any) => {
    fetchData(filter, pagination)
  }

  const handleSubmit = (values: any) => {

    const schedule_start_date = _.get(values, 'schedule_at.start', '')
    const schedule_end_date = _.get(values, 'schedule_at.end', '')
    const created_start_date = _.get(values, 'created_at.start', '')
    const created_end_date = _.get(values, 'created_at.end', '')

    const filter: SearchValue = {
      title: values.title,
      active_status: values.active_status,
      status: values.status,
      app_type: values.app_type,
      schedule_start_date: schedule_start_date,
      schedule_end_date: schedule_end_date,
      created_start_date: created_start_date,
      created_end_date: created_end_date,
    }

    fetchData(filter, { current: 1, total: 0, pageSize: 10 })
  }

  useEffect(() => {
    fetchData()
  }, [])

  let seq = (pagination.current - 1) * pagination.pageSize

  const column = [
    {
      title: 'ลำดับ',
      align: 'center',
      render: (row: any, record: any) => {
        return seq = seq + 1
      },
    },
    {
      title: 'ชื่อแคมเปญ',
      dataIndex: 'title',
      align: 'center',
    },
    {
      title: 'วัน-เวลาสร้าง',
      dataIndex: 'created_at',
      align: 'center',
      render: (row: any, record: any) => {
        return Moment(row).format('YYYY-MM-DD HH:mm')
      },
    },
    {
      title: 'วัน-เวลาส่ง',
      dataIndex: 'schedule_at',
      align: 'center',
      render: (row: any, record: any) => {
        return Moment(row).format('YYYY-MM-DD HH:mm')
      },
    },
    {
      title: 'สถานะการส่ง',
      dataIndex: 'active_status',
      className: 'column-typverifye',
      align: 'center',
      render: (row: any, record: any) => {
        if (record.active_status == "active") {
          return "Active"
        } else
          return "Inactive"
      },
    },
    {
      title: 'สถานะแคมเปญ',
      dataIndex: 'status',
      align: 'center',
      render: (row: any, record: any) => {
        if (record.status == "submit") {
          return "Submit"
        } else if (record.status == "in_progress") {
          return "In-Process"
        } else
          return "Done"
      },
    },
    {
      title: 'แอปพลิเคชันที่ทำการส่ง',
      dataIndex: 'app_type',
      align: 'center',
    },
  ]

  return (
    <MainLayout>
      <Row justify="space-around" align="middle">
        <Col span={8}>
          <Title level={4}>Notifications</Title>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Notifications</Breadcrumb.Item>
            <Breadcrumb.Item>List Broadcast News</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col span={8} offset={8} style={{ textAlign: 'end' }}>
          <Button
            style={{ width: '120px' }}
            type="primary"
            size="middle"
            onClick={() => {
              Router.push('/notifications/broadcast_news/create', `/notifications/broadcast_news/create`);
            }}
          >
            ตั้งค่า
          </Button>
        </Col>
      </Row>
      <Card>
        <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={Schema}>
          {({ values, resetForm }) => (
            <Form>
              <Row gutter={16}>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'ค้นหา' }}
                    name="title"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="title"
                    placeholder="ชื่อแคมเปญ"
                    isRange={true}
                  />
                  <div className="ant-form ant-form-vertical">
                    <Button
                      style={{ width: '120px', marginTop: '31px' }}
                      type="primary"
                      size="middle"
                      htmlType="submit"
                    >
                      ค้นหา
                    </Button>
                    <Button
                      style={{ width: '120px', marginTop: '31px', marginLeft: '10px' }}
                      type="default"
                      size="middle"
                      htmlType="reset"
                      onClick={() => resetForm()}
                    >
                      เคลียร์
                    </Button>
                  </div>
                </Col>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'สถานะแคมเปญ' }}
                    name="active_status"
                    component={Select}
                    id="active_status"
                    placeholder="สถานะการตรวจสอบ"
                    selectOption={[
                      {
                        name: 'ทุกสถานะ',
                        value: 'all',
                      },
                      {
                        name: 'Active',
                        value: 'active',
                      },
                      {
                        name: 'Inactive',
                        value: 'inactive',
                      }
                    ]}
                  />
                  <Field
                    label={{ text: 'สถานะการส่ง' }}
                    name="status"
                    component={Select}
                    id="status"
                    placeholder="สถานะการส่ง"
                    selectOption={[
                      {
                        name: 'ทุกสถานะ',
                        value: 'all',
                      },
                      {
                        name: 'Submit',
                        value: 'submit',
                      },
                      {
                        name: 'In-Process',
                        value: 'in_progress',
                      },
                      {
                        name: 'Done',
                        value: 'done',
                      }
                    ]}
                  />
                </Col>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'วันเวลาที่ทำการสร้าง' }}
                    name="created_at"
                    component={DateTimeRangePicker}
                    id="created_at"
                    placeholder="scheduleAt"
                  />
                  <Field
                    label={{ text: 'แอปพลิเคชันที่ทำการส่ง' }}
                    name="app_type"
                    component={Select}
                    id="app_type"
                    placeholder="แอปพลิเคชันที่ทำการส่ง"
                    selectOption={[
                      {
                        name: 'ทุกสถานะ',
                        value: 'all',
                      },
                      {
                        name: 'rider',
                        value: 'rider',
                      },
                      {
                        name: 'merchant',
                        value: 'merchant',
                      },
                      {
                        name: 'consumer',
                        value: 'consumer',
                      }
                    ]}
                  />
                </Col>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'วันเวลาที่ทำการส่ง' }}
                    name="schedule_at"
                    component={DateTimeRangePicker}
                    id="schedule_at"
                    placeholder="scheduleAt"
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
            dataTableTitle: 'รายการแคมเปญ',
            loading: isLoading,
            tableName: 'notifications/broadcast_news',
            tableColumns: column,
            action: ['view'],
            dataSource: mockData,
            handelDataTableLoad: handelDataTableLoad,
            pagination: pagination,
          }}
        />
      </Card>
    </MainLayout >
  )
}


export default NotificationsBroadcastNews