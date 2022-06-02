import Card from '@/components/Card'
import DateTimeRangePicker from '@/components/Form/DateTimeRangePicker'
import Input from '@/components/Form/Input'
import Table from '@/components/Table'
import Tag from '@/components/Tag'
import MainLayout from '@/layout/MainLayout'
import { deleteBanner, getBannerList } from '@/services/banner'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, LinkOutlined, PlusOutlined } from '@ant-design/icons'
import { Breadcrumb, Button, Col, Modal, Row, Typography } from 'antd'
import { Field, Form, Formik } from 'formik'
import { get } from 'lodash'
import moment from 'moment'
import { useRouter } from 'next/router'
import React, { ReactElement, useEffect, useState } from 'react'
import noImage from '../../../public/asset/images/no-image-available.svg'

const { Title } = Typography
const { confirm } = Modal
interface Props { }

interface filterObject {
  keyword?: string
  start_date?: string,
  end_date?: string
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
    start_date: '',
    end_date: '',
  })

  const [paginationActive, setPaginationActive] = useState<Pagination>({
    total: 0,
    current: 1,
    pageSize: 10,
  })

  const Router = useRouter()
  const initialValues = {
    keyword: '',
    show_date: {
      start: '',
      end: ''
    },
  }

  useEffect(() => {
    fetchBannerList()
  }, [])

  const dateFormat = 'YYYY-MM-DDTHH:mm:ss.000Z'

  const fetchBannerList = async (filterObj: filterObject = filter, paging: Pagination = paginationActive) => {
    const reqBody = {
      ...filterObj,
      start_date: filterObj.start_date != '' ? moment(filterObj.start_date).format(dateFormat) : '',
      end_date: filterObj.end_date != '' ? moment(filterObj.end_date).format(dateFormat) : '',
      page: paging.current,
      per_page: paging.pageSize,
    }

    setIsLoading(true)
    let row = (paging.current - 1) * paging.pageSize
    const { result, success } = await getBannerList(reqBody)

    if (success) {
      if (typeof result.data !== 'undefined') {
        const { meta, data } = result
        let bannerList = []

        if (data.length > 0) {
          bannerList = data.map((banner: any) => {
            row++
            return { ...banner, no: row }
          })
        }

        setPaginationActive({
          pageSize: paging.pageSize,
          current: meta.page,
          total: meta.total_count,
        })
        setDataTable(bannerList)
      } else {
        setDataTable([])
      }
      setIsLoading(false)
      setFilter(filterObj)
    }
  }

  const showDeleteConfirm = (id: any, name: string) => {
    confirm({
      title: 'Delete Banner',
      icon: <ExclamationCircleOutlined />,
      content: `คุณต้องการลบ Banner ${name} ใช่หรือไม่?`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        fetchDelete(id)
      },
    });
  };

  const fetchDelete = async (id: number) => {
    const { result, success } = await deleteBanner({ id })

    if (success) {
      fetchBannerList()
    }
  }

  const handelDataTableLoadActive = (pagination: any) => {
    fetchBannerList(filter, pagination)
  }

  const handleSubmit = (values: any) => {

    let reqFilter: filterObject = {
      keyword: values.keyword,
      start_date: values.show_date.start,
      end_date: values.show_date.end
    }

    fetchBannerList(reqFilter, { current: 1, total: 0, pageSize: 10 })
  }


  const column = [
    {
      title: 'ลำดับ',
      dataIndex: 'no',
      align: 'center'
    },
    {
      title: 'ชื่อ Banner',
      align: 'center',
      dataIndex: 'name'
    },
    {
      title: 'รูปภาพ',
      align: 'center',
      dataIndex: 'image_url',
      render: (record: any) => {
        return (
          <>
            <img src={record != '' ? record : noImage.src} style={{ width: '100%', maxWidth: '100px' }} />
          </>
        )
      }
    },
    {
      title: 'ลำดับการแสดงผล',
      dataIndex: 'priority',
      align: 'center',
      // render: (priority: any) => {
      //   return (<b>{!priority ? 0 : priority}</b>)
      // }
    },
    {
      title: 'สถานะ',
      align: 'center',
      render: (record: any) => {
        return (
          <Tag type={record.status == 'active' ? "success" : "error"}>{record.status}</Tag>
        )
      }
    },
    {
      title: 'วันที่แสดง Banner',
      align: 'center',
      render: (record: any) => {
        if (!record?.start_date && !record?.end_date) {
          return "ไม่ได้ระบุ"
        }
        const start = `${get(record, 'start_date')}` == "" ? "ไม่ได้ระบุ" : moment(record['start_date']).format('YYYY-MM-DD HH:mm')
        const end = `${get(record, 'end_date')}` == "" ? "ไม่ได้ระบุ" : moment(record['end_date']).format('YYYY-MM-DD HH:mm')
        return (<>
          <div><b>ตั้งแต่วันที่:</b> {start}</div>
          <div><b>ถึงวันที่:</b> {end}</div>
        </>)
      },
    },
    {
      title: 'วันที่สร้าง',
      dataIndex: 'created_at',
      align: 'center',
      render: (record: any) => {
        return moment(record).format('YYYY-MM-DD HH:mm')
      },
    },
    {
      title: 'Action',
      align: 'left',
      render: (record: any) => {
        if (record.action_url != '' && record.action_url != undefined) {
          return (
            <>
              <Button onClick={() => { Router.push(`/content/banner/${record.id}`) }} icon={<EditOutlined />} size={`middle`} style={{ marginRight: '5px', backgroundColor: '#ffe58f', borderColor: '#faad14' }} />
              <Button type="primary" danger onClick={() => { showDeleteConfirm(record.id, record.name) }} icon={<DeleteOutlined />} size={`middle`} style={{ marginRight: '15px' }} />
              <a href={record.action_url} target="_blank">
                <LinkOutlined style={{ fontSize: '16px' }} /> Link
              </a>
            </>
          )
        } else {
          return (
            <>
              <Button onClick={() => { Router.push(`/content/banner/${record.id}`) }} icon={<EditOutlined />} size={`middle`} style={{ marginRight: '5px', backgroundColor: '#ffe58f', borderColor: '#faad14' }} />
              <Button type="primary" danger onClick={() => { showDeleteConfirm(record.id, record.name) }} icon={<DeleteOutlined />} size={`middle`} style={{ marginRight: '15px' }} />
            </>
          )
        }
      },
    },
  ]

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
              Router.push('/content/banner/create', `/content/banner/create`);
            }}
          >
            <PlusOutlined />
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
                    placeholder="ชื่อ Banner"
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
                              show_date: {
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
                    label={{ text: 'วันที่แสดง Banner' }}
                    name="show_date"
                    id="show_date"
                    component={DateTimeRangePicker}
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
            dataSource: dataTable,
            handelDataTableLoad: handelDataTableLoadActive,
            pagination: paginationActive,
          }}
        />
      </Card>
    </MainLayout>
  )
}
