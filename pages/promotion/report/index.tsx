import Button from '@/components/Button'
import Card from '@/components/Card'
import DateTimeRangePicker from '@/components/Form/DateTimeRangePicker'
import Select from '@/components/Form/Select'
import { BrandDetail } from '@/interface/brand'
import { SelectOption } from '@/interface/common'
import { Pagination } from '@/interface/dataTable'
import MainLayout from '@/layout/MainLayout'
import { outletListById } from '@/services/merchant'
import { getBrandList } from '@/services/pos-profile'
import { promotionTrackingQueryList } from '@/services/promotion'
import { DownloadOutlined } from '@ant-design/icons'
import { Breadcrumb, Col, Row, Typography } from 'antd'
import { Field, Form, Formik } from 'formik'
import { debounce, isEmpty, isEqual, map, uniqWith } from 'lodash'
import moment from 'moment'
import React, { ReactElement, useState } from 'react'
import * as Yup from 'yup'
import PromotionTrackingComponent from './component'
const { Title } = Typography

const PromotionReport = (): ReactElement => {
  const Schema = Yup.object().shape({})
  const [brandDropDown, setBrandDropDown] = useState<Array<SelectOption>>([])
  const [outletDropDown, setOutletDropDown] = useState<Array<SelectOption>>([])

  const overAllOption = [
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
  ]

  const initialValues = {
    page: 1,
    per_page: 10,
    status: '',
    startdate: '',
    enddate: '',
    order_number: '',
    client_time: {
      start: '',
      end: '',
    },
    brand_id: null,
  }

  let [pagination, setPagination] = useState<Pagination>({
    total: 0,
    current: 1,
    pageSize: 10,
  })
  let [params, setParams] = useState<promotionTrackingQueryList>({
    page: pagination.current,
    per_page: pagination.pageSize,
  })

  const handleSubmit = (values: any) => {
    manageParam(values)
  }

  const manageParam = (values: any) => {
    var startDate = values.client_time ? values.client_time.start : ''
    var endDate = values.client_time ? values.client_time.end : ''

    let reqStartDate = ''
    let reqEndDate = ''

    if (!isEmpty(startDate) && !isEmpty(endDate)) {
      reqStartDate =
        moment(startDate).format('YYYY-MM-DD') + ' ' + moment(startDate).format('HH:mm:ss')
      reqEndDate = moment(endDate).format('YYYY-MM-DD') + ' ' + moment(endDate).format('HH:mm:ss')
    }

    setParams({
      ...params,
      status: values.status || '',
      outlet_id: values.outlet_id || '',
      brand_id: values.brand_id || '',
      start_date: startDate ? reqStartDate : '',
      end_date: endDate ? reqEndDate : '',
    })
  }

  const exportData = async (values: any) => {}

  const onSearchBrandDebounce = debounce(async (message) => await fetchBrand(message), 800)
  const onSearchOutletDebounce = debounce(async (message, brand_id) => {
    await fetchOutlet(message, brand_id)
  }, 800)

  const fetchBrand = async (message: string) => {
    if (!isEmpty(message)) {
      const request = {
        keyword: message,
        page: 1,
        per_page: 100,
      }

      const { result, success } = await getBrandList(request)
      if (success) {
        const { meta, data } = result

        let uniqData = uniqWith(data, isEqual)

        let brandData = map<BrandDetail, SelectOption>(uniqData, function (item: BrandDetail) {
          return { name: item.name.th, value: String(item.id) }
        })

        setBrandDropDown(brandData)
      }
    } else {
      setBrandDropDown([])
    }
  }

  const fetchOutlet = async (message: string, brand_id: number) => {
    if (!isEmpty(message)) {
      const request = {
        keyword: message,
        brand_id: brand_id,
        page: 1,
        per_page: 100,
        soft_delete: true,
      }

      const { result, success } = await outletListById(request)
      if (success) {
        const { meta, data } = result

        let uniqData = uniqWith(data, isEqual)

        let outletData = map<BrandDetail, SelectOption>(uniqData, function (item: BrandDetail) {
          return { name: item.name.th, value: String(item.id) }
        })

        setOutletDropDown(outletData)
      }
    } else {
      setOutletDropDown([])
    }
  }

  const onClearBrand = () => {
    setBrandDropDown([])
  }

  const onClearOutlet = () => {
    setOutletDropDown([])
  }

  return (
    <MainLayout>
      <Title level={4}>โปรโมชั่น</Title>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>โปรโมชั่น</Breadcrumb.Item>
        <Breadcrumb.Item>รายงานโปรโมชั่น</Breadcrumb.Item>
      </Breadcrumb>
      <Card>
        <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={Schema}>
          {({ values, resetForm }) => (
            <Form>
              <Row gutter={16}>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'แบรนด์' }}
                    name="brand_id"
                    component={Select}
                    id="brand_id"
                    placeholder="แบรนด์"
                    showSearch
                    showArrow={false}
                    onSearch={onSearchBrandDebounce}
                    selectOption={brandDropDown}
                    filterOption={false}
                    allowClear={true}
                    onClear={onClearBrand}
                  />
                </Col>

                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'สาขา' }}
                    name="outlet_id"
                    component={Select}
                    id="outlet_id"
                    placeholder="สาขา"
                    showSearch
                    showArrow={false}
                    onSearch={(message: any) => onSearchOutletDebounce(message, values.brand_id)}
                    selectOption={outletDropDown}
                    filterOption={false}
                    allowClear={true}
                    onClear={onClearOutlet}
                    disabled={isEmpty(values.brand_id)}
                  />
                </Col>

                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'สถานะ' }}
                    name="status"
                    component={Select}
                    id="status"
                    placeholder="สถานะ"
                    selectOption={overAllOption}
                  />
                </Col>

                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'วันเวลาที่ทำรายการ' }}
                    name="client_time"
                    component={DateTimeRangePicker}
                    id="client_time"
                    placeholder="วันเวลาที่ทำรายการ"
                    minDate={moment(values.client_time.end).subtract(3, 'month')}
                    maxDate={moment(values.client_time.start).add(3, 'month')}
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

                <Col className="gutter-row" span={18} style={{ textAlign: 'end' }}>
                  <div className="ant-form ant-form-vertical">
                    <Button
                      icon={<DownloadOutlined />}
                      style={{ width: '120px', marginTop: '27px', marginLeft: '10px' }}
                      type="primary"
                      size="middle"
                      htmlType="button"
                      onClick={async () => {
                        await exportData(values)
                      }}
                      disabled={values.client_time.start == '' && values.client_time.end == ''}
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
      <PromotionTrackingComponent payload={{ ...params }} isPagination={pagination} />
    </MainLayout>
  )
}

export default PromotionReport
