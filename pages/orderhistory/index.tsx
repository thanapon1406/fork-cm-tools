import Button from '@/components/Button'
import Card from '@/components/Card'
import DateTimeRangePicker from '@/components/Form/DateTimeRangePicker'
import Input from '@/components/Form/Input'
import Select from '@/components/Form/Select'
import { CustomerDetail } from '@/interface/customer'
import { Pagination } from '@/interface/dataTable'
import MainLayout from '@/layout/MainLayout'
import { requestReportInterface } from '@/services/report'
import { brandState } from '@/store'
import { DoubleRightOutlined } from '@ant-design/icons'
import { Breadcrumb, Col, Row, Select as AntSelect, Typography } from 'antd'
import { Field, Form, Formik } from 'formik'
import { debounce } from 'lodash'
import moment from 'moment'
import Link from 'next/link'
import React, { ReactElement, useState } from 'react'
import { useRecoilState } from 'recoil'
import * as Yup from 'yup'
import { consumerList } from '../../services/consumer'
import OrderHistoryComponent from './component'

const { Title } = Typography
const { Option } = AntSelect

const OrderHistory = (): ReactElement => {
  const [brandObject, setBrandState] = useRecoilState(brandState)
  const [customers, setCustomer] = useState<Array<CustomerDetail>>([])
  const initialValues = {
    brand_id: brandObject.id,
    page: 1,
    per_page: 10,
    rider_id: '',
    status: '',
    startdate: '',
    enddate: '',
    starttime: '',
    endtime: '',
    order_number: '',
  }
  const Schema = Yup.object().shape({})

  let [pagination, setPagination] = useState<Pagination>({
    total: 0,
    current: 1,
    pageSize: 10,
  })
  let [params, setParams] = useState<requestReportInterface>({
    brand_id: brandObject.id,
    page: pagination.current,
    per_page: pagination.pageSize,
  })

  const handleSubmit = (values: any) => {
    var startDate = values.client_time ? values.client_time.start : ''
    var endDate = values.client_time ? values.client_time.end : ''

    setParams({
      ...params,
      brand_id: brandObject.id,
      status: values.status || '',
      order_overall_status: values.order_overall_status || '',
      rider_id: values.rider_id || '',
      merchant_overall_status: values.merchant_overall_status || '',
      rider_status: values.rider_status || '',
      rider_overall_status: values.rider_overall_status || '',
      order_number: values.order_number || '',
      startdate: startDate ? moment(startDate).format('YYYY-MM-DD') : '',
      enddate: endDate ? moment(endDate).format('YYYY-MM-DD') : '',
      starttime: startDate ? moment(startDate).format('HH:mm:ss') : '',
      endtime: endDate ? moment(endDate).format('HH:mm:ss') : '',
    })
  }

  const onSearchCustomerDebounce = debounce(async (message) => await fetchCustomer(message), 800)

  const fetchCustomer = async (message: any) => {
    console.log('message', message)
    const request = {
      keyword: message,
    }

    const { result, success } = await consumerList(request)
    if (success) {
      const { meta, data } = result
      setCustomer(data)
      console.log('fetchCustomer data', data)
    }
  }

  const fetchRider = async (message: any) => {
    console.log('message', message)
  }

  const fetchMerchant = async (message: any) => {
    console.log('message', message)
  }

  return (
    <MainLayout>
      <Title level={4}>บัญชีผู้ใช้งาน</Title>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>การจัดการออเดอร์</Breadcrumb.Item>
        <Breadcrumb.Item>ออเดอร์ทั้งหมด</Breadcrumb.Item>
      </Breadcrumb>
      <Card>
        <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={Schema}>
          {({ values, resetForm }) => (
            <Form>
              <Row gutter={16}>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'เลขออเดอร์' }}
                    name="order_number"
                    component={Input}
                    id="order_number"
                    placeholder="เลขออเดอร์"
                  />

                  <Field
                    label={{ text: 'สถานะออเดอร์' }}
                    name="order_overall_status"
                    component={Select}
                    id="order_overall_status"
                    placeholder="สถานะออเดอร์"
                    selectOption={[
                      {
                        name: 'ทุกสถานะ',
                        value: '',
                      },
                      {
                        name: 'waiting',
                        value: 'waiting',
                      },
                      {
                        name: 'success',
                        value: 'success',
                      },
                      {
                        name: 'cancel',
                        value: 'cancel',
                      },
                    ]}
                  />
                </Col>

                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'ชื่อร้านค้า' }}
                    name="outlet_name"
                    component={Input}
                    id="outlet_name"
                    placeholder="ชื่อร้านค้า"
                  />

                  <Field
                    label={{ text: 'สถานะร้านค้า' }}
                    name="merchant_overall_status"
                    component={Select}
                    id="merchant_overall_status"
                    placeholder="สถานะร้านค้า"
                    // defaultValue={'ทุกสถานะ'}
                    selectOption={[
                      {
                        name: 'ทุกสถานะ',
                        value: '',
                      },
                      {
                        name: 'waiting',
                        value: 'waiting',
                      },
                      {
                        name: 'success',
                        value: 'success',
                      },
                      {
                        name: 'cancel',
                        value: 'cancel',
                      },
                    ]}
                  />
                </Col>

                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'ชื่อไรเดอร์' }}
                    name="rider_name"
                    component={Input}
                    id="rider_name"
                    placeholder="ชื่อไรเดอร์"
                  />

                  <Field
                    label={{ text: 'สถานะไรเดอร์' }}
                    name="rider_overall_status"
                    component={Select}
                    id="rider_overall_status"
                    placeholder="สถานะไรเดอร์"
                    // defaultValue={'ทุกสถานะ'}
                    selectOption={[
                      {
                        name: 'ทุกสถานะ',
                        value: '',
                      },
                      {
                        name: 'waiting',
                        value: 'waiting',
                      },
                      {
                        name: 'success',
                        value: 'success',
                      },
                      {
                        name: 'cancel',
                        value: 'cancel',
                      },
                    ]}
                  />
                </Col>

                <Col className="gutter-row" span={6}>
                  {/* <Field
                    label={{ text: 'ชื่อลูกค้า' }}
                    name="customer_name"
                    component={Input}
                    id="customer_name"
                    placeholder="ชื่อลูกค้า"
                  /> */}

                  <Field
                    label={{ text: 'ชื่อลูกค้า' }}
                    name="customer_name"
                    component={Select}
                    id="customer_name"
                    placeholder="ชื่อลูกค้า"
                    showSearch
                    showArrow={false}
                    onSearch={onSearchCustomerDebounce}
                    // defaultValue={{ value: 'all' }}
                    selectOption={[]}
                  />

                  {/* <AntSelect
                    showArrow={false}
                    showSearch
                    style={{ width: 200 }}
                    placeholder="Select Brand"
                    optionFilterProp="children"
                    onSearch={onSearchDebounce}
                  >
                    <Option value="jack">Jack aaaaaaaaaaaa</Option>
                    <Option value="lucy">Lucy</Option>
                    <Option value="tom">Tom</Option>
                  </AntSelect> */}

                  <Field
                    label={{ text: 'วันเวลาที่ทำรายการ' }}
                    name="client_time"
                    component={DateTimeRangePicker}
                    id="client_time"
                    placeholder="วันเวลาที่ทำรายการ"
                  />
                </Col>

                <Col className="gutter-row" span={6}>
                  <div className="ant-form ant-form-vertical">
                    <Button
                      style={{ width: '120px', marginTop: '27px' }}
                      type="default"
                      size="middle"
                      htmlType="reset"
                      onClick={() => resetForm()}
                    >
                      เคลียร์
                    </Button>
                    <Button
                      style={{ width: '120px', marginTop: '27px', marginLeft: '10px' }}
                      type="primary"
                      size="middle"
                      htmlType="submit"
                    >
                      ค้นหา
                    </Button>
                  </div>
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
      </Card>
      <OrderHistoryComponent
        payload={{ ...params }}
        tableHeader={
          <div style={{ textAlign: 'right' }}>
            <Link href="/orderhistory">
              <a>
                view all <DoubleRightOutlined />
              </a>
            </Link>
          </div>
        }
        isPagination={pagination}
      />
    </MainLayout>
  )
}

export default OrderHistory
