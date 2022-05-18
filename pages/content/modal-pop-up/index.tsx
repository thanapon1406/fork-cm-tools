import Button from '@/components/Button'
import Card from '@/components/Card'
import DateTimeRangePicker from '@/components/Form/DateTimeRangePicker'
import Input from '@/components/Form/Input'
import Select from '@/components/Form/Select'
import Table from '@/components/Table'
import MainLayout from '@/layout/MainLayout'
import { getModalPopUpList } from '@/services/modalPopUp'
import { Breadcrumb, Col, Row, Typography } from 'antd'
import { Field, Form, Formik } from 'formik'
import { get, toNumber } from 'lodash'
import moment from 'moment'
import { useRouter } from 'next/router'
import React, { ReactElement, useEffect, useState } from 'react'

const { Title } = Typography

interface Props { }

interface Pagination {
  total: number
  current: number
  pageSize: number
}

interface filterObject {
  keyword?: string
  status?: string,
  app_id?: string,
  create_date_start?: string,
  create_date_end?: string
}

export default function Merchant({ }: Props): ReactElement {
  const Router = useRouter()
  const initialValues = {
    keyword: '',
    status: '',
    app_id: '',
    create_date: {
      start: '',
      end: ''
    },
  }

  let [_isLoading, setIsLoading] = useState(true)
  let [dataTableActive, setDataTableActive] = useState([])
  let [paginationActive, setPaginationActive] = useState<Pagination>({
    total: 0,
    current: 1,
    pageSize: 5,
  })
  let [_isLoadingInactive, setIsLoadingInactive] = useState(true)
  let [dataTableInactive, setDataTableInactive] = useState([])
  let [paginationInactive, setPaginationInactive] = useState<Pagination>({
    total: 0,
    current: 1,
    pageSize: 5,
  })

  let [filter, setFilter] = useState<filterObject>({
    keyword: '',
    status: '',
    app_id: '',
    create_date_start: '',
    create_date_end: '',
  })

  useEffect(() => {
    fetchDataActive()
    fetchDataInactive()
  }, [])

  const fetchDataActive = async (filterObj: filterObject = filter, paging: Pagination = paginationActive) => {
    const reqBody = {
      ...filterObj,
      app_id: toNumber(filterObj.app_id),
      is_eligible: true,
      page: paging.current,
      per_page: paging.pageSize,
    }
    setIsLoading(true)
    const { result, success } = await getModalPopUpList(reqBody)
    if (success) {
      const { meta, data } = result
      setPaginationActive({
        pageSize: paging.pageSize,
        current: meta.page,
        total: meta.total_count,
      })
      setDataTableActive(data)
      setIsLoading(false)
      setFilter(filterObj)
    }
  }

  const fetchDataInactive = async (filterObj: filterObject = filter, paging: Pagination = paginationActive) => {
    const reqBody = {
      ...filterObj,
      app_id: toNumber(filterObj.app_id),
      is_eligible: false,
      page: paging.current,
      per_page: paging.pageSize,
    }
    setIsLoadingInactive(true)
    const { result, success } = await getModalPopUpList(reqBody)
    if (success) {
      const { meta, data } = result
      setPaginationInactive({
        pageSize: paging.pageSize,
        current: meta.page,
        total: meta.total_count,
      })
      setDataTableInactive(data)
      setIsLoadingInactive(false)
      setFilter(filterObj)
    }
  }


  const handleSubmit = (values: any) => {
    let reqFilter: filterObject = {
      keyword: values.keyword,
      status: values.status,
      app_id: values.app_id,
      create_date_start: values.create_date.start || '',
      create_date_end: values.create_date.end || '',
    }
    fetchDataActive(reqFilter, { current: 1, total: 0, pageSize: 5 })
    fetchDataInactive(reqFilter, { current: 1, total: 0, pageSize: 5 })
  }

  const handelDataTableLoadActive = (pagination: any) => {
    console.log(`pagination`, pagination)
    fetchDataActive(filter, pagination)
  }

  const handelDataTableLoadInactive = (pagination: any) => {
    console.log(`pagination`, pagination)
    fetchDataInactive(filter, pagination)
  }

  const appNameMapping: any = {
    1: 'Consumer',
    2: 'Merchant',
    3: 'Rider',
  }

  const column = [
    {
      title: 'id',
      dataIndex: 'id',
      align: 'center',
    },
    {
      title: 'Name',
      align: 'center',
      dataIndex: 'name',
    },
    {
      title: 'รูปภาพ',
      align: 'center',
      dataIndex: 'image',
      render: (row: any) => {
        return (
          <img
            src={row}
            style={{ width: '100%', maxWidth: '120px' }}
          />
        )
      },
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      align: 'center',
    },
    {
      title: 'App Name',
      align: 'center',
      render: (row: any) => {
        return appNameMapping[row['app_id']]
      },
    },
    {
      title: 'วันที่แสดง modal',
      align: 'center',
      render: (row: any) => {
        if (!row?.start_date && !row?.end_date) {
          return "ไม่ได้ระบุ"
        }
        const start = `${get(row, 'start_date')}` == "" ? "ไม่ได้ระบุ" : moment(row['start_date']).format('YYYY-MM-DD HH:mm')
        const end = `${get(row, 'end_date')}` == "" ? "ไม่ได้ระบุ" : moment(row['end_date']).format('YYYY-MM-DD HH:mm')
        return (<>
          <div><b>ตั้งแต่วันที่:</b> {start}</div>
          <div><b>ถึงวันที่:</b> {end}</div>
        </>)
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      align: 'center',
    },
    {
      title: 'วันที่สร้าง',
      dataIndex: 'created_at',
      align: 'center',
      render: (row: any) => {
        return moment(row).format('YYYY-MM-DD HH:mm')
      },
    },
  ]

  return (
    <MainLayout>
      <Row justify="space-around" align="middle">
        <Col span={8}>
          <Title level={4}>Modal Pop Up</Title>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Content</Breadcrumb.Item>
            <Breadcrumb.Item>Modal Pop Up</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col span={8} offset={8} style={{ textAlign: 'end' }}>
          <Button
            style={{ width: '150px' }}
            type="primary"
            size="middle"
            onClick={() => {
              Router.push('/content/modal-pop-up/create', `/content/modal-pop-up/create`);
            }}
          >
            สร้าง Modal Pop Up
          </Button>
        </Col>
      </Row>
      <Card>
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {({ values, resetForm, setValues }) => (
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
                  <Row>
                    <Col className="gutter-row" span={6}>
                      <div className="ant-form ant-form-vertical">
                        <Button
                          style={{ width: '120px', marginTop: '27px' }}
                          type="primary"
                          size="middle"
                          htmlType="submit"
                        >
                          ค้นหา
                        </Button>
                      </div>
                    </Col>
                    <Col className="gutter-row" span={6}>
                      <div className="ant-form ant-form-vertical">
                        <Button
                          style={{ width: '120px', marginTop: '27px', marginLeft: '70px' }}
                          type="default"
                          size="middle"
                          onClick={() => {
                            setValues({
                              keyword: '',
                              status: '',
                              app_id: '',
                              create_date: {
                                start: '',
                                end: ''
                              },
                            })
                          }}
                        >
                          เคลียร์
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Col>
                <Col className="gutter-row" span={5}>
                  <Field
                    label={{ text: 'สถานะ' }}
                    name="status"
                    id="status"
                    component={Select}
                    placeholder="สถานะ"
                    selectOption={[
                      {
                        name: 'active',
                        value: 'active',
                      },
                      {
                        name: 'Inactive',
                        value: 'Inactive',
                      },
                    ]}
                  />

                </Col>
                <Col className="gutter-row" span={5}>
                  <Field
                    label={{ text: 'ชื่อแอพ' }}
                    name="app_id"
                    id="app_id"
                    className="form-control round"
                    component={Select}
                    placeholder="ชื่อแอพ"
                    selectOption={[
                      {
                        name: 'Consumer',
                        value: 1,
                      },
                      {
                        name: 'Merchant',
                        value: 2,
                      },
                      {
                        name: 'Rider',
                        value: 3,
                      },
                    ]}
                  />
                </Col>
                <Col className="gutter-row" span={8}>
                  <Field
                    label={{ text: 'วันเวลาที่สร้าง' }}
                    name="create_date"
                    component={DateTimeRangePicker}
                    id="create_date"
                  />
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
      </Card >
      <Card>
        <Table
          config={{
            dataTableTitle: 'Pop Up Online',
            loading: _isLoading,
            tableName: 'banner/modal-pop-up',
            tableColumns: column,
            action: ['view'],
            dataSource: dataTableActive,
            handelDataTableLoad: handelDataTableLoadActive,
            pagination: paginationActive,
          }}
        />
      </Card>
      <Card>
        <Table
          config={{
            dataTableTitle: 'Pop Up Offline',
            loading: _isLoadingInactive,
            tableName: 'banner/modal-pop-up',
            tableColumns: column,
            action: ['view'],
            dataSource: dataTableInactive,
            handelDataTableLoad: handelDataTableLoadInactive,
            pagination: paginationInactive,
          }}
        />
      </Card>
    </MainLayout >
  )
}
