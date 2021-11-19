import Button from '@/components/Button'
import Card from '@/components/Card'
import DateTimeRangePicker from '@/components/Form/DateTimeRangePicker'
import Input from '@/components/Form/Input'
import Select from '@/components/Form/Select'
import { SelectOption } from '@/interface/common'
import { CustomerDetail } from '@/interface/customer'
import { Pagination } from '@/interface/dataTable'
import { OutletDetail } from '@/interface/outlet'
import { RiderDetail } from '@/interface/rider'
import MainLayout from '@/layout/MainLayout'
import { outletListById } from '@/services/merchant'
import { requestReportInterface } from '@/services/report'
import { getRider } from '@/services/rider'
import { Breadcrumb, Col, Row, Typography } from 'antd'
import { Field, Form, Formik } from 'formik'
import { debounce, isEqual, map, uniqWith } from 'lodash'
import moment from 'moment'
import React, { ReactElement, useState } from 'react'
import * as Yup from 'yup'
import { consumerList } from '../../services/consumer'
import OrderHistoryComponent from './component'
const { Title } = Typography

const OrderHistory = (): ReactElement => {
  const Schema = Yup.object().shape({})
  // const [brandObject, setBrandState] = useRecoilState(brandState)
  const [customerDropDown, setCustomerDropDown] = useState<Array<SelectOption>>([])
  const [merchantDropDown, setMerchantDropDown] = useState<Array<SelectOption>>([])
  const [riderDropDown, setRiderDropDown] = useState<Array<SelectOption>>([])

  const initialValues = {
    brand_id: 'all',
    page: 1,
    per_page: 10,
    status: '',
    startdate: '',
    enddate: '',
    starttime: '',
    endtime: '',
    order_number: '',
  }

  let [pagination, setPagination] = useState<Pagination>({
    total: 0,
    current: 1,
    pageSize: 10,
  })
  let [params, setParams] = useState<requestReportInterface>({
    brand_id: 'all',
    page: pagination.current,
    per_page: pagination.pageSize,
  })

  const handleSubmit = (values: any) => {
    var startDate = values.client_time ? values.client_time.start : ''
    var endDate = values.client_time ? values.client_time.end : ''

    setParams({
      ...params,
      brand_id: 'all',
      sso_id: values.sso_id || '',
      status: values.status || '',
      order_overall_status: values.order_overall_status || '',
      rider_id: values.rider_id || '',
      branch_id: values.branch_id || '',
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

  const overAllOption = [
    {
      name: 'ทุกสถานะ',
      value: '',
    },
    {
      name: 'ดำเนินการ',
      value: 'waiting',
    },
    {
      name: 'สำเร็จ',
      value: 'success',
    },
    {
      name: 'ยกเลิก',
      value: 'cancel',
    },
  ]
  const onSearchCustomerDebounce = debounce(async (message) => await fetchCustomer(message), 800)
  const onSearchMerchantDebounce = debounce(async (message) => await fetchMerchant(message), 800)
  const onSearchRiderDebounce = debounce(async (message) => await fetchRider(message), 800)

  const fetchCustomer = async (message: any) => {
    const request = {
      keyword: message,
    }

    const { result, success } = await consumerList(request)
    if (success) {
      const { meta, data } = result

      let customerData = map<CustomerDetail, SelectOption>(data, function (item: CustomerDetail) {
        return { name: item.first_name + ' ' + item.last_name, value: item.sso_id }
      })

      setCustomerDropDown(customerData)
    }
  }

  const fetchRider = async (message: any) => {
    const request = {
      keyword: message,
      page: 1,
      per_page: 100,
    }

    const { result, success } = await getRider(request)
    if (success) {
      const { meta, data } = result

      let uniqData = uniqWith(data, isEqual)

      let riderData = map<RiderDetail, SelectOption>(uniqData, function (item: RiderDetail) {
        return { name: item.first_name + ' ' + item.last_name, value: String(item.id) }
      })

      setRiderDropDown(riderData)
    }
  }

  const fetchMerchant = async (message: string) => {
    const request = {
      keyword: message,
      page: 1,
      per_page: 100,
    }

    const { result, success } = await outletListById(request)
    if (success) {
      const { meta, data } = result

      let uniqData = uniqWith(data, isEqual)

      let outletData = map<OutletDetail, SelectOption>(uniqData, function (item: OutletDetail) {
        return { name: item.name.en, value: String(item.id) }
      })

      setMerchantDropDown(outletData)
    }
  }

  const onClearCustomer = () => {
    setCustomerDropDown([])
  }

  const onClearMerchant = () => {
    setRiderDropDown([])
  }

  const onClearRider = () => {
    setMerchantDropDown([])
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
                    selectOption={overAllOption}
                  />
                </Col>

                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'ชื่อร้านค้า' }}
                    name="branch_id"
                    component={Select}
                    id="branch_id"
                    placeholder="ชื่อร้านค้า"
                    showSearch
                    showArrow={false}
                    onSearch={onSearchMerchantDebounce}
                    selectOption={merchantDropDown}
                    filterOption={false}
                    allowClear={true}
                    onClear={onClearMerchant}
                  />

                  <Field
                    label={{ text: 'สถานะร้านค้า' }}
                    name="merchant_overall_status"
                    component={Select}
                    id="merchant_overall_status"
                    placeholder="สถานะร้านค้า"
                    selectOption={overAllOption}
                  />
                </Col>

                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'ชื่อไรเดอร์' }}
                    name="rider_id"
                    component={Select}
                    id="rider_id"
                    placeholder="ชื่อไรเดอร์"
                    showSearch
                    showArrow={false}
                    onSearch={onSearchRiderDebounce}
                    selectOption={riderDropDown}
                    filterOption={false}
                    allowClear={true}
                    onClear={onClearRider}
                  />

                  <Field
                    label={{ text: 'สถานะไรเดอร์' }}
                    name="rider_overall_status"
                    component={Select}
                    id="rider_overall_status"
                    placeholder="สถานะไรเดอร์"
                    selectOption={overAllOption}
                  />
                </Col>

                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'ชื่อลูกค้า' }}
                    name="sso_id"
                    component={Select}
                    id="sso_id"
                    placeholder="ชื่อลูกค้า"
                    showSearch
                    showArrow={false}
                    onSearch={onSearchCustomerDebounce}
                    selectOption={customerDropDown}
                    filterOption={false}
                    allowClear={true}
                    onClear={onClearCustomer}
                  />

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
      <OrderHistoryComponent payload={{ ...params }} isPagination={pagination} />
    </MainLayout>
  )
}

export default OrderHistory