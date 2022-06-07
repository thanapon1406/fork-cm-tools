import Card from '@/components/Card';
import Input from '@/components/Form/Input';
import Select from "@/components/Form/Select";
import { Pagination } from '@/interface/dataTable';
import MainLayout from '@/layout/MainLayout';
import {
  getCity,
  getDistrict,
  getProvince
} from '@/services/pos-profile';
import { requestReportInterface } from '@/services/report';
import { Breadcrumb, Button, Col, message, Modal, Row, Typography } from 'antd';
import { Field, Form, Formik } from 'formik';
import _, { map } from 'lodash';
import { useRouter } from 'next/router';
import { ReactElement, useEffect, useState } from 'react';
import * as Yup from 'yup';

const { Title } = Typography
const { warning } = Modal

interface Props { }


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

const initialValues = {
  name: '',
  delivery_fee: [
    {
      min: 0,
      max: '',
      price: '',
    }
  ],
  hub_ids: []
}

const Schema = Yup.object().shape({
  name: Yup.string().trim().required('กรุณากรอกชื่อ Banner')
})

interface InterfaceOption {
  value: string | number
  name: string
}

export default function ConfigDeliveryCreate({ }: Props): ReactElement {
  const router = useRouter()
  const [deliveryFeeRuleCount, setDeliveryFeeRuleCount] = useState(1)
  const [deliveryFeeRuleValidate, setDeliveryFeeRuleValidate] = useState(false)
  const [deliveryFeeRuleValidateMessage, setDeliveryFeeRuleValidateMessage] = useState("")
  const [provinceList, setProvinceList] = useState<Array<InterfaceOption>>([])
  const [cityList, setCityList] = useState<Array<InterfaceOption>>([])
  const [districtList, setDistrictList] = useState<Array<InterfaceOption>>([])
  const [districtData, setDistrciData] = useState<Array<DistrictInterface>>([])

  const handleDeductDeliveryFeeRule = (values: any, setFieldValue: any) => {
    setDeliveryFeeRuleValidate(false)
    if (deliveryFeeRuleCount > 0) {
      let formValue = values
      if (formValue) {
        let deliveryFeeValue = _.get(formValue, 'delivery_fee') ? _.get(formValue, 'delivery_fee') : []
        if (_.size(deliveryFeeValue) > 0) {
          setDeliveryFeeRuleCount(deliveryFeeRuleCount - 1)
          deliveryFeeValue.pop()
          setFieldValue("delivery_fee", deliveryFeeValue)
          setDeliveryFeeRuleValidate(false)
        }
      }
    }
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

  const renderDeliveryFeeRule = (values: any, setFieldValue: any) => {
    let deliveryFeeRuleElement = []
    for (let i = 0; i < deliveryFeeRuleCount; i++) {
      const deliveryMinParam = `delivery_fee[${i}].min`
      const deliveryMaxParam = `delivery_fee[${i}].max`
      const deliveryPriceParam = `delivery_fee[${i}].price`

      deliveryFeeRuleElement.push(
        <div key={`delivery_fee_rule#${i}`}>
          <Row key={`delivery_fee_rule_title_row#${i}`} gutter={16}>
            <Col key={`delivery_fee_rule_title#${i}`} className="gutter-row" span={2}>
              <Title level={5}>Rule {i + 1}</Title>
            </Col>
            {(i + 1) == deliveryFeeRuleCount ? <Col className="gutter-row" span={8}>
              {deliveryFeeRuleValidate ? <span style={{ "color": "red" }}>{deliveryFeeRuleValidateMessage}</span> : null}
            </Col> : null}
          </Row>
          <Row key={`delivery_fee_rule#${i}`} gutter={24}>
            <Col style={{ marginTop: 5 }} span={2}>
              <span>ระยะทาง</span>
            </Col>
            <Col className="gutter-row" span={3}>
              <Field
                name={deliveryMinParam}
                type="number"
                component={Input}
                className="form-control"
                id={deliveryMinParam}
                placeholder=""
                // disabled={(i + 1) != deliveryFeeRuleCount ? true : false}
                disabled={true}
              />
            </Col>
            <Col style={{ marginTop: 5 }} span={1}>
              <span>กม.</span>
            </Col>
            <Col style={{ marginTop: 5 }} span={1}>
              <span>ถึง</span>
            </Col>
            <Col className="gutter-row" span={3}>
              <Field
                name={deliveryMaxParam}
                type="number"
                component={Input}
                className="form-control"
                id={deliveryMaxParam}
                placeholder=""
                disabled={(i + 1) != deliveryFeeRuleCount ? true : false}
              />
            </Col>
            <Col style={{ marginTop: 5 }} span={1}>
              <span>กม.</span>
            </Col>
            <Col style={{ marginTop: 5 }} span={2}>
              <span>ราคา</span>
            </Col>
            <Col className="gutter-row" span={3}>
              <Field
                name={deliveryPriceParam}
                type="number"
                component={Input}
                className="form-control"
                id={deliveryPriceParam}
                placeholder=""
              />
            </Col>
            <Col style={{ marginTop: 5 }} span={2}>
              <span>บาท / กม.</span>
            </Col>
            {
              ((i + 1) == deliveryFeeRuleCount) && (i != 0) ?
                <Button
                  key={`delivery_fee_rule_button#${i}`}
                  style={{ width: '100px', marginBottom: '10px' }}
                  size="middle"
                  onClick={() => {
                    handleDeductDeliveryFeeRule(values, setFieldValue)
                  }}
                >
                  - ลบ Rule
                </Button> : null
            }

          </Row>
        </div>
      )
    }
    return deliveryFeeRuleElement
  }


  const handleSubmit = async (values: typeof initialValues) => {
  }

  const handleAddDeliveryFeeRule = (values: any, setFieldValue: any) => {
    setDeliveryFeeRuleValidate(false)
    let formValue = values
    // console.log("formValue", formValue)
    if (formValue) {
      let deliveryFeeValue = _.get(formValue, 'delivery_fee') ? _.get(formValue, 'delivery_fee') : []
      if (_.size(deliveryFeeValue) > 0) {
        let deliveryFeeValueSize = _.size(deliveryFeeValue)
        let lastestMaxDistanceValue = _.get(deliveryFeeValue[deliveryFeeValueSize - 1], 'max')
        let lastestMinDistanceValue = _.get(deliveryFeeValue[deliveryFeeValueSize - 1], 'min')
        if (lastestMaxDistanceValue) {
          if (Number(lastestMaxDistanceValue) > 0) {
            if (Number(lastestMinDistanceValue) >= Number(lastestMaxDistanceValue)) {
              setDeliveryFeeRuleValidateMessage(`กรุณากรอกระยะทาง Rule ${deliveryFeeRuleCount} ให้ถูกต้อง`)
              setDeliveryFeeRuleValidate(true)
            } else {
              setDeliveryFeeRuleCount(deliveryFeeRuleCount + 1)
              deliveryFeeValue.push({
                min: lastestMaxDistanceValue,
                max: '',
                price: '',
              })
              setFieldValue("delivery_fee", deliveryFeeValue)
              setDeliveryFeeRuleValidate(false)
            }
          } else {
            setDeliveryFeeRuleValidateMessage(`กรุณากรอกระยะทาง Rule ${deliveryFeeRuleCount} ให้ถูกต้อง`)
            setDeliveryFeeRuleValidate(true)
          }
        } else {
          setDeliveryFeeRuleValidateMessage(`กรุณากรอกระยะทาง Rule ${deliveryFeeRuleCount} ให้ครบถ้วน`)
          setDeliveryFeeRuleValidate(true)
        }
      }
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

  useEffect(() => {
    fetchProvince()
    return () => {
      setProvinceList([])
      setCityList([])
      setDistrictList([])
      setDistrciData([])
    }
  }, [])

  return (
    <MainLayout>
      <Row justify="space-around" align="middle">
        <Col span={8}>
          <Title level={4}>Config Delivery Fee</Title>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>ค่าส่งตามระยะทาง</Breadcrumb.Item>
            <Breadcrumb.Item>ค่าส่งตามระยะทางทั้งหมด</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col span={8} offset={8} style={{ textAlign: 'end' }}></Col>
      </Row>

      <Card>
        <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={Schema}>
          {({ values, resetForm, setFieldValue }) => (
            <Form>
              <Row gutter={24}>
                <Col className="gutter-row" span={24}>
                  <Field
                    label={{ text: "ชื่อ Tier Price" }}
                    name="name"
                    type="text"
                    component={Input}
                    rows={2}
                    className="form-control round"
                    id="name" />
                </Col>

                <Col className="gutter-row" span={24}
                  style={{
                    borderTop: "2px solid #f2f2f2",
                    paddingTop: "15px",
                    paddingBottom: "15px"
                  }}>
                  {renderDeliveryFeeRule(values, setFieldValue)}
                  <Row gutter={16}>
                    <Button
                      style={{ width: '100px', marginBottom: '10px', marginLeft: '10px' }}
                      size="middle"
                      onClick={() => handleAddDeliveryFeeRule(values, setFieldValue)}
                      onBlur={() => {
                        setDeliveryFeeRuleValidate(false)
                      }}
                    >
                      + เพิ่ม Rule
                    </Button>
                  </Row>
                </Col>
                <Col className="gutter-row" span={24}
                  style={{
                    borderTop: "2px solid #f2f2f2",
                    paddingTop: "15px",
                    paddingBottom: "15px"
                  }}>
                </Col>
                <span>พื้นที่ใช้งาน</span>
                <Col span={24}>
                  <Field
                    onChange={async (value: number) => {
                      setParams({ ...params, sub_district_id: undefined, district_id: undefined, province_id: String(value) })
                      if (setFieldValue) {
                        setFieldValue("province_id", value)
                        setFieldValue('district_id', null)
                        setFieldValue('sub_district_id', [])
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
                <Col span={12}>
                  <Field
                    disabled={!params.province_id}
                    onChange={async (value: number) => {
                      setParams({ ...params, sub_district_id: undefined, district_id: String(value) })
                      if (setFieldValue) {
                        setFieldValue('district_id', value)
                        setFieldValue('sub_district_id', [])
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
                <Col span={12}>
                  <Field
                    onChange={async (value: number) => {
                      setParams({ ...params, sub_district_id: String(value) })
                      if (setFieldValue) {
                        setFieldValue('sub_district_id', value)
                      }
                    }}
                    component={Select}
                    disabled={!params.district_id}
                    mode="multiple"
                    className="form-control round"
                    label={{ text: 'แขวง/ตำบล' }}
                    placeholder="แขวง/ตำบล"
                    name="sub_district_id"
                    selectOption={districtList}
                  />
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
      </Card>
    </MainLayout>
  )
}

