import Card from '@/components/Card'
import ExportButton from '@/components/credit/ExportButton'
import DateRangePicker from '@/components/Form/DateRangePicker'
import Select from "@/components/Form/Select"
import LsSummaryComponent from '@/components/LsSummary'
import { Pagination } from '@/interface/dataTable'
import MainLayout from '@/layout/MainLayout'
import {
  getCity,
  getDistrict,
  getProvince
} from '@/services/pos-profile'
import { getProductTypes } from '@/services/product-type'
import { exportOrderWithProductByEmail, requestReportInterface } from '@/services/report'
import { Breadcrumb, Col, message, notification, Row, Typography } from 'antd'
import { Field, Form, Formik } from 'formik'
import _, { map } from 'lodash'
import moment from 'moment'
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

interface InterfaceOption {
  value: string | number
  name: string
}

interface DistrictInterface {
  district_id: number
  city_id: number
  province_id: number
  name_th: string
  name_en: string
  zipcode: string
}

interface ProviceInterface {
  province_id: number
  name_th: string
  name_en: string
}

interface CityInterface {
  city_id: number
  province_id: number
  name_th: string
  name_en: string
}

export default function OrderHistoryFoodType({ }: Props): ReactElement {
  const Schema = Yup.object().shape({})
  const [provinceList, setProvinceList] = useState<Array<InterfaceOption>>([])
  const [cityList, setCityList] = useState<Array<InterfaceOption>>([])
  const [districtList, setDistrictList] = useState<Array<InterfaceOption>>([])
  const [productTypeList, setProductTypeList] = useState<Array<InterfaceOption>>([])
  const [districtData, setDistrciData] = useState<Array<DistrictInterface>>([])

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
    district_id: null,
    sub_district_id: null,
    province_id: null,
    order_status: null,
    food_type: null
  }

  let [pagination, setPagination] = useState<Pagination>({
    total: 0,
    current: 1,
    pageSize: 10,
  })


  let [params, setParams] = useState<requestReportInterface>({
    brand_id: 'all',
    // delivery_type: 'delivery',
    page: pagination.current,
    per_page: pagination.pageSize,
  })

  const manageParam = (values: any) => {
    var startDate = values.client_time ? values.client_time.start : ''
    var endDate = values.client_time ? values.client_time.end : ''

    setParams({
      ...params,
      brand_id: 'all',
      // delivery_type: 'delivery',
      sso_id: values.sso_id || '',
      // status: values.status || '',
      // order_overall_status: values.order_overall_status || '',
      // rider_id: values.rider_id || '',
      // branch_id: values.branch_id || '',
      // merchant_overall_status: values.merchant_overall_status || '',
      // rider_status: values.rider_status || '',
      // rider_overall_status: values.rider_overall_status || '',
      // order_number: values.order_number || '',
      startdate: startDate ? moment(startDate).format('YYYY-MM-DD') : '',
      enddate: endDate ? moment(endDate).format('YYYY-MM-DD') : '',
      starttime: startDate ? moment(startDate).format('HH:mm:ss') : '',
      endtime: endDate ? moment(endDate).format('HH:mm:ss') : '',
      district_id: values.district_id || '',
      sub_district_id: values.sub_district_id || '',
      province_id: values.province_id || '',
      order_status: values.order_status || '',
      food_type: values.food_type || '',
    })
  }

  const fetchProvince = async () => {
    const { success, result } = await getProvince()
    if (success) {
      const { result: data } = result
      const { items } = data
      const provinceOption = map(items, (item: ProviceInterface) => ({
        value: item.province_id,
        name: item.name_th,
      }))
      setProvinceList(provinceOption)
    } else {
      message.error({ content: 'ไม่สามารถดึงค่าที่อยู่ได้กรุณาลองใหม่อีกครั้ง' })
    }
  }

  const fetchCity = async (proviceId: number) => {
    const { success, result } = await getCity({ province_id: proviceId })
    if (success) {
      const { result: data } = result
      const { items } = data
      const cityOption = map(items, (item: CityInterface) => ({
        value: item.city_id,
        name: item.name_th,
      }))
      setCityList(cityOption)
    } else {
      message.error({ content: 'ไม่สามารถดึงค่าที่อยู่ได้กรุณาลองใหม่อีกครั้ง' })
    }
  }

  const fetchDistrict = async (cityId: number) => {
    const { success, result } = await getDistrict({ city_id: cityId })
    if (success) {
      const { result: data } = result
      const { items } = data
      const districtOption = map(items, (item: DistrictInterface) => ({
        value: item.district_id,
        name: item.name_th,
      }))
      setDistrictList(districtOption)
      setDistrciData(items)
    } else {
      message.error({ content: 'ไม่สามารถดึงค่าที่อยู่ได้กรุณาลองใหม่อีกครั้ง' })
    }
  }

  const fetchProductTypes = async () => {
    const { success, result } = await getProductTypes({})
    if (success) {
      const productTypeOption = map(result?.data, (item: any) => ({
        value: item.name.th,
        name: item.name.th,
      }))
      setProductTypeList(productTypeOption)
    } else {
      message.error({ content: 'ไม่สามารถดึงค่าที่อยู่ได้กรุณาลองใหม่อีกครั้ง' })
    }
  }
  useEffect(() => {
    fetchProvince()
    fetchProductTypes()
    return () => {
      setProvinceList([])
      setCityList([])
      setDistrictList([])
      setDistrciData([])
    }
  }, [])
  return (
    <MainLayout>
      <Title level={4}>การจัดการออเดอร์</Title>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>การจัดการออเดอร์</Breadcrumb.Item>
        <Breadcrumb.Item>สรุปข้อมูลออเดอร์รายประเภทอาหาร</Breadcrumb.Item>
      </Breadcrumb>
      <Card>
        <Formik initialValues={initialValues} onSubmit={manageParam} validationSchema={Schema}>
          {({ setFieldValue }) => (
            <Form>
              <Row gutter={16}>
                <Col span={4}>
                  <Field
                    component={Select}
                    className="form-control round"
                    label={{ text: 'ประเภทอาหาร' }}
                    placeholder="ประเภทอาหาร"
                    name="food_type"
                    selectOption={productTypeList}
                  />
                </Col>
                <Col span={2}>
                  <Field
                    component={Select}
                    className="form-control round"
                    label={{ text: 'สถานะ' }}
                    placeholder="สถานะ"
                    name="order_status"
                    selectOption={[
                      {
                        name: 'สถานะ',
                        value: '',
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
                <Col span={4}>
                  <Field
                    onChange={async (value: number) => {
                      setParams({ ...params, sub_district_id: undefined, district_id: undefined, province_id: String(value) })
                      if (setFieldValue) {
                        setFieldValue("province_id", value)
                        setFieldValue('district_id', null)
                        setFieldValue('sub_district_id', null)
                      }
                      await fetchCity(value)
                    }}
                    component={Select}
                    className="form-control round"
                    label={{ text: 'จังหวัด' }}
                    placeholder="จังหวัด"
                    name="province_id"
                    selectOption={provinceList}
                  />
                </Col>
                <Col span={4}>
                  <Field
                    disabled={!params.province_id}
                    onChange={async (value: number) => {
                      setParams({ ...params, sub_district_id: undefined, district_id: String(value) })
                      if (setFieldValue) {
                        setFieldValue('district_id', value)
                        setFieldValue('sub_district_id', null)
                      }
                      await fetchDistrict(value)
                    }}
                    component={Select}
                    className="form-control round"
                    label={{ text: 'เขต/อำเภอ' }}
                    placeholder="เขต/อำเภอ"
                    name="district_id"
                    selectOption={cityList}
                  />
                </Col>

                <Col span={4}>
                  <Field
                    onChange={async (value: number) => {
                      setParams({ ...params, sub_district_id: String(value) })
                      if (setFieldValue) {
                        setFieldValue('sub_district_id', value)
                      }
                    }}
                    component={Select}
                    disabled={!params.district_id}
                    className="form-control round"
                    label={{ text: 'แขวง/ตำบล' }}
                    placeholder="แขวง/ตำบล"
                    name="sub_district_id"
                    selectOption={districtList}
                  />
                </Col>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'วันที่ทำรายการ *' }}
                    name="client_time"
                    component={DateRangePicker}
                    id="client_time"
                    placeholder="วันเวลาที่ทำรายการ"
                  />
                </Col>

              </Row>
              <Row gutter={16}>

                <Col className="gutter-row" span={4} >
                  <div className="ant-form ant-form-vertical" style={{ display: "flex", justifyContent: "start" }}>
                    <ExportButton title='ส่งข้อมูลสรุปข้อมูลออเดอร์รายประเภทอาหารไปยังอีเมล'
                      // subtitle={`ข้อมูลออเดอร์วันที่ ` + moment().format("YYYY-MM-DD")} 
                      propsSubmit={async (value: any) => {
                        _.pull(value.emails, "")

                        console.log("value: ", value)
                        console.log("params: ", params)
                        const { result, success } = await exportOrderWithProductByEmail({
                          email: value.emails,
                          start_date: params.startdate,
                          end_date: params.enddate,
                          status: params.order_status,
                          province_id: params.province_id,
                          district_id: params.district_id,
                          sub_district_id: params.sub_district_id,
                          product_type: params.food_type
                        }
                        )
                        if (success) {
                          notification.success({
                            message: `ดาวน์โหลดไฟล์สรุปข้อมูลออเดอร์รายประเภทอาหาร เรียบร้อยแล้ว`,
                            description: '',
                          })
                        }
                      }} />
                  </div>
                </Col>
              </Row>

            </Form>
          )}
        </Formik>
      </Card>

      <LsSummaryComponent payload={{ ...params }} isPagination={pagination} />


    </MainLayout>
  )
}
