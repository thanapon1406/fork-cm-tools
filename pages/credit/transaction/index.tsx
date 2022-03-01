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
import { calculateUsedCredit, ExportCreditTransaction, transactionList } from '@/services/credit'
import { CalculateOutletCredit } from '@/services/merchant'
import { monthFormat } from '@/utils/helpers'
import { Breadcrumb, Col, notification, Row, Typography } from 'antd'
import { Field, Form, Formik } from 'formik'
import { get } from 'lodash'
import moment from 'moment'
import { useRouter } from 'next/router'
import React, { ReactElement, useEffect, useState } from 'react'
import * as Yup from 'yup'

const { Text, Title } = Typography

interface Props { }

interface filterObject {
  id?: string
  keyword?: string
  credit_type?: string
  start_date?: string
  end_date?: string
  status?: string
  transaction_id?: string
  is_preload_credit?: boolean
  gl_type?: string
  credit_no?: string
}

export default function CreditTransaction({ }: Props): ReactElement {
  const Router = useRouter()
  const initialValues = {
    credit_no: '',
    outlet_name: '',
    credit_type: '',
    date: {
      start: '',
      end: '',
    },
    status: '',
  }

  const [filterDate, setFilterDate] = useState({
    start: '',
    end: '',
  })
  const [usedCredit, setUsedCredit] = useState(0)
  const [availableCredit, setAvailableCredit] = useState(0)
  const [filterSearch, setFilterSearch] = useState<filterObject>({
    is_preload_credit: true,
    gl_type: 'credit',
    credit_no: '',
    keyword: '',
    credit_type: '',
    start_date: '',
    end_date: '',
    status: '',
  })

  var formatter = new Intl.NumberFormat('th-TH')

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
      status: 'success',
    })
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

    const { result, success } = await calculateUsedCredit(reqData)
    if (success) {
      const { data } = result
      const credit = get(data, 'credit')
      setUsedCredit(credit)
    }

    const { result: resultAvailableCredit, success: successAvailableCredit } =
      await CalculateOutletCredit({})
    if (successAvailableCredit) {
      const { data } = resultAvailableCredit
      const credit = get(data, 'available_credit')
      setAvailableCredit(credit)
    }
  }
  const Schema = Yup.object().shape({})

  const handleSubmit = (values: typeof initialValues) => {
    let reqFilter: filterObject = {
      is_preload_credit: true,
      gl_type: 'credit',
      credit_no: values.credit_no,
      keyword: values.outlet_name,
      credit_type: values.credit_type,
      start_date: values.date.start,
      end_date: values.date.end,
      status: values.status,
    }
    setFilterSearch(reqFilter)
    if (values.date.start && values.date.end) {
      initFilterDate(values.date.start, values.date.end)
    } else {
      initFilterDate()
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
      render: (row: number, col: any) => {
        if (row == undefined) {
          return ''
        }
        let credit
        if (row) {
          if (['success', 'processing'].includes(col.status) && col.gl_type == 'credit') {
            credit = <Text type="danger">{formatter.format(row)}</Text>
          } else {
            credit = formatter.format(row)
          }
        }
        return credit
      },
    },
    {
      title: 'คงเหลือ เครดิต/เงินเติม',
      dataIndex: 'balance',
      align: 'center',
      render: (row: number, col: any) => {
        let credit = '-'
        if (row) {
          if (col.status == 'refund') {
            credit = formatter.format(col.balance)
          } else {
            console.log(`this.2`)

            credit = formatter.format(col.balance - col.credit)
          }
        }
        return credit
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
            status && (
              <CustomBadge
                customMapping={{
                  status: status.status,
                  text: status.text,
                }}
              ></CustomBadge>
            )
          )
        }
      },
    },
  ]

  const handleDownloadClick = async (values: any) => {
    const request = {
      email: get(values, 'email'),
      is_preload_credit: true,
      gl_type: 'credit',
      credit_no: filterSearch.credit_no,
      keyword: filterSearch.keyword,
      credit_type: filterSearch.credit_type,
      start_date: filterSearch.start_date,
      end_date: filterSearch.end_date,
      status: filterSearch.status,
    }
    console.log(`request`, request)
    const { result, success } = await ExportCreditTransaction(request)
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
        <Breadcrumb.Item>การใช้เครดิตร้านค้าทั้งหมด</Breadcrumb.Item>
      </Breadcrumb>
      <Card>
        <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={Schema}>
          {({ values, resetForm }) => (
            <Form>
              <Row gutter={16}>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'Order No' }}
                    name="credit_no"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="credit_no"
                    placeholder="Order No"
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
                    name="credit_type"
                    component={Select}
                    id="credit_type"
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
        <Title level={4}>
          การใช้เครดิตร้านค้าทั้งหมด {monthFormat(filterDate.start)} - {monthFormat(filterDate.end)}
        </Title>

        <Row gutter={[8, 24]}>
          <Col className="gutter-row" span={8}>
            <Title level={5}>ยอดรวมจำนวนเงินใช้เครดิตทั้งหมด: {formatter.format(usedCredit)}</Title>
          </Col>
          <Col className="gutter-row" span={8}>
            <Title level={5}>
              ยอดรวมจำนวนเครดิตคงเหลือปัจจุบัน: {formatter.format(availableCredit)}
            </Title>
          </Col>
          <Col className="gutter-row" span={8} style={{ textAlign: 'end' }}>
            <DownloadButton handelSubmit={handleDownloadClick} />
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
