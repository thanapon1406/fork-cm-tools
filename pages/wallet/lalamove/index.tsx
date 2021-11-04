import Button from '@/components/Button'
import Card from '@/components/Card'
import DateRangePicker from '@/components/Form/DateRangePicker'
import Input from '@/components/Form/Input'
import Select from '@/components/Form/Select'
import Table from '@/components/Table'
import useFetchTable from '@/hooks/useFetchTable'
import MainLayout from '@/layout/MainLayout'
import { getLalamoveWallet } from '@/services/wallet'
import { currencyFormat } from '@/utils/helpers'
import { Breadcrumb, Col, Row, Typography } from 'antd'
import { Field, Form, Formik } from 'formik'
import moment from 'moment'
import { useRouter } from 'next/router'
import React, { ReactElement, useEffect, useState } from 'react'
import * as Yup from 'yup'

const { Title } = Typography
const normal_color = "#17C2D7"
const increase_color = "#28A745"
const decrease_color = "#F82F38"

interface Props { }

interface filterObject {
  id?: string
  keyword?: string
  type?: string
  start_date?: string
  end_date?: string
  transaction_id?: string
}

export default function Wallet({ }: Props): ReactElement {
  const Router = useRouter()
  const initialValues = {
    transaction_id: '',
    rider_name: '',
    type: '',
    date: {
      start: '',
      end: '',
    }
  }
  let [outletType, setOutletType] = useState<Array<any>>([
    {
      name: 'ทุกประเภท',
      value: '',
    },
  ])

  let [balanceAmount, SetBalanceAmount] = useState(0)
  let [spendingLastestAmount, SetSpendingLastestAmount] = useState(0)
  let [topUpLastestAmount, SetTopUpLastestAmount] = useState(0)

  useEffect(() => {
    SetBalanceAmount(490)
    SetSpendingLastestAmount(5000)
    SetTopUpLastestAmount(10000)
  }, [])

  const filterRequest: filterObject = {}
  const requestApi: Function = getLalamoveWallet
  const { isLoading, dataTable, handelDataTableChange, handleFetchData, pagination } =
    useFetchTable(requestApi, filterRequest)

  const Schema = Yup.object().shape({})

  const handleSubmit = (values: typeof initialValues) => {
    let reqFilter: filterObject = {
      transaction_id: values.transaction_id,
      keyword: values.rider_name,
      type: values.type,
      start_date: values.date.start,
      end_date: values.date.end
    }
    handleFetchData(reqFilter)
  }

  const column = [
    {
      title: '#',
      dataIndex: 'id',
      render: (row: string, record: number, index: number) => {
        return index + 1
      },
    },
    {
      title: 'Transaction ID',
      dataIndex: 'transaction_id',
    },
    {
      title: 'ประเภท',
      dataIndex: 'type',
      render: (row: any) => {
        let typeText = ""
        if (row === "top-up") {
          typeText = "เติมเงิน"
        } else if (row === "increase") {
          typeText = "เงินเข้า"
        } else if (row === "decrease") {
          typeText = "เงินออก"
        }
        return typeText
      },
    },
    {
      title: 'รายละเอียด',
      dataIndex: 'description',
    },
    {
      title: 'ชื่อไรเดอร์',
      dataIndex: 'rider_name',
    },
    {
      title: 'จำนวนเงิน',
      dataIndex: 'amount',
      render: (row: any, record: any) => {
        let sign = ""
        let color = ""
        if (record['type'] === 'top-up' || record['type'] === 'increase') {
          sign = "+"
          color = increase_color
        } else if (record['type'] === 'decrease') {
          sign = "-"
          color = decrease_color
        }
        return <span style={{ color: color }}>{`${sign}${currencyFormat(row)}`}</span>
      },
    },
    {
      title: 'เวลา',
      dataIndex: 'created_at',
      render: (row: any) => {
        return row ? moment(row).format('YYYY-MM-DD HH:mm') : '-'
      },
    },
  ]

  return (
    <MainLayout>
      <Title level={4}>กระเป๋าตังค์</Title>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>กระเป๋าตังค์</Breadcrumb.Item>
        <Breadcrumb.Item>LALAMOVE</Breadcrumb.Item>
      </Breadcrumb>
      <Card>
        <Row gutter={16}>
          <Col span={8} style={{ paddingLeft: 0 }}>
            <h3>กระเป๋าตังค์</h3>
          </Col>
          <Col span={16} style={{ textAlign: 'right' }}>
            <Button
              style={{ width: '120px' }}
              type="primary"
              size="middle"
              htmlType="submit"
            >
              ตั้งค่า
            </Button>
          </Col>
        </Row>
        <Row gutter={16} style={{ paddingTop: 5 }}>
          <Col span={6} style={{ paddingLeft: 0 }}>
            <p>ยอดเครดิตคงเหลือ</p>
          </Col>
          <Col span={6}>
            <span style={{ color: normal_color }}>{currencyFormat(topUpLastestAmount)}</span>
          </Col>
          <Col span={12}>
            ยอดเงินในกระเป๋าของคุณน้อยกว่า ฿500 กรุณาเติมเงินก่อนใช้งาน
          </Col>
        </Row>
        <Row gutter={16} style={{ paddingTop: 5 }} >
          <Col span={6} style={{ paddingLeft: 0 }}>
            <p style={{ marginBottom: 0 }}>ยอดเครดิตที่ใช้ไป</p>
            <p>(1 w.ย. 64 - 30 w.ย. 64)</p>
          </Col>
          <Col span={6}>
            <span style={{ color: decrease_color }}>{`${'-'}${currencyFormat(spendingLastestAmount)}`}</span>
          </Col>
        </Row>
        <Row gutter={16} style={{ paddingTop: 5 }} >
          <Col span={6} style={{ paddingLeft: 0 }}>
            <p style={{ marginBottom: 0 }}>ยอดเติมเครดิตล่าสุด</p>
            <p>(1 w.ย. 64 - 30 w.ย. 64)</p>
          </Col>
          <Col span={6}>
            <span style={{ color: increase_color }}>{`${'+'}${currencyFormat(balanceAmount)}`}</span>
          </Col>
        </Row>
      </Card>
      <Card>
        <Title level={5}>กรุณากรอกข้อมูลที่ต้องการค้นหา</Title>
        <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={Schema}>
          {({ values, resetForm }) => (
            <Form>
              <Row gutter={16}>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'Transaction ID' }}
                    name="transactionId"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="transactionId"
                    placeholder="Transaction ID"
                  />
                </Col>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'ประเภท' }}
                    name="type"
                    component={Select}
                    id="type"
                    placeholder="ประเภท"
                    defaultValue=""
                    selectOption={[
                      {
                        name: 'ทั้งหมด',
                        value: '',
                      },
                      {
                        name: 'เติมเงิน',
                        value: 'top-up',
                      },
                      {
                        name: 'เงินเข้า',
                        value: 'increase',
                      },
                      {
                        name: 'เงินออก',
                        value: 'decrease',
                      },
                    ]}
                  />
                </Col>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'ชื่อไรเดอร์' }}
                    name="rider_name"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="rider_name"
                    placeholder="ชื่อไรเดอร์"
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
            dataTableTitle: 'รายการ',
            loading: isLoading,
            tableName: 'wallet/lalamove',
            tableColumns: column,
            action: ['view'],
            dataSource: dataTable,
            handelDataTableLoad: handelDataTableChange,
            pagination: pagination,
            isExport: true,
            handelDataExport: () => {
              console.log("EXPORT!")
            }
          }}
        />
      </Card>
    </MainLayout >
  )
}
