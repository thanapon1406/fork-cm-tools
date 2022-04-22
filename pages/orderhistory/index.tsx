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
import { downloadFile, exportOrderTransaction, requestReportInterface } from '@/services/report'
import { getRider } from '@/services/rider'
import { DownloadOutlined } from '@ant-design/icons'
import { Breadcrumb, Col, notification, Row, Typography } from 'antd'
import { Field, Form, Formik } from 'formik'
import lodash, { debounce, isEmpty, isEqual, map, uniqWith } from 'lodash'
import moment from 'moment'
import React, { ReactElement, useState } from 'react'
import * as Yup from 'yup'
import { consumerList } from '../../services/consumer'
import OrderHistoryComponent from './component'
const { Title } = Typography

const OrderHistory = (): ReactElement => {
  const Schema = Yup.object().shape({})
  const [customerDropDown, setCustomerDropDown] = useState<Array<SelectOption>>([])
  const [merchantDropDown, setMerchantDropDown] = useState<Array<SelectOption>>([])
  const [riderDropDown, setRiderDropDown] = useState<Array<SelectOption>>([])

  const initialValues = {
    delivery_type: 'delivery',
    brand_id: 'all',
    page: 1,
    per_page: 10,
    status: null,
    startdate: moment().startOf('day'),
    enddate: moment().endOf('day'),
    starttime: moment().startOf('day'),
    endtime: moment().endOf('day'),
    order_number: '',
    client_time: {
      start: moment().startOf('day'),
      end: moment().endOf('day'),
    },
    sso_id: null,
    order_overall_status: null,
    rider_id: null,
    rider_partner_type: null,
    rider_status: null,
    rider_overall_status: null,
    branch_id: null,
    merchant_overall_status: null,
    merchant_status: null,
  }

  let [pagination, setPagination] = useState<Pagination>({
    total: 0,
    current: 1,
    pageSize: 10,
  })
  let [params, setParams] = useState<requestReportInterface>({
    brand_id: 'all',
    delivery_type: 'delivery',
    page: pagination.current,
    per_page: pagination.pageSize,
  })

  const handleSubmit = (values: any) => {
    manageParam(values)
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
  const orderStatus = [
    {
      name: 'ทุกสถานะ',
      value: '',
    },
    {
      name: 'รอรับออเดอร์',
      value: 'waiting',
    },
    {
      name: 'รอการจ่ายเงิน',
      value: 'waiting_payment',
    },
    {
      name: 'ยืนยันการจ่ายเงิน',
      value: 'confirm_payment',
    },
    {
      name: 'กำลังปรุง',
      value: 'cooking',
    },
    {
      name: 'ปรุงสำเร็จ',
      value: 'cooked',
    },
    {
      name: 'กำลังจัดส่ง',
      value: 'picked_up',
    },
    {
      name: 'จัดส่งแล้ว',
      value: 'arrived',
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

  const merchantStatus = [
    {
      name: 'ทุกสถานะ',
      value: '',
    },
    {
      name: 'รอรับออเดอร์',
      value: 'waiting',
    },
    {
      name: 'รับออเดอร์',
      value: 'accept_order',
    },
    {
      name: 'กำลังปรุง',
      value: 'cooking',
    },
    {
      name: 'ปรุงสำเร็จ',
      value: 'cooked',
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

  const riderStatus = [
    {
      name: 'ทุกสถานะ',
      value: '',
    },
    {
      name: 'รอเรียกไรเดอร์',
      value: 'waiting',
    },
    {
      name: 'กำลังเรียกไรเดอร์',
      value: 'assigning',
    },
    {
      name: 'ไรเดอร์รับงาน',
      value: 'assigned',
    },
    {
      name: 'กำลังไปที่ร้านอาหาร',
      value: 'going_merchant',
    },
    {
      name: 'รับอาหารแล้ว',
      value: 'picking_up',
    },
    {
      name: 'กำลังจัดส่ง',
      value: 'picked_up',
    },
    {
      name: 'จัดส่งแล้ว',
      value: 'arrived',
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

  const riderPartnerTypeOption = [
    {
      name: 'ทุกประเภท',
      value: '',
    },
    {
      name: 'Lalamove',
      value: 'LALAMOVE',
    },
    {
      name: 'PandaGo',
      value: 'PANDAGO',
    },
  ]

  const riderTypeOption = [
    {
      name: 'ทุกประเภท',
      value: '',
    },
    {
      name: 'Default Rider',
      value: 'outlet',
    },
    {
      name: 'Partner',
      value: 'partner',
    },
  ]

  const paymentChannelOption = [
    {
      name: 'เงินสด',
      value: 'PAYMENT_CASH',
    },
    {
      name: 'พร้อมเพย์',
      value: 'PAYMENT_PROMTPAY',
    },
    {
      name: 'บัตรเครดิต',
      value: 'PAYMENT_CREDIT',
    },
    {
      name: 'ชำระผ่านบัญชีธนาคาร',
      value: 'PAYMENT_BANK_TRANSFER',
    },
  ]

  const onSearchCustomerDebounce = debounce(async (message) => await fetchCustomer(message), 800)
  const onSearchMerchantDebounce = debounce(async (message) => await fetchMerchant(message), 800)
  const onSearchRiderDebounce = debounce(async (message) => await fetchRider(message), 800)

  const fetchCustomer = async (message: any) => {
    if (!isEmpty(message)) {
      const request = {
        keyword: message,
      }

      const { result, success } = await consumerList(request)
      if (success) {
        const { meta, data } = result

        let customerData = map<CustomerDetail, SelectOption>(data, function (item: CustomerDetail) {
          let lastName = ''
          if (item?.last_name) {
            lastName = item?.last_name
          }
          return { name: item.first_name + ' ' + lastName, value: item.sso_id }
        })

        setCustomerDropDown(customerData)
      }
    } else {
      setCustomerDropDown([])
    }
  }

  const fetchRider = async (message: any) => {
    if (!isEmpty(message)) {
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
          let lastName = ''
          if (item?.last_name) {
            lastName = item?.last_name
          }
          return { name: item.first_name + ' ' + lastName, value: String(item.id) }
        })

        setRiderDropDown(riderData)
      }
    } else {
      setRiderDropDown([])
    }
  }

  const fetchMerchant = async (message: string) => {
    if (!isEmpty(message)) {
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
          return { name: item.name.th, value: String(item.id) }
        })

        setMerchantDropDown(outletData)
      }
    } else {
      setMerchantDropDown([])
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

  const manageParam = (values: any) => {
    var startDate = values.client_time ? values.client_time.start : ''
    var endDate = values.client_time ? values.client_time.end : ''

    setParams({
      ...params,
      brand_id: 'all',
      delivery_type: 'delivery',
      sso_id: values.sso_id || '',
      status: values.status || '',
      order_overall_status: values.order_overall_status || '',
      rider_id: values.rider_id || '',
      payment_channel: values.payment_channel || '',
      rider_partner_type: values.rider_partner_type || '',
      rider_type: values.rider_type || '',
      branch_id: values.branch_id || '',
      merchant_overall_status: values.merchant_overall_status || '',
      merchant_status: values.merchant_status || '',
      rider_status: values.rider_status || '',
      rider_overall_status: values.rider_overall_status || '',
      order_number: values.order_number || '',
      startdate: startDate ? moment(startDate).format('YYYY-MM-DD') : '',
      enddate: endDate ? moment(endDate).format('YYYY-MM-DD') : '',
      starttime: startDate ? moment(startDate).format('HH:mm:ss') : '',
      endtime: endDate ? moment(endDate).format('HH:mm:ss') : '',
    })
  }

  const exportOrderData = async (values: any) => {
    var startDate = values.client_time ? values.client_time.start : ''
    var endDate = values.client_time ? values.client_time.end : ''

    const req: object = {
      sort_by: 'ClientTime',
      sort_type: 'asc',
      brand_id: 'all',
      sso_id: values.sso_id || '',
      status: values.status || '',
      order_overall_status: values.order_overall_status || '',
      rider_id: values.rider_id || '',
      branch_id: values.branch_id || '',
      payment_channel: values.payment_channel || '',
      rider_partner_type: values.rider_partner_type || '',
      rider_type: values.rider_type || '',
      merchant_overall_status: values.merchant_overall_status || '',
      merchant_status: values.merchant_status || '',
      rider_status: values.rider_status || '',
      rider_overall_status: values.rider_overall_status || '',
      order_number: values.order_number || '',
      startdate: startDate ? moment(startDate).format('YYYY-MM-DD') : '',
      enddate: endDate ? moment(endDate).format('YYYY-MM-DD') : '',
      starttime: startDate ? moment(startDate).format('HH:mm:ss') : '',
      endtime: endDate ? moment(endDate).format('HH:mm:ss') : '',
      delivery_type: 'delivery',
    }

    const { result, success } = await exportOrderTransaction(req)

    if (lodash.get(result, 'download_key')) {
      const request: object = {
        key: result.download_key,
      }
      await downloadFile(request)
    } else {
      notification.success({
        message: `ส่งรายงานไปยังอีเมลเรียบร้อยแล้ว`,
        description: '',
      })
    }
  }

  return (
    <MainLayout>
      <Title level={4}>การจัดการออเดอร์</Title>
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
                    name="status"
                    component={Select}
                    id="status"
                    placeholder="สถานะออเดอร์"
                    selectOption={orderStatus}
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
                    name="merchant_status"
                    component={Select}
                    id="merchant_status"
                    placeholder="สถานะร้านค้า"
                    selectOption={merchantStatus}
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
                    name="rider_status"
                    component={Select}
                    id="rider_status"
                    placeholder="สถานะไรเดอร์"
                    selectOption={riderStatus}
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
                <Col span={6}>
                  <Field
                    label={{ text: 'ประเภทไรเดอร์' }}
                    name="rider_type"
                    component={Select}
                    id="rider_type"
                    placeholder="ประเภทไรเดอร์"
                    selectOption={riderTypeOption}
                  />
                </Col>
                <Col span={6}>
                  <Field
                    label={{ text: 'ประเภทไรเดอร์พาทเนอร์' }}
                    name="rider_partner_type"
                    component={Select}
                    id="rider_partner_type"
                    placeholder="ประเภทไรเดอร์พาทเนอร์"
                    selectOption={riderPartnerTypeOption}
                  />
                </Col>
                <Col span={6}>
                  <Field
                    label={{ text: 'ช่องทางชำระเงิน' }}
                    name="payment_channel"
                    component={Select}
                    id="payment_channel"
                    placeholder="ช่องทางชำระเงิน"
                    selectOption={paymentChannelOption}
                  />
                </Col>
              </Row>
              <Row>
                <Col className="gutter-row" span={6}>
                  <div className="ant-form ant-form-vertical">
                    <Button
                      style={{ width: '120px', marginTop: '27px' }}
                      type="primary"
                      size="middle"
                      htmlType="submit"
                    >
                      ค้นหา
                    </Button>

                    <Button
                      style={{ width: '120px', marginTop: '27px', marginLeft: '10px' }}
                      type="default"
                      size="middle"
                      htmlType="reset"
                      onClick={() => resetForm()}
                    >
                      เคลียร์
                    </Button>
                  </div>
                </Col>

                <Col className="gutter-row" span={18} style={{ textAlign: 'end' }}>
                  <div className="ant-form ant-form-vertical">
                    <Button
                      icon={<DownloadOutlined />}
                      style={{ width: '120px', marginTop: '27px', marginLeft: '10px' }}
                      type="primary"
                      size="middle"
                      htmlType="button"
                      onClick={async () => {
                        await exportOrderData(values)
                      }}
                      disabled={!values.client_time.start && !values.client_time.end}
                    >
                      ดาวน์โหลด
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
