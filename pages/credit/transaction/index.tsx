import CustomBadge from '@/components/Badge'
import Button from '@/components/Button'
import Card from '@/components/Card'
import DownloadButton from '@/components/credit/DownloadButton'
import DateRangePicker from '@/components/Form/DateRangePicker'
import Input from '@/components/Form/Input'
import Select from '@/components/Form/Select'
import Table from '@/components/Table'
import { creditStatus, creditUsed } from '@/constants/textMapping'
import useFetchTable from '@/hooks/useFetchTable'
import MainLayout from '@/layout/MainLayout'
import { transactionList } from '@/services/credit'
import { Breadcrumb, Col, Row, Typography } from 'antd'
import { Field, Form, Formik } from 'formik'
import { get } from 'lodash'
import moment from 'moment'
import { useRouter } from 'next/router'
import React, { ReactElement, useEffect, useState } from 'react'
import * as Yup from 'yup'

const { Text, Title } = Typography

interface Props {}

interface filterObject {
  id?: string
  keyword?: string
  type?: string
  start_date?: string
  end_date?: string
  status?: string
  transaction_id?: string
  is_preload_credit?: boolean
  gl_type?: string
}

export default function CreditTransaction({}: Props): ReactElement {
  const Router = useRouter()
  const initialValues = {
    refId: '',
    outlet_name: '',
    type: '',
    date: {
      start: '',
      end: '',
    },
    status: '',
  }
  let [outletType, setOutletType] = useState<Array<any>>([
    {
      name: 'ทุกประเภท',
      value: '',
    },
  ])

  var formatter = new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
  })

  const filterRequest: filterObject = {}
  const requestApi: Function = transactionList
  const { isLoading, dataTable, handelDataTableChange, handleFetchData, pagination } =
    useFetchTable(requestApi, filterRequest, {
      isAutoFetch: false,
    })

  useEffect(() => {
    handleFetchData({
      is_preload_credit: true,
      gl_type: 'credit',
    })
  }, [])

  const Schema = Yup.object().shape({})

  const handleSubmit = (values: typeof initialValues) => {
    let reqFilter: filterObject = {
      is_preload_credit: true,
      gl_type: 'credit',
      transaction_id: values.refId,
      keyword: values.outlet_name,
      type: values.type,
      start_date: values.date.start,
      end_date: values.date.end,
      status: values.status,
    }
    handleFetchData(reqFilter)
  }

  const column = [
    {
      title: 'Order No.',
      dataIndex: 'credit_no',
    },
    {
      title: 'ชื่อร้านค้า',
      dataIndex: 'outlet_name',
      align: 'center',
      render: (row: any) => {
        return get(row, 'th', '')
      },
    },
    {
      title: 'หักเครดิต',
      dataIndex: 'amount',
      align: 'center',
      render: (row: number) => {
        if (row == undefined) {
          return ''
        }
        return formatter.format(row)
      },
    },
    {
      title: 'คงเหลือ เครดิต/เงินเติม',
      dataIndex: 'vat',
      align: 'center',
      render: (row: number) => {
        if (row == undefined) {
          return ''
        }
        return formatter.format(row)
      },
    },
    {
      title: 'ประเภทการใช้เครดิต',
      dataIndex: 'credit_type',
      align: 'center',
      render: (row: any) => {
        return row ? creditUsed[row] : '-'
      },
    },
    {
      title: 'เวลา',
      dataIndex: 'created_at',
      align: 'center',
      render: (row: any) => {
        return row ? moment(row).format('YYYY-MM-DD HH:mm') : '-'
      },
    },
    {
      title: 'สถานะ',
      dataIndex: 'status',
      align: 'center',
      render: (row: string) => {
        if (row) {
          const status = creditStatus[row]
          return (
            <CustomBadge
              customMapping={{
                status: status.status,
                text: status.text,
              }}
            ></CustomBadge>
          )
        }
      },
    },
  ]

  return (
    <MainLayout>
      <Title level={4}>การจัดการเครดิตร้านค้า</Title>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>การจัดการเครดิตร้านค้า</Breadcrumb.Item>
        <Breadcrumb.Item>การใช้เครดิตร้านค้าทั้งหมด</Breadcrumb.Item>
      </Breadcrumb>
      <Card>
        <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={Schema}>
          {({ values, resetForm }) => (
            <Form>
              <Row gutter={16}>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'Ref ID' }}
                    name="refId"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="refId"
                    placeholder="Ref ID"
                  />
                </Col>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'ชื่อร้านค้า' }}
                    name="outlet_name"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="outlet_name"
                    placeholder="ชื่อร้านค้า"
                  />
                </Col>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'ประเภทการใช้เครดิต' }}
                    name="type"
                    component={Select}
                    id="type"
                    placeholder="ประเภทการใช้เครดิต"
                    defaultValue=""
                    selectOption={[
                      {
                        name: 'ทั้งหมด',
                        value: '',
                      },
                      {
                        name: 'ค่าดำเนินการ',
                        value: 'gross_profit',
                      },
                      {
                        name: 'ค่าจัดส่ง',
                        value: 'delivery_fee',
                      },
                    ]}
                  />
                </Col>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'วันที่' }}
                    name="date"
                    component={DateRangePicker}
                    id="date"
                    placeholder="วันที่"
                  />
                </Col>
                <Col className="gutter-row" span={6}></Col>
              </Row>
              <Row gutter={16}>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'สถานะ' }}
                    name="status"
                    component={Select}
                    id="status"
                    placeholder="status"
                    defaultValue=""
                    selectOption={[
                      {
                        name: 'N/A',
                        value: '',
                      },
                      {
                        name: 'สำเร็จ',
                        value: 'success',
                      },
                      {
                        name: 'ไม่สำเร็จ',
                        value: 'failed',
                      },
                      {
                        name: 'รอการยืนยัน',
                        value: 'processing',
                      },
                      {
                        name: 'Refund',
                        value: 'refund',
                      },
                    ]}
                  />
                </Col>
                <Col className="gutter-row" span={6}>
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
              </Row>
            </Form>
          )}
        </Formik>
      </Card>
      <Card>
        <Title level={4}>การใช้เครดิตร้านค้าทั้งหมด 1 ธันวาคม 2564 - 24 ธันวาคม 2564</Title>

        <Row gutter={[8, 24]}>
          <Col className="gutter-row" span={8}>
            <Title level={5}>ยอดรวมจำนวนเงินใช้เครดิตทั้งหมด: 1,323 </Title>
          </Col>
          <Col className="gutter-row" span={8}>
            <Title level={5}>ยอดรวมจำนวนเครดิตคงเหลือ: 1,323</Title>
          </Col>
          <Col className="gutter-row" span={8} style={{ textAlign: 'end' }}>
            <DownloadButton />
          </Col>
        </Row>
        <br />
        <Table
          config={{
            loading: isLoading,
            tableName: 'credit/transaction',
            tableColumns: column,
            dataSource: dataTable,
            handelDataTableLoad: handelDataTableChange,
            pagination: pagination,
          }}
        />
      </Card>
    </MainLayout>
  )
}
