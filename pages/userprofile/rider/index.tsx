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
import styled from 'styled-components'
const { Title } = Typography

interface Props { }
interface Pagination {
  total: number
  current: number
  pageSize: number
}
interface filterObject {
  keyword?: string
  active_status?: string
  working_status?: string
  status?: string
  ekyc_status?: string
  include?: string
  sort_by?: string
  sort_type?: string
}
const dateFormat = 'YYYY-MM-DD HH:mm'

const DotRed = styled.span`
  height: 11px;
  width: 11px;
  background-color: #B3B2B2;
  border-radius: 50%;
  display: inline-block;
  margin-right: 4px;
  margin-bottom: -1px;
`
const DotGreen = styled.span`
  height: 11px;
  width: 11px;
  background-color: #00AB00;
  border-radius: 50%;
  display: inline-block;
  margin-right: 4px;
  margin-bottom: -1px;
`

export default function Rider({ }: Props): ReactElement {
  let [dataTable, setDataTable] = useState([])
  let [_isLoading, setIsLoading] = useState(true)
  let [pagination, setPagination] = useState<Pagination>({
    total: 0,
    current: 1,
    pageSize: 10,
  })
  let [filter, setFilter] = useState<filterObject>({
    keyword: '',
    active_status: '',
    working_status: '',
    status: 'approved',
    ekyc_status: 'approved',
    include: 'job_count',
    sort_by: 'updated_at',
    sort_type: 'desc'
  })
  const initialValues = {
    keyword: '',
    active_status: '',
    working_status: '',
  }

  const handleSubmit = (values: any) => {
    console.log(`values`, values)
    let reqFilter: filterObject = {
      keyword: values.keyword,
      active_status: values.active_status,
      working_status: values.working_status,
      status: 'approved',
      ekyc_status: 'approved',
      include: 'job_count',
      sort_by: 'updated_at',
      sort_type: 'desc'
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
      title: 'Rating',
      dataIndex: 'rating',
      align: 'center',
      render: (row: any) => {
        return row
      },
    },

    {
      title: 'Approved Date',
      dataIndex: 'approve_date',
      align: 'center',
      render: (text: any, record: any) => {
        return Moment(text).format(dateFormat)
      },
    },
    {
      title: 'สถานะไรเดอร์',
      dataIndex: 'active_status', //'working_status',
      align: 'left',
      render: (row: any) => {
        // return row == 'offline' ? 'in-active' : 'active'
        return (
          row == 'active' ?
            <div>
              <DotGreen />
              <span>Active</span>
            </div>
            :
            <div>
              <DotRed />
              <span>Inactive</span>
            </div>

        )
      },
    },
    {
      title: 'สถานะรับงาน',
      dataIndex: 'working_status',
      align: 'center',
      render: (row: any, record: any) => {
        console.log(" row : ", row)
        console.log(" record : ", record)
        // return row > 0 ? 'รับงาน (' + row + ')' : 'ว่างงาน'
        return (
          row == 'online' ?
            <div>
              <DotGreen />
              <span>ออนไลน์ {record.job_count > 0 ? '(' + record.job_count + ')' : ""}</span>

            </div>
            :
            <div>
              <DotRed />
              <span>ออฟไลน์</span>
            </div>
        )
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
                    name="active_status"
                    component={Select}
                    id="active_status"
                    placeholder="active_status"
                    defaultValue={{ value: 'ทุกสถานะ' }}
                    selectOption={[
                      {
                        name: 'ทุกสถานะ',
                        value: '',
                      },
                      {
                        name: 'Active',
                        value: 'active',
                      },
                      {
                        name: 'Inactive',
                        value: 'inactive',
                      },
                    ]}
                  />
                </Col>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'สถานะรับงาน' }}
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
                        name: 'ออนไลน์',
                        value: 'online',
                      },
                      {
                        name: 'ออฟไลน์',
                        value: 'offline',
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
            dataTableTitle: 'บัญชีไรเดอร์',
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
