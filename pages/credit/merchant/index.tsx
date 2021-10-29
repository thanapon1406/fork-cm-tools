import CustomBadge from '@/components/Badge'
import Button from '@/components/Button'
import Card from '@/components/Card'
import DateRangePicker from '@/components/Form/DateRangePicker'
import Input from '@/components/Form/Input'
import Select from '@/components/Form/Select'
import Table from '@/components/Table'
import { creditPaymentChanel, creditStatus } from '@/constants/textMapping'
import useFetchTable from '@/hooks/useFetchTable'
import MainLayout from '@/layout/MainLayout'
import { creditTransaction } from '@/services/credit'
import { Breadcrumb, Col, Row, Typography } from 'antd'
import { Field, Form, Formik } from 'formik'
import { get } from 'lodash'
import moment from 'moment'
import { useRouter } from 'next/router'
import React, { ReactElement, useEffect, useState } from 'react'
import * as Yup from 'yup'

const { Title } = Typography

interface Props {}

interface filterObject {
  id?: string
  keyword?: string
  type?: string
  start_date?: string
  end_date?: string
  status?: string
}

export default function MerchantCredit({}: Props): ReactElement {
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

  useEffect(() => {}, [])

  const filterRequest: filterObject = {}
  const requestApi: Function = creditTransaction
  const { isLoading, dataTable, handelDataTableChange, handleFetchData, pagination } =
    useFetchTable(requestApi, filterRequest)

  const Schema = Yup.object().shape({})

  const handleSubmit = (values: typeof initialValues) => {
    let reqFilter: filterObject = {
      id: values.refId,
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
      title: 'Ref ID',
      dataIndex: 'id',
      align: 'center',
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
      title: 'จำนวนเงิน',
      dataIndex: 'amount',
      align: 'center',
    },
    {
      title: 'ช่องทางการเติมเงิน',
      dataIndex: 'type',
      align: 'center',
      render: (row: string) => {
        return creditPaymentChanel[row]
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
      title: 'สถานะร้านค้า',
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
        <Breadcrumb.Item>เครดิตร้านค้าทั้งหมด</Breadcrumb.Item>
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
                    label={{ text: 'ช่องทางการเติม' }}
                    name="type"
                    component={Select}
                    id="type"
                    placeholder="ช่องทางการเติม"
                    defaultValue=""
                    selectOption={[
                      {
                        name: 'ทุกช่องทาง',
                        value: '',
                      },
                      {
                        name: 'บัญชีธนาคาร',
                        value: 'bank_tranfer',
                      },
                      {
                        name: 'QR Code',
                        value: 'qr_payment',
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
                        value: 'progressing',
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
        <Table
          config={{
            dataTableTitle: 'บัญชีร้านค้า',
            loading: isLoading,
            tableName: 'credit/merchant',
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
