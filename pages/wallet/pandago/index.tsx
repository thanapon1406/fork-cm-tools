import Button from '@/components/Button'
import Card from '@/components/Card'
import DateRangePicker from '@/components/Form/DateRangePicker'
import Input from '@/components/Form/Input'
import Select from '@/components/Form/Select'
import Table from '@/components/Table'
import useFetchTable from '@/hooks/useFetchTable'
import MainLayout from '@/layout/MainLayout'
import { getDeliveries } from '@/services/rider'
import { Breadcrumb, Col, Row, Space, Typography } from 'antd'
import { Field, Form, Formik } from 'formik'
import { get } from 'lodash'
import moment from 'moment'
import React, { ReactElement } from 'react'
import * as Yup from 'yup'

const { Title } = Typography

interface Props {}

interface filterObject {
  rider_info?: string
  outlet_types?: string
  status?: Array<string>
  partner_order_id?: string
  start_date?: string
  end_date?: string
  period_type?: string
  partner_name?: string
}

export default function Pandago({}: Props): ReactElement {
  const initialValues = {
    rider_info: '',
    date_create: '',
    status: '',
    partner_order_id: '',
  }

  const filterRequest: filterObject = {
    partner_name: 'PANDAGO',
  }
  const requestApi: Function = getDeliveries
  const { isLoading, dataTable, handelDataTableChange, handleFetchData, pagination } =
    useFetchTable(requestApi, filterRequest)

  const Schema = Yup.object().shape({})

  const handleSubmit = (values: any) => {
    let reqFilter: filterObject = {
      partner_order_id: values.partner_order_id,
      rider_info: values.rider_info,
      status: values.status && [values.status],
      start_date: values.date_create.start || '',
      end_date: values.date_create.end || '',
      partner_name: 'PANDAGO',
    }

    if (reqFilter.start_date != '' && reqFilter.end_date != '') {
      reqFilter.period_type = 'specific_time'
    }
    handleFetchData(reqFilter)
  }

  const column = [
    {
      title: 'Transaction Id',
      dataIndex: 'partner_order_id',
      align: 'center',
    },
    {
      title: 'รายละเอียดออเดอร์',
      dataIndex: 'order_no',
      align: 'center',
    },
    {
      title: 'สถานะ',
      dataIndex: 'status',
      align: 'center',
    },
    {
      title: 'ชื่อไรเดอร์',
      dataIndex: 'rider_info',
      align: 'center',
      render: (row: any) => {
        const name = get(row, 'first_name', '') + get(row, 'last_name', '')
        return name
      },
    },
    {
      title: 'ยอดเงิน',
      dataIndex: 'delivery_fee',
      align: 'center',
    },
    {
      title: 'เวลา',
      dataIndex: 'created_at',
      align: 'center',
      render: (row: any) => {
        return moment(row).format('YYYY-MM-DD HH:mm')
      },
    },
  ]

  return (
    <MainLayout>
      <Title level={4}>บัญชีผู้ใช้งาน</Title>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>บัญชีผู้ใช้งาน</Breadcrumb.Item>
        <Breadcrumb.Item>บัญชีร้านค้า</Breadcrumb.Item>
      </Breadcrumb>
      <Card>
        <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={Schema}>
          {({ values, resetForm }) => (
            <Form>
              <Row gutter={16}>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'Transaction Id' }}
                    name="partner_order_id"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="partner_order_id"
                    placeholder="Transaction Id"
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
                    label={{ text: 'ชื่อไรเดอร์' }}
                    name="rider_info"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="rider_info"
                    placeholder="ชื่อไรเดอร์"
                  />
                </Col>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'สถานะ' }}
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
                        name: 'สำเร็จ',
                        value: 'success',
                      },
                      {
                        name: 'ยกเลิก',
                        value: 'cancel',
                      },
                    ]}
                  />
                </Col>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'วันที่' }}
                    name="date_create"
                    component={DateRangePicker}
                    id="date_create"
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
            dataTableTitle: 'บัญชีร้านค้า',
            loading: isLoading,
            tableName: 'wallet/pandago',
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
