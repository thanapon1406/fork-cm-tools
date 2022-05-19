import Card from '@/components/Card'
import Input from '@/components/Form/Input'
import Select from '@/components/Form/Select'
import Table from '@/components/Table'
import Tag from '@/components/Tag'
import MainLayout from '@/layout/MainLayout'
import { getBannerList } from '@/services/Banner'
import { Breadcrumb, Button, Col, Row, Typography } from 'antd'
import { Field, Form, Formik } from 'formik'
import { get } from 'lodash'
import moment from 'moment'
import { useRouter } from 'next/router'
import React, { ReactElement, useEffect, useState } from 'react'

const { Title } = Typography
interface Props { }

const column = [
  {
    title: 'id',
    dataIndex: 'id',
    align: 'center',
  },
  {
    title: 'Name',
    align: 'center',
    dataIndex: 'name'
  },
  {
    title: 'รูปภาพ',
    align: 'center',
    dataIndex: 'action_url',
    render: (reccord: any) => {
      return (
        <>
          <img src={reccord} style={{ width: '100%', maxWidth: '120px' }} />
        </>
      )
    }
  },
  {
    title: 'Priority',
    dataIndex: 'priority',
    align: 'center',
  },
  {
    title: 'วันที่แสดง Banner',
    align: 'center',
    render: (reccord: any) => {
      if (!reccord?.start_date && !reccord?.end_date) {
        return "ไม่ได้ระบุ"
      }
      const start = `${get(reccord, 'start_date')}` == "" ? "ไม่ได้ระบุ" : moment(reccord['start_date']).format('YYYY-MM-DD HH:mm')
      const end = `${get(reccord, 'end_date')}` == "" ? "ไม่ได้ระบุ" : moment(reccord['end_date']).format('YYYY-MM-DD HH:mm')
      return (<>
        <div><b>ตั้งแต่วันที่:</b> {start}</div>
        <div><b>ถึงวันที่:</b> {end}</div>
      </>)
    },
  },
  {
    title: 'Status',
    align: 'center',
    render: (reccord: any) => {
      if(reccord.status === 'active'){
        return (
          <Tag type="success">{reccord.status}</Tag>
        )
      }else{
        return (
          <Tag type="error">{reccord.status}</Tag>
        )
      }
    }
  },
  {
    title: 'วันที่สร้าง',
    dataIndex: 'created_at',
    align: 'center',
    render: (reccord: any) => {
      return moment(reccord).format('YYYY-MM-DD HH:mm')
    },
  },
]

interface filterObject {
  keyword?: string
  status?: string,
  create_date_start?: string,
  create_date_end?: string
}

interface Pagination {
  total: number
  current: number
  pageSize: number
}

export default function Banner({ }: Props): ReactElement {

  const [_isLoading, setIsLoading] = useState(true)
  const [dataTable, setDataTable] = useState([])

  const [filter, setFilter] = useState<filterObject>({
    keyword: '',
    status: '',
    create_date_start: '',
    create_date_end: '',
  })

  const [paginationActive, setPaginationActive] = useState<Pagination>({
    total: 0,
    current: 1,
    pageSize: 5,
  })

  const Router = useRouter()
  const initialValues = {
    keyword: '',
    status: '',
    create_date: {
      start: '',
      end: ''
    },
  }

  useEffect(() => {
    fetchBannerList()
  }, [])

  const fetchBannerList = async (filterObj: filterObject = filter, paging: Pagination = paginationActive) => {
    const reqBody = {
      ...filterObj,
      is_eligible: true,
      page: paging.current,
      per_page: paging.pageSize,
    }
    setIsLoading(true)
    const { result, success } = await getBannerList(reqBody)
    console.log(result)
    if (success) {
      const { meta, data } = result
      setPaginationActive({
        pageSize: paging.pageSize,
        current: meta.page,
        total: meta.total_count,
      })
      setDataTable(data)
      setIsLoading(false)
      setFilter(filterObj)
    }
  }

  const handelDataTableLoadActive = (pagination: any) => {
    console.log(`pagination`, pagination)
    fetchBannerList(filter, pagination)
  }

  const handleSubmit = (values: any) => {

  }

  return (
    <MainLayout>
      <Row justify="space-around" align="middle">
        <Col span={8}>
          <Title level={4}>Banner</Title>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Content</Breadcrumb.Item>
            <Breadcrumb.Item>Banner</Breadcrumb.Item>
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
            สร้าง Banner
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
            </Row>
          </Form>
          )}
        </Formik>
      </Card>

      <Card>
        <Table
          config={{
            dataTableTitle: 'Banner',
            loading: _isLoading,
            tableName: 'content/banner',
            tableColumns: column,
            action: ['view'],
            dataSource: dataTable,
            handelDataTableLoad: handelDataTableLoadActive,
            pagination: paginationActive,
          }}
        />
      </Card>
    </MainLayout>
  )
}
