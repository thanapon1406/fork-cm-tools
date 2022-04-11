import Card from '@/components/Card'
import ExportButton from '@/components/credit/ExportButton'
import DateTimeRangePicker from '@/components/Form/DateTimeRangePicker'
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
import { debounce, isEmpty, isEqual, map, uniqWith } from 'lodash'
import moment from 'moment'
import React, { ReactElement, useState } from 'react'
import * as Yup from 'yup'
import { consumerList } from '../../services/consumer'


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

export default function MerchantAccount({ }: Props): ReactElement {
  const Schema = Yup.object().shape({})
  const [customerDropDown, setCustomerDropDown] = useState<Array<SelectOption>>([])
  const [merchantDropDown, setMerchantDropDown] = useState<Array<SelectOption>>([])
  const [riderDropDown, setRiderDropDown] = useState<Array<SelectOption>>([])

  const initialValues = {
    delivery_type: 'delivery',
    brand_id: 'all',
    page: 1,
    per_page: 10,
    status: '',
    startdate: '',
    enddate: '',
    starttime: '',
    endtime: '',
    order_number: '',
    client_time: {
      start: '',
      end: '',
    },
    sso_id: null,
    order_overall_status: null,
    rider_id: null,
    rider_status: null,
    rider_overall_status: null,
    branch_id: null,
    merchant_overall_status: null,
  }

  let [pagination, setPagination] = useState<Pagination>({
    total: 0,
    current: 1,
    pageSize: 10,
  })

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

  let [params, setParams] = useState<requestReportInterface>({
    brand_id: 'all',
    delivery_type: 'delivery',
    page: pagination.current,
    per_page: pagination.pageSize,
  })

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

  return (
    <MainLayout>
      <Title level={4}>การจัดการออเดอร์</Title>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>การจัดการออเดอร์</Breadcrumb.Item>
        <Breadcrumb.Item>ดาวน์โหลดไฟล์รายการออเดอร์</Breadcrumb.Item>
      </Breadcrumb>
      <Card>
        <Formik initialValues={initialValues} onSubmit={manageParam} validationSchema={Schema}>
          {() => (
            <Form>
              <Row gutter={16}>
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


                </Col>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'วันเวลาที่ทำรายการ' }}
                    name="client_time"
                    component={DateTimeRangePicker}
                    id="client_time"
                    placeholder="วันเวลาที่ทำรายการ"
                  />
                </Col>

              </Row>
              <Row gutter={16}>

                <Col className="gutter-row" span={4} >
                  <div className="ant-form ant-form-vertical" style={{ display: "flex", justifyContent: "start" }}>
                    <ExportButton title='ส่งข้อมูลรายการออเดอร์ไปยังอีเมล' subtitle={`ข้อมูลออเดอร์วันที่ ` + moment().format("YYYY-MM-DD")} propsSubmit={async (value: any) => {
                      // console.log(value.emails)
                      // _.pull(value.emails, "")
                      // const { result, success } = await exportPaymentAccount({ email: value.emails })
                      // if (success) {
                      //   notification.success({
                      //     message: `ดาวน์โหลดไฟล์รายละเอียดช่องทางการชำระเงินของร้านค้าเรียบร้อยแล้ว`,
                      //     description: '',
                      //   })
                      // }

                      var test = {
                        email: value.emails,
                        outlet_id: params.branch_id,
                        rider_id: params.rider_id,
                        start_date: params.startdate,
                        end_date: params.enddate,
                        sso_id: params.sso_id
                      }

                      console.log("emails: ", value.emails)
                      console.log("params: ", params)
                    }} />
                  </div>
                </Col>
              </Row>

            </Form>
          )}
        </Formik>
      </Card>

    </MainLayout>
  )
}
