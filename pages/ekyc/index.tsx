import Button from '@/components/Button'
import Card from '@/components/Card'
import DateRangePicker from '@/components/Form/DateRangePicker'
import Input from '@/components/Form/Input'
import Select from '@/components/Form/Select'
import Table from '@/components/Table'
import Tag from '@/components/Tag'
import { EkycDetail } from '@/interface/ekyc'
import MainLayout from '@/layout/MainLayout'
import { getEkycList } from '@/services/ekyc'
import { personState } from '@/store'
import { Breadcrumb, Col, Row, Space, Typography } from 'antd'
import { Field, Form, Formik } from 'formik'
import { map } from 'lodash'
import moment from 'moment'
import { useRouter } from 'next/router'
import React, { ReactElement, useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import * as Yup from 'yup'

const { Title } = Typography

interface Pagination {
  total: number
  current: number
  pageSize: number
}

interface filterObject {
  status?: string
  start_date?: string
  end_date?: string
  update_start_date?: string
  update_end_date?: string
  keyword?: string
}

const initialValues = {
  keyword: '',
  sso_id: '',
  status: '',
  created_date: { start: null, end: null },
  updated_date: { start: null, end: null },
}
const Schema = Yup.object().shape({})

const appIdMapping: any = {
  '1': 'Consumer',
  '2': 'Rider',
  '3': 'Marchart',
}

const EkycList = (): ReactElement => {
  const router = useRouter()
  const [userObj, setUserObj] = useRecoilState(personState)
  const [ekycDataList, setEkycDataList] = useState<Array<EkycDetail>>([])
  const [isLoading, setIsLoading] = useState(true)
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    current: 1,
    pageSize: 10,
  })
  const [filter, setFilter] = useState<filterObject>({})

  const getEkyc = async (filterObj: filterObject = filter, paging: Pagination = pagination) => {
    setIsLoading(true)
    const reqBody = {
      page: paging.current,
      per_page: paging.pageSize,
      ...filterObj,
    }

    const { result, success } = await getEkycList(reqBody)

    if (success) {
      const { data, meta } = result
      setPagination({
        pageSize: paging.pageSize,
        current: meta.page,
        total: meta.total_count,
      })
      setEkycDataList(
        map(data, (item: EkycDetail) => ({
          ...item,
          name: `${item.first_name} ${item.last_name}`,
          id: item.sso_id,
        }))
      )
    }
    setIsLoading(false)
    setFilter(filterObj)
  }

  useEffect(() => {
    getEkyc()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const statusMapping: any = {
    uploaded: <Tag type="warning">รอการตรวจสอบ</Tag>,
    approved: <Tag type="success">อนุมัติ</Tag>,
    're-approved': <Tag type="default">ขอเอกสารเพิ่มเติม</Tag>,
    rejected: <Tag type="error">ไม่อนุมัติ</Tag>,
  }

  const handleSubmit = (values: any) => {
    console.log(values)

    let reqFilter: filterObject = {
      keyword: values.keyword || '',
      status: values.status || '',
      start_date: values.created_date.start || '',
      end_date: values.created_date.end || '',
      update_start_date: values.updated_date.start || '',
      update_end_date: values.updated_date.end || '',
    }
    getEkyc(reqFilter, { current: 1, total: 0, pageSize: 10 })
  }

  const handelDataTableLoad = (pagination: any) => {
    getEkyc(filter, pagination)
  }

  const column = [
    {
      title: 'SSO ID',
      dataIndex: 'sso_id',
      align: 'center',
    },
    {
      title: 'Chanel',
      dataIndex: 'app_id',
      align: 'center',
      render: (data: any) => {
        return <p>{appIdMapping[data]}</p>
      },
    },
    {
      title: 'เบอร์โทรศัพท์',
      dataIndex: 'mobile_number',
      align: 'center',
    },
    {
      title: 'Social login',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: 'สถานะการตรวจสอบ',
      dataIndex: 'status',
      align: 'center',
      render: (data: string) => statusMapping[data],
    },
    {
      title: 'วันที่ลงทะเบียน',
      dataIndex: 'created_at',
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
      <Title level={4}>อนุมัติการยินยันตัวตนผ่านระบบ E-KYC</Title>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>อนุมัติการยินยันตัวตนผ่านระบบ E-KYC</Breadcrumb.Item>
        <Breadcrumb.Item>ลงทะเบียนการยินยันตัวตน</Breadcrumb.Item>
      </Breadcrumb>
      <Card>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          onReset={handleSubmit}
          validationSchema={Schema}
        >
          {({ values }) => (
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
                        loading={isLoading}
                        style={{ width: '120px', marginTop: '31px' }}
                        type="primary"
                        size="middle"
                        htmlType="submit"
                      >
                        ค้นหา
                      </Button>
                      <Button
                        style={{ width: '120px', marginTop: '31px' }}
                        type="ghost"
                        size="middle"
                        htmlType="reset"
                      >
                        ล้างค่า
                      </Button>
                    </Space>
                  </div>
                </Col>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'สถานะการตรวจสอบ' }}
                    name="status"
                    component={Select}
                    id="status"
                    placeholder="status"
                    selectOption={[
                      {
                        name: 'ทุกสถานะ',
                        value: '',
                      },
                      {
                        name: 'รอการตรวจสอบ',
                        value: 'uploaded',
                      },
                      {
                        name: 'อนุมัติ',
                        value: 'approved',
                      },
                      {
                        name: 'ไม่อนุมัติ',
                        value: 'rejected',
                      },
                      {
                        name: 'ขอเอกสารเพิ่มเติม',
                        value: 're-approved',
                      },
                    ]}
                  />
                </Col>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'วันเวลาที่ทำ E-KYC' }}
                    name="created_date"
                    component={DateRangePicker}
                    id="created_date"
                    placeholder="date_create"
                  />
                </Col>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'วันเวลาที่อัพเดท' }}
                    name="updated_date"
                    component={DateRangePicker}
                    id="updated_date"
                    placeholder="date_create"
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
            dataTableTitle: 'รายการรอตรวจสอบ',
            loading: isLoading,
            tableName: 'ekyc',
            tableColumns: column,
            dataSource: ekycDataList,
            action: ['view'],
            handelDataTableLoad: handelDataTableLoad,
            pagination: pagination,
          }}
        />
      </Card>
    </MainLayout>
  )
}

export default EkycList
