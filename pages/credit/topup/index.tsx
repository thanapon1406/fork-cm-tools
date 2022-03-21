import CustomBadge from '@/components/Badge'
import Button from '@/components/Button'
import Card from '@/components/Card'
import DownloadButton from '@/components/credit/DownloadButton'
import DateRangePicker from '@/components/Form/DateRangePicker'
import Input from '@/components/Form/Input'
import Select from '@/components/Form/Select'
import Table from '@/components/Table'
import { creditPaymentChanel, creditStatus } from '@/constants/textMapping'
import useFetchTable from '@/hooks/useFetchTable'
import MainLayout from '@/layout/MainLayout'
import { calculateTopup, creditTransaction, ExportCreditTopup } from '@/services/credit'
import { monthFormat } from '@/utils/helpers'
import { Breadcrumb, Col, notification, Row, Typography } from 'antd'
import { Field, Form, Formik } from 'formik'
import { get } from 'lodash'
import moment from 'moment'
import { useRouter } from 'next/router'
import React, { ReactElement, useEffect, useState } from 'react'
import * as Yup from 'yup'

const { Title } = Typography

interface Props { }

interface filterObject {
  id?: string
  keyword?: string
  type?: string
  start_date?: string
  end_date?: string
  status?: string
  reference_id?: string
  is_all_status?: boolean
}

export default function MerchantCredit({ }: Props): ReactElement {
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

  const [filterSearch, setFilterSearch] = useState<filterObject>({
    reference_id: '',
    keyword: '',
    type: '',
    start_date: '',
    end_date: '',
    status: '',
    is_all_status: true
  })

  const [filterDate, setFilterDate] = useState({
    start: '',
    end: '',
  })
  const [summaryTopup, setSummaryTopup] = useState({
    amount: 0,
    credit: 0,
  })

  const formatter = new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
  })

  const formatterNotSymbol = new Intl.NumberFormat('th-TH')

  useEffect(() => {
    initFilterDate()
  }, [])

  const initFilterDate = async (
    start: string = moment().startOf('month').format(),
    end: string = moment().format()
  ) => {
    setFilterDate({
      start: start,
      end: end,
    })
    const reqData = {
      start_date: start,
      end_date: end,
    }

    const { result, success } = await calculateTopup(reqData)
    if (success) {
      const { data } = result
      const credit = get(data, 'credit')
      const amount = get(data, 'amount')
      setSummaryTopup({
        amount: amount,
        credit: credit,
      })
    }
  }

  const filterRequest: filterObject = {}
  const requestApi: Function = creditTransaction
  const { isLoading, dataTable, handelDataTableChange, handleFetchData, pagination } =
    useFetchTable(requestApi, filterRequest)

  const Schema = Yup.object().shape({})

  const handleSubmit = (values: typeof initialValues) => {
    let is_all_status = !values.status
    let reqFilter: filterObject = {
      reference_id: values.refId,
      keyword: values.outlet_name,
      type: values.type,
      start_date: values.date.start,
      end_date: values.date.end,
      status: values.status,
      is_all_status: is_all_status,
    }
    setFilterSearch(reqFilter)
    handleFetchData(reqFilter)
    if (values.date.start && values.date.end) {
      initFilterDate(values.date.start, values.date.end)
    } else {
      initFilterDate()
    }
  }

  const column = [
    {
      title: 'Order No.',
      dataIndex: 'order_no',
    },
    {
      title: 'Ref ID',
      dataIndex: 'transaction_id',
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
      render: (row: number) => {
        if (row == undefined) {
          return ''
        }
        return formatter.format(row)
      },
    },
    {
      title: 'ยอดเครดิตที่ได้',
      dataIndex: 'credit',
      align: 'center',
      render: (row: number) => {
        if (row === undefined) {
          row = 0
        }
        return formatterNotSymbol.format(row)
      },
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
      title: 'สถานะ',
      dataIndex: 'status',
      align: 'center',
      render: (row: string, record: any) => {
        if (row) {
          let raw_status = row
          if (row == "" && record.is_upload_slip) {
            raw_status = "uploaded_slip"
          }
          const status = creditStatus[raw_status]
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

  const handleDownloadClick = async (values: any) => {
    const request = {
      email: get(values, 'email'),
      ...filterSearch,
    }
    console.log(`request`, request)
    const { result, success } = await ExportCreditTopup(request)
    if (success) {
      notification.success({
        message: `ส่งรายงานไปยังอีเมลที่ระบุใว้เรียบร้อยแล้ว`,
        description: '',
      })
    }
  }

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
                        value: 'bank_transfer',
                      },
                      {
                        name: 'QR Code',
                        value: 'qr_payment',
                      },
                      {
                        name: 'Welcome Credit',
                        value: 'free_credit',
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
                        name: 'ทั้งหมด',
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
                        name: 'อัพโหลดสลิป',
                        value: 'uploaded_slip',
                      },
                      {
                        name: 'ยกเลิก',
                        value: 'cancel',
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
        <Title level={4}>
          การเติมเครดิตร้านค้าทั้งหมด {monthFormat(filterDate.start)} -{' '}
          {monthFormat(filterDate.end)}
        </Title>

        <Row gutter={[8, 24]}>
          <Col className="gutter-row" span={8}>
            <Title level={5}>
              ยอดรวมจำนวนเงินเติมเครดิตทั้งหมด: {formatterNotSymbol.format(summaryTopup.amount)}{' '}
            </Title>
          </Col>
          <Col className="gutter-row" span={8}>
            <Title level={5}>
              ยอดรวมเติมเครดิตทั้งหมด: {formatterNotSymbol.format(summaryTopup.credit)}
            </Title>
          </Col>
          <Col className="gutter-row" span={8} style={{ textAlign: 'end' }}>
            <DownloadButton handelSubmit={handleDownloadClick} />
          </Col>
        </Row>
        <Table
          config={{
            dataTableTitle: 'บัญชีร้านค้า',
            loading: isLoading,
            tableName: 'credit/topup',
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
