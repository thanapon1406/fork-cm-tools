import Button from '@/components/Button'
import Card from '@/components/Card'
import { statusMapping } from '@/components/ekyc/common'
import DateRangePicker from '@/components/Form/DateRangePicker'
import Input from '@/components/Form/Input'
import Select from '@/components/Form/Select'
import Table from '@/components/Table'
import { outletType } from '@/constants/textMapping'
import useFetchTable from '@/hooks/useFetchTable'
import MainLayout from '@/layout/MainLayout'
import { outletList } from '@/services/merchant'
import { Breadcrumb, Col, Row, Space, Typography } from 'antd'
import { Field, Form, Formik } from 'formik'
import moment from 'moment'
import { useRouter } from 'next/router'
import React, { ReactElement } from 'react'
import * as Yup from 'yup'

const { Title } = Typography

interface Props {}

interface filterObject {
  keyword?: string
  verify_status?: string
  ekyc_status?: string
  start_date_create?: string
  end_date_create?: string
  start_date_verify?: string
  end_date_verify?: string
  approve_status?: string
  branch_type?: string
  id?: string
  is_mass?: string
}

export default function Merchant({}: Props): ReactElement {
  const Router = useRouter()
  const initialValues = {
    keyword: '',
    branch_type: '',
    verify_status: '',
    ekyc_status: '',
    approve_status: '',
    date_create: {
      start: null,
      end: null,
    },
    date_verify: {
      start: null,
      end: null,
    },
    is_mass: '',
  }

  const filterRequest: filterObject = {
    keyword: '',
    verify_status: '',
    ekyc_status: '',
    start_date_create: '',
    end_date_create: '',
    start_date_verify: '',
    end_date_verify: '',
    approve_status: '',
    branch_type: '',
    id: '',
    is_mass: '',
  }
  const requestApi: Function = outletList
  const { isLoading, dataTable, handelDataTableChange, handleFetchData, pagination } =
    useFetchTable(requestApi, filterRequest)

  const Schema = Yup.object().shape({})

  const handleSubmit = (values: any) => {
    let reqFilter: filterObject = {
      keyword: values.keyword,
      verify_status: values.verify_status,
      ekyc_status: values.ekyc_status,
      approve_status: values.approve_status,
      branch_type: values.branch_type,
      start_date_create: values.date_create.start || '',
      end_date_create: values.date_create.end || '',
      start_date_verify: values.date_verify.start || '',
      end_date_verify: values.date_verify.end || '',
      is_mass: values.is_mass,
    }
    handleFetchData(reqFilter)
  }

  const column = [
    {
      title: 'ชื่อร้านค้า',
      dataIndex: 'name',
      align: 'center',
      render: (row: any) => {
        return row['th']
      },
    },
    {
      title: 'ประเภทร้านค้า',
      dataIndex: 'is_mass',
      align: 'center',
      render: (row: any) => {
        const isMass = row ? 'single' : 'multiple'
        return outletType[isMass] || ''
      },
    },
    {
      title: 'ชื่อและนามสกุล',
      dataIndex: 'user',
      align: 'center',
      render: (row: any) => {
        if (row) {
          return `${row['first_name']} ${row['last_name']}`
        }
        return ''
      },
    },
    {
      title: 'เบอร์โทรศัพท์',
      dataIndex: 'tel',
      align: 'center',
    },
    {
      title: 'ข้อมูลร้านค้า',
      dataIndex: 'verify_status',
      align: 'center',
    },
    {
      title: 'E-KYC',
      dataIndex: 'ekyc_status',
      align: 'center',
      render: (row: any) => {
        return row === 'no-ekyc' ? '-' : row
      },
    },
    {
      title: 'สถานะการตรวจสอบ',
      dataIndex: 'approve_status',
      align: 'center',
      render: (row: string) => {
        return statusMapping[row]
      },
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
      dataIndex: 'verify_date',
      align: 'center',
      render: (row: any) => {
        return row ? moment(row).format('YYYY-MM-DD HH:mm') : '-'
      },
    },
  ]

  return (
    <MainLayout>
      <Title level={4}>อนุมัติผลการลงทะเบียนเข้าใช้ระบบ</Title>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>อนุมัติผลการลงทะเบียน</Breadcrumb.Item>
        <Breadcrumb.Item>ลงทะเบียนร้านค้า</Breadcrumb.Item>
      </Breadcrumb>
      <Card>
        <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={Schema}>
          {({ values, resetForm }) => (
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
                        style={{ width: '120px', marginTop: '31px', marginLeft: '10px' }}
                        type="default"
                        size="middle"
                        htmlType="reset"
                        onClick={() => resetForm()}
                      >
                        เคลียร์
                      </Button>
                    </Space>
                  </div>
                </Col>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'ประเภทร้านค้า' }}
                    name="is_mass"
                    component={Select}
                    id="is_mass"
                    placeholder="ประเภทร้านค้า"
                    defaultValue={{ value: 'all' }}
                    selectOption={[
                      {
                        name: 'ทุกประเภท',
                        value: '',
                      },
                      {
                        name: 'สาขาเดี่ยว',
                        value: 'true',
                      },
                      {
                        name: 'หลายสาขา',
                        value: 'false',
                      },
                    ]}
                  />

                  <Field
                    label={{ text: 'ข้อมูลร้านค้า' }}
                    name="verify_status"
                    component={Select}
                    id="verify_status"
                    placeholder="verify_status"
                    defaultValue={{ value: 'all' }}
                    selectOption={[
                      {
                        name: 'ทุกประเภท',
                        value: '',
                      },
                      {
                        name: 'uploaded',
                        value: 'uploaded',
                      },
                      {
                        name: 'approve',
                        value: 'approved',
                      },
                      {
                        name: 'reject',
                        value: 'rejected',
                      },
                      {
                        name: 're-approve',
                        value: 're-approved',
                      },
                    ]}
                  />
                </Col>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'สถานะการตรวจสอบ' }}
                    name="approve_status"
                    component={Select}
                    id="approve_status"
                    placeholder="approve_status"
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
                  <Field
                    label={{ text: 'E-KYC' }}
                    name="ekyc_status"
                    component={Select}
                    id="ekyc_status"
                    placeholder="ekyc_status"
                    selectOption={[
                      {
                        name: 'ทุกสถานะ',
                        value: '',
                      },
                      {
                        name: 'no-ekyc',
                        value: 'no-ekyc',
                      },
                      {
                        name: 'uploaded',
                        value: 'uploaded',
                      },
                      {
                        name: 'approveed',
                        value: 'approved',
                      },
                      {
                        name: 're-approved',
                        value: 're-approved',
                      },
                      {
                        name: 'rejected',
                        value: 'rejected',
                      },
                    ]}
                  />
                </Col>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'วันเวลาที่ลงทะเบียน' }}
                    name="date_create"
                    component={DateRangePicker}
                    id="date_create"
                    placeholder="date_create"
                  />
                  <Field
                    label={{ text: 'วันเวลาที่อัพเดท' }}
                    name="date_verify"
                    component={DateRangePicker}
                    id="date_verify"
                    placeholder="date_verify"
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
            tableName: 'merchant',
            tableColumns: column,
            action: ['view'],
            dataSource: dataTable,
            handelDataTableLoad: handelDataTableChange,
            pagination: pagination,
          }}
        />
      </Card>
    </MainLayout>
  )
}
