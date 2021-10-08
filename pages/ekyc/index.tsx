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
import React, { ReactElement, useCallback, useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import * as Yup from 'yup'

const { Title } = Typography

interface Pagination {
  total: number
  current: number
  pageSize: number
}

interface filterObject {
  id?: string
  project_id?: string
  sso_id?: string
  status?: string
  start_date?: string
  end_date?: string
  app_id?: string
}

const initialValues = {
  id: '',
  project_id: '',
  sso_id: '',
  status: '',
  start_date: '',
  end_date: '',
  app_id: '',
}
const Schema = Yup.object().shape({})

const EkycList = (): ReactElement => {
  const [userObj, setUserObj] = useRecoilState(personState)
  const [ekycDataList, setEkycDataList] = useState<Array<EkycDetail>>([])
  const [isLoading, setIsLoading] = useState(true)
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    current: 1,
    pageSize: 10,
  })
  const [filter, setFilter] = useState<filterObject>({})

  const getEkyc = useCallback(
    async (filterObj: filterObject = filter, paging: Pagination = pagination) => {
      setIsLoading(true)
      const reqBody = {
        page: paging.current,
        per_page: paging.pageSize,
        ...filterObj,
      }
      const { result, success } = await getEkycList(reqBody)

      if (success) {
        const { data } = result
        setEkycDataList(
          data.map((item: EkycDetail) => ({
            ...item,
            name: `${item.first_name} ${item.last_name}`,
            action: item.sso_id,
          }))
        )
      }
      setIsLoading(false)
      setFilter(filterObj)
    },
    [filter, pagination]
  )

  useEffect(() => {
    getEkyc()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const statusMapping: any = {
    uploaded: <Tag type="warning">รอการตรวจสอบ</Tag>,
    approve: <Tag type="success">อนุมัติ</Tag>,
    're-approve': <Tag type="default">ขอเอกสารเพิ่มเติม</Tag>,
    reject: <Tag type="error">ไม่อนุมัติ</Tag>,
  }

  const handleSubmit = (values: any) => {
    console.log(values)

    let reqFilter: filterObject = {
      id: values.id || '',
      project_id: values.project_id || '',
      sso_id: values.sso_id || '',
      status: values.status || '',
      start_date: values.start_date || '',
      end_date: values.end_date || '',
      app_id: values.app_id || '',
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
      title: 'Project Id',
      dataIndex: 'project_id',
      align: 'center',
    },
    {
      title: 'ชื่อและนามสกุล',
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
        return moment(row).format('YYYY-MM-DD HH:MM')
      },
    },
    {
      title: 'วันที่อัพเดตข้อมูล',
      dataIndex: 'updated_at',
      align: 'center',
      render: (row: any) => {
        return moment(row).format('YYYY-MM-DD HH:MM')
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
        <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={Schema}>
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
                        value: 'approve',
                      },
                      {
                        name: 'ไม่อนุมัติ',
                        value: 'reject',
                      },
                      {
                        name: 'ขอเอกสารเพิ่มเติม',
                        value: 're-approve',
                      },
                    ]}
                  />
                </Col>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'วันเวลาที่ลงทะเบียน' }}
                    name="start_date"
                    component={DateRangePicker}
                    id="start_date"
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
            actionKey: map(ekycDataList, 'sso_id'),
            action: ['view'],
            dataSource: ekycDataList,
            handelDataTableLoad: handelDataTableLoad,
            pagination: pagination,
          }}
        />
      </Card>
    </MainLayout>
  )
}

export default EkycList
