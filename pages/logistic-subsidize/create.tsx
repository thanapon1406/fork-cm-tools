import Button from '@/components/Button';
import Card from '@/components/Card';
import Input from '@/components/Form/Input';
import Select from '@/components/Form/Select';
import OutletSelecter from '@/components/OutletSelecter';
import MainLayout from '@/layout/MainLayout';
import { getBrandListV2 } from '@/services/pos-profile';
import { Breadcrumb, Checkbox, Col, Collapse, Divider, Radio, Row, Skeleton, Typography } from 'antd';
import { Field, Form, Formik } from 'formik';
import _, { filter, get, intersection, size } from 'lodash';
import { useRouter } from 'next/router';
import React, { ReactElement, useEffect, useState } from 'react';
import * as Yup from 'yup';


const { Title } = Typography
const CUSTOMER_DISCOUNT = "customer_discount"
const CUSTOMER_PAY = "customer_pay"
const SUBSIDIZE = "subsidize"
const BAHT = "baht"
const PERCENT = "percent"
const allValue: any = []
const { Panel } = Collapse

interface Props { }


interface CreateLsParam {
  name: any;
  type: any;
  type_name: any;
  order_amount: any;
  discount_type: any;
  discount_amount: any;
  min_distance: any;
  max_distance: any;
  ls_type: any;
  ls_platform_amount: any;
  ls_merchant_amount: any;
  start_date: any;
  end_date: any;
  brands: any;
  ls_outlet: any;
  is_apply_all_brand: any;
}

export default function CreateLogisticSubsidize({ }: Props): ReactElement {
  const Router = useRouter()
  let lsInitial: CreateLsParam = {
    name: "",
    type: "",
    type_name: "เลือก LS Logics",
    order_amount: "",
    discount_type: BAHT,
    discount_amount: "",
    min_distance: "",
    max_distance: "",
    ls_type: BAHT,
    ls_platform_amount: "",
    ls_merchant_amount: "",
    start_date: "",
    end_date: "",
    brands: [],
    ls_outlet: [],
    is_apply_all_brand: false
  }
  const [lsDetail, setLsDetail] = useState(lsInitial)
  const Schema = Yup.object().shape({
    name: Yup.string().trim().max(255).required('กรุณากรอกชื่อ LS Config'),
    type: Yup.string().trim().required('กรุณาระบุ LS Logics'),
  })
  const [disableSubmitButton, setDisableSubmitButton] = useState(false)
  const lsLogicsOption = [
    {
      name: "เลือก LS Logics",
      value: ""
    },
    {
      name: "กำหนดจากส่วนลดที่ลูกค้าจะได้รับ",
      value: CUSTOMER_DISCOUNT
    },
    {
      name: "กำหนดจากค่าส่งที่ลูกค้าจะต้องจ่าย",
      value: CUSTOMER_PAY
    },
    {
      name: "กำหนดจากค่าส่งที่ร้านอาหาร หรือ Platform จะออกให้",
      value: SUBSIDIZE
    }
  ]
  const amountType = [
    {
      name: "บาท",
      value: BAHT
    },
    {
      name: "เปอร์เซ็นต์",
      value: PERCENT
    }
  ]
  const [brandList, setBrandList] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [userSelectedOutlet] = useState([])

  const handleSubmit = async (values: typeof lsDetail) => {
    const type = values["type"]
    if (type == CUSTOMER_PAY) {
      values.discount_type = BAHT
      values.ls_type = PERCENT
    } else if (type == SUBSIDIZE) {
      values.discount_type = ""
    }

    let outlets = []
    if (size(get(values, 'brands')) > 0) {
      for (var brand of values.brands) {
        if (get(brand, 'is_selected') == true) {
          if (get(brand, 'type') == 'all') {
            outlets.push({ brand_id: brand["id"], outlet_ids: [0] })
          } else if (size(get(brand, 'outlets')) > 0) {
            outlets.push({ brand_id: brand["id"], outlet_ids: get(brand, 'outlets') })
          }
        }
      }
    }

    values.ls_outlet = outlets
    console.log("Create LS Config! ", values)
    const payload = {}
  }

  const filterOutletSelected = (outletSelected: any, outletList: any, brandId: any) => {
    let outlet = allValue[brandId]
    let selected = outletSelected.map((v: any) => v * 1)
    return intersection(selected, outlet)
  }

  const getBrand = async () => {
    const { result, success } = await getBrandListV2({})
    if (success) {
      const filterBrand: any = filter(result.data, (item) => {
        return item
      })
      setBrandList(filterBrand)
    }
    setIsLoading(false)
  }

  // const submitCreate = async (values) => {
  //   let outlets = []
  //   if (size(get(values, 'brands')) > 0) {
  //     for (var brand of values.brands) {
  //       if (get(brand, 'is_selected') == true) {
  //         if (get(brand, 'type') == 'all') {
  //           outlets.push({ brand_id: brand?.id, outlet_ids: [0] })
  //         } else if (size(get(brand, 'outlets')) > 0) {
  //           outlets.push({ brand_id: brand?.id, outlet_ids: get(brand, 'outlets') })
  //         }
  //       }
  //     }
  //   }

  //   const payload = {
  //     ...values,
  //     description: values.description.replaceAll('<br>', '<br/>'),
  //     campaign_outlet: outlets,
  //     opening_time: moment(values.opening_time).format('HH:mm'),
  //     closed_time: moment(values.closed_time).format('HH:mm'),
  //     quota_quantity: parseFloat(values.quota_quantity) || 0,
  //     budget_amount: parseFloat(values.budget_amount) || 0,
  //     quota_type_per_person_amount: parseFloat(values.quota_type_per_person_amount) || 0,
  //     discount_amount: parseFloat(values.discount_amount) || 0,
  //     max_discount_amount: parseFloat(values.max_discount_amount) || 0,
  //     min_payment_amount: parseFloat(values.min_payment_amount) || 0,
  //     promotion_code: [
  //       {
  //         code: values.promotion_code,
  //       },
  //     ],
  //   }

  //   delete payload['outlets']
  //   delete payload['brands']
  //   const result = await createCampaign(omit({ data: { ...payload } }))
  //   if (get(result, 'message', '') === 'success') {
  //     toastMessageSuccess('สร้าง campaign สำเร็จ')
  //     router.push('/campaign')
  //     return
  //   }
  //   toastMessageError('เกิดข้อผิดพลาด')
  // }

  useEffect(() => {
    getBrand()
  }, [])

  const renderLogicInfo = (values: any, setFieldValue: any) => {
    return (<>
      {/* Name */}
      < Row gutter={16} >
        <Col className="gutter-row" span={24}>
          <Field
            label={{ text: "LS Configure Name" }}
            name="name"
            type="text"
            component={Input}
            className="form-control"
            id="name"
            placeholder="LS Configure Name"
          />
        </Col>
      </Row >
      {/* Type */}
      < Row gutter={16} >
        <Col className="gutter-row" span={12}>
          <Field
            label={{ text: "LS Logics" }}
            name="type"
            component={Select}
            id="type"
            placeholder="LS Logics"
            selectOption={lsLogicsOption}
            onChange={(value: any) => {
              setFieldValue("type", value)

              // Type name
              const selectedType = _.find(lsLogicsOption, { value: value })
              const typeName = _.get(selectedType, "name") ? _.get(selectedType, "name") : ""
              setFieldValue("type_name", typeName)
            }}
          />
        </Col>
      </Row >
      <Divider style={{
        marginTop: '5px',
        marginBottom: '20px'
      }} />
    </>)
  }

  const renderLogicSetup = (values: any, setFieldValue: any) => {
    console.log("values", values)
    let logicSetupElements = []

    // Header
    logicSetupElements.push(
      <Row gutter={24}>
        <Col className="gutter-row" span={24}>
          <Title level={4}>Logic Setup</Title>
        </Col>
      </Row>
    )

    logicSetupElements.push(
      <Row gutter={24}>
        < Col className="gutter-row" span={12} >
          <Field
            name="type_name"
            type="text"
            component={Input}
            className="form-control"
            id="type_name"
            disabled
          />
        </Col >
      </Row>
    )


    const logicType = _.get(values, "type") ? _.get(values, "type") : ""
    if (logicType) {
      // Logic Setup
      let logicSetup = <></>
      switch (logicType) {
        case CUSTOMER_DISCOUNT:
          logicSetup = <>
            {/* Row#1 */}
            <Row gutter={{
              xs: 24,
              sm: 24,
              md: 12,
              lg: 12
            }}>
              <Col className="gutter-row" xs={24} sm={13} md={10} lg={4} style={{ marginTop: "5px", marginBottom: "10px" }}>
                ลูกค้าสั่งออเดอร์ยอดสุทธิตั้งแต่
              </Col>
              <Col className="gutter-row" xs={12} sm={5} md={4} lg={2}>
                <Field
                  name="order_amount"
                  type="number"
                  component={Input}
                  className="form-control"
                  id="order_amount"
                />
              </Col>
              <Col className="gutter-row" xs={12} sm={6} md={6} lg={2} style={{ marginTop: "5px", marginBottom: "10px" }}>
                บาท ขึ้นไป
              </Col>
            </Row>
            {/* Row#2 */}
            <Row gutter={{
              xs: 24,
              sm: 24,
              md: 12,
              lg: 12
            }}>
              <Col className="gutter-row" xs={24} sm={5} md={4} lg={2} style={{ marginTop: "5px", marginBottom: "10px" }}>
                ส่วนลดค่าจัดส่ง
              </Col>
              <Col className="gutter-row" xs={12} sm={5} md={4} lg={2}>
                <Field
                  name="discount_amount"
                  type="number"
                  component={Input}
                  className="form-control"
                  id="discount_amount"
                />
              </Col>
              <Col className="gutter-row" xs={12} sm={6} md={5} lg={3}>
                <Field
                  name="discount_type"
                  component={Select}
                  id="discount_type"
                  defaultValue={{ value: BAHT }}
                  selectOption={amountType}
                />
              </Col>
            </Row>
            {/* Row#3 */}
            <Row gutter={{
              xs: 24,
              sm: 24,
              md: 12,
              lg: 12
            }}>
              <Col className="gutter-row" xs={24} sm={5} md={4} lg={2} style={{ marginTop: "5px", marginBottom: "10px" }}>
                ระยะทางจัดส่ง
              </Col>
              <Col className="gutter-row" xs={12} sm={5} md={4} lg={2} style={{}}>
                <Field
                  name="min_distance"
                  type="number"
                  component={Input}
                  className="form-control"
                  id="min_distance"
                />
              </Col>
              <Col className="gutter-row" xs={12} sm={1} md={1} lg={1} style={{ marginTop: "5px", marginBottom: "10px" }}>
                กม.
              </Col>
              <Col className="gutter-row" xs={1} sm={1} md={1} lg={1} style={{ marginTop: "5px", marginBottom: "10px", textAlign: "right" }}>
                ถึง
              </Col>
              <Col className="gutter-row" xs={12} sm={5} md={4} lg={2}>
                <Field
                  name="max_distance"
                  type="number"
                  component={Input}
                  className="form-control"
                  id="max_distance"
                />
              </Col>
              <Col className="gutter-row" xs={1} sm={1} md={1} lg={1} style={{ marginTop: "5px", marginBottom: "10px" }}>
                กม.
              </Col>
            </Row>
          </>
          break;
        case CUSTOMER_PAY:
          logicSetup = <>
            {/* Row#1 */}
            <Row gutter={{
              xs: 24,
              sm: 24,
              md: 12,
              lg: 12
            }}>
              <Col className="gutter-row" xs={24} sm={13} md={10} lg={4} style={{ marginTop: "5px", marginBottom: "10px" }}>
                ลูกค้าสั่งออเดอร์ยอดสุทธิตั้งแต่
              </Col>
              <Col className="gutter-row" xs={12} sm={5} md={4} lg={2}>
                <Field
                  name="order_amount"
                  type="number"
                  component={Input}
                  className="form-control"
                  id="order_amount"
                />
              </Col>
              <Col className="gutter-row" xs={12} sm={6} md={6} lg={2} style={{ marginTop: "5px", marginBottom: "10px" }}>
                บาท ขึ้นไป
              </Col>
            </Row>
            {/* Row#2 */}
            <Row gutter={{
              xs: 24,
              sm: 24,
              md: 12,
              lg: 12
            }}>
              <Col className="gutter-row" xs={24} sm={13} md={10} lg={4} style={{ marginTop: "5px", marginBottom: "10px" }}>
                ค่าส่งที่ลูกค้าจะต้องจ่าย
              </Col>
              <Col className="gutter-row" xs={12} sm={5} md={4} lg={2}>
                <Field
                  name="discount_amount"
                  type="number"
                  component={Input}
                  className="form-control"
                  id="discount_amount"
                />
              </Col>
              <Col className="gutter-row" xs={2} sm={1} md={1} lg={1} style={{ marginTop: "5px", marginBottom: "10px" }}>
                บาท
              </Col>
            </Row>
            {/* Row#3 */}
            <Row gutter={{
              xs: 24,
              sm: 24,
              md: 12,
              lg: 12
            }}>
              <Col className="gutter-row" xs={24} sm={5} md={4} lg={2} style={{ marginTop: "5px", marginBottom: "10px" }}>
                ระยะทางจัดส่ง
              </Col>
              <Col className="gutter-row" xs={12} sm={5} md={4} lg={2} style={{}}>
                <Field
                  name="min_distance"
                  type="number"
                  component={Input}
                  className="form-control"
                  id="min_distance"
                />
              </Col>
              <Col className="gutter-row" xs={12} sm={1} md={1} lg={1} style={{ marginTop: "5px", marginBottom: "10px" }}>
                กม.
              </Col>
              <Col className="gutter-row" xs={1} sm={1} md={1} lg={1} style={{ marginTop: "5px", marginBottom: "10px", textAlign: "right" }}>
                ถึง
              </Col>
              <Col className="gutter-row" xs={12} sm={5} md={4} lg={2}>
                <Field
                  name="max_distance"
                  type="number"
                  component={Input}
                  className="form-control"
                  id="max_distance"
                />
              </Col>
              <Col className="gutter-row" xs={1} sm={1} md={1} lg={1} style={{ marginTop: "5px", marginBottom: "10px" }}>
                กม.
              </Col>
            </Row>
          </>
          break;
        case SUBSIDIZE:
          logicSetup = <>
            {/* Row#1 */}
            <Row gutter={{
              xs: 24,
              sm: 24,
              md: 12,
              lg: 12
            }}>
              <Col className="gutter-row" xs={24} sm={13} md={10} lg={4} style={{ marginTop: "5px", marginBottom: "10px" }}>
                ลูกค้าสั่งออเดอร์ยอดสุทธิตั้งแต่
              </Col>
              <Col className="gutter-row" xs={12} sm={5} md={4} lg={2}>
                <Field
                  name="order_amount"
                  type="number"
                  component={Input}
                  className="form-control"
                  id="order_amount"
                />
              </Col>
              <Col className="gutter-row" xs={12} sm={6} md={6} lg={2} style={{ marginTop: "5px", marginBottom: "10px" }}>
                บาท ขึ้นไป
              </Col>
            </Row>
            {/* Row#2 */}
            <Row gutter={{
              xs: 24,
              sm: 24,
              md: 12,
              lg: 12
            }}>
              <Col className="gutter-row" xs={24} sm={5} md={4} lg={2} style={{ marginTop: "5px", marginBottom: "10px" }}>
                ระยะทางจัดส่ง
              </Col>
              <Col className="gutter-row" xs={12} sm={5} md={4} lg={2} style={{}}>
                <Field
                  name="min_distance"
                  type="number"
                  component={Input}
                  className="form-control"
                  id="min_distance"
                />
              </Col>
              <Col className="gutter-row" xs={12} sm={1} md={1} lg={1} style={{ marginTop: "5px", marginBottom: "10px" }}>
                กม.
              </Col>
              <Col className="gutter-row" xs={1} sm={1} md={1} lg={1} style={{ marginTop: "5px", marginBottom: "10px", textAlign: "right" }}>
                ถึง
              </Col>
              <Col className="gutter-row" xs={12} sm={5} md={4} lg={2}>
                <Field
                  name="max_distance"
                  type="number"
                  component={Input}
                  className="form-control"
                  id="max_distance"
                />
              </Col>
              <Col className="gutter-row" xs={1} sm={1} md={1} lg={1} style={{ marginTop: "5px", marginBottom: "10px" }}>
                กม.
              </Col>
            </Row>
          </>
          break;
        default:
          logicSetup = <></>
      }
      logicSetupElements.push(
        logicSetup
      )

      // Logic Subsidize
      let logicSubsidize = <></>
      switch (logicType) {
        case CUSTOMER_DISCOUNT:
          const subsidizeTypeName = _.get(values, "ls_type") == "percent" ? "เปอร์เซ็นต์" : "บาท"
          logicSubsidize = <>
            <Row gutter={24}>
              <Col className="gutter-row" span={24}>
                <Title level={5}>สัดส่วน Logic Subsidize</Title>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col className="gutter-row" span={12} style={{ marginTop: "5px", marginBottom: "10px" }}>
                <Radio.Group name="ls_type"
                  defaultValue={values["ls_type"]}
                  onChange={e => {
                    setFieldValue("ls_type", e.target.value)
                  }}>
                  <Radio value={BAHT}>บาท</Radio>
                  <Radio value={PERCENT} >เปอร์เซ็นต์</Radio>
                </Radio.Group>
              </Col>
            </Row>
            <Row gutter={{
              xs: 24,
              sm: 24,
              md: 12,
              lg: 12
            }}>
              <Col className="gutter-row" xs={24} sm={5} md={4} lg={2} style={{ marginTop: "5px", marginBottom: "10px" }}>
                ร้านอาหาร
              </Col>
              <Col className="gutter-row" xs={12} sm={5} md={4} lg={2} style={{}}>
                <Field
                  name="ls_merchant_amount"
                  type="number"
                  component={Input}
                  className="form-control"
                  id="ls_merchant_amount"
                />
              </Col>
              <Col className="gutter-row" xs={2} sm={2} md={2} lg={2} style={{ marginTop: "5px", marginBottom: "10px" }}>
                {subsidizeTypeName}
              </Col>
            </Row>
            <Row gutter={{
              xs: 24,
              sm: 24,
              md: 12,
              lg: 12
            }}>
              <Col className="gutter-row" xs={24} sm={5} md={4} lg={2} style={{ marginTop: "5px", marginBottom: "10px" }}>
                แพลตฟอร์ม
              </Col>
              <Col className="gutter-row" xs={12} sm={5} md={4} lg={2} style={{}}>
                <Field
                  name="ls_platform_amount"
                  type="number"
                  component={Input}
                  className="form-control"
                  id="ls_platform_amount"
                />
              </Col>
              <Col className="gutter-row" xs={2} sm={2} md={2} lg={2} style={{ marginTop: "5px", marginBottom: "10px" }}>
                {subsidizeTypeName}
              </Col>
            </Row>
          </>
          break;
        case CUSTOMER_PAY:
          logicSubsidize = <>
            <Row gutter={24}>
              <Col className="gutter-row" span={24} style={{ marginTop: "5px", marginBottom: "10px" }}>
                <span style={{ fontSize: "15px", fontWeight: 600, marginBottom: "0.5em", lineHeight: 1.5 }}>สัดส่วน Logic Subsidize</span> <span style={{ fontWeight: 500, color: "rgb(93 93 93)" }}>* ถ้ามีการ subsidize เกินมนส่วนของการตั้งค่า LS จะต้องแคปลิมิตค่าของอีกฝั่งนึง</span>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col className="gutter-row" span={24} style={{ marginTop: "5px", marginBottom: "10px" }}>
                แบบฟอร์มและร้านอาหารต้องรวมกัน 100 เปอร์เซ็นต์
              </Col>
            </Row>
            <Row gutter={{
              xs: 24,
              sm: 24,
              md: 12,
              lg: 12
            }}>
              <Col className="gutter-row" xs={24} sm={5} md={4} lg={2} style={{ marginTop: "5px", marginBottom: "10px" }}>
                ร้านอาหาร
              </Col>
              <Col className="gutter-row" xs={12} sm={5} md={4} lg={2} style={{}}>
                <Field
                  name="ls_merchant_amount"
                  type="number"
                  component={Input}
                  className="form-control"
                  id="ls_merchant_amount"
                />
              </Col>
              <Col className="gutter-row" xs={2} sm={2} md={2} lg={2} style={{ marginTop: "5px", marginBottom: "10px" }}>
                เปอร์เซ็นต์
              </Col>
            </Row>
            <Row gutter={{
              xs: 24,
              sm: 24,
              md: 12,
              lg: 12
            }}>
              <Col className="gutter-row" xs={24} sm={5} md={4} lg={2} style={{ marginTop: "5px", marginBottom: "10px" }}>
                แพลตฟอร์ม
              </Col>
              <Col className="gutter-row" xs={12} sm={5} md={4} lg={2} style={{}}>
                <Field
                  name="ls_platform_amount"
                  type="number"
                  component={Input}
                  className="form-control"
                  id="ls_platform_amount"
                />
              </Col>
              <Col className="gutter-row" xs={2} sm={2} md={2} lg={2} style={{ marginTop: "5px", marginBottom: "10px" }}>
                เปอร์เซ็นต์
              </Col>
            </Row>
          </>
          break;
        case SUBSIDIZE:
          const subsidizeTypeName2 = _.get(values, "ls_type") == "percent" ? "เปอร์เซ็นต์" : "บาท"
          logicSubsidize = <>
            <Row gutter={24}>
              <Col className="gutter-row" span={24}>
                <Title level={5}>สัดส่วน Logic Subsidize</Title>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col className="gutter-row" span={12} style={{ marginTop: "5px", marginBottom: "10px" }}>
                <Radio.Group name="ls_type"
                  defaultValue={values["ls_type"]}
                  onChange={e => {
                    setFieldValue("ls_type", e.target.value)
                  }}>
                  <Radio value={BAHT}>บาท</Radio>
                  <Radio value={PERCENT} >เปอร์เซ็นต์</Radio>
                </Radio.Group>
              </Col>
            </Row>
            <Row gutter={{
              xs: 24,
              sm: 24,
              md: 12,
              lg: 12
            }}>
              <Col className="gutter-row" xs={24} sm={5} md={4} lg={2} style={{ marginTop: "5px", marginBottom: "10px" }}>
                ร้านอาหาร
              </Col>
              <Col className="gutter-row" xs={12} sm={5} md={4} lg={2} style={{}}>
                <Field
                  name="ls_merchant_amount"
                  type="number"
                  component={Input}
                  className="form-control"
                  id="ls_merchant_amount"
                />
              </Col>
              <Col className="gutter-row" xs={2} sm={2} md={2} lg={2} style={{ marginTop: "5px", marginBottom: "10px" }}>
                {subsidizeTypeName2}
              </Col>
            </Row>
            <Row gutter={{
              xs: 24,
              sm: 24,
              md: 12,
              lg: 12
            }}>
              <Col className="gutter-row" xs={24} sm={5} md={4} lg={2} style={{ marginTop: "5px", marginBottom: "10px" }}>
                แพลตฟอร์ม
              </Col>
              <Col className="gutter-row" xs={12} sm={5} md={4} lg={2} style={{}}>
                <Field
                  name="ls_platform_amount"
                  type="number"
                  component={Input}
                  className="form-control"
                  id="ls_platform_amount"
                />
              </Col>
              <Col className="gutter-row" xs={2} sm={2} md={2} lg={2} style={{ marginTop: "5px", marginBottom: "10px" }}>
                {subsidizeTypeName2}
              </Col>
            </Row>
          </>
          break;
        default:
          logicSubsidize = <></>
      }
      logicSetupElements.push(
        logicSubsidize
      )
    }

    // Footer
    logicSetupElements.push(
      <Divider style={{
        marginTop: '5px',
        marginBottom: '20px'
      }} />
    )
    return logicSetupElements
  }

  const renderLogicOutlet = (values: any, setFieldValue: any, handleChange: any) => {
    let logicOutletElements = []
    // Header
    logicOutletElements.push(
      <>
        <Row gutter={24}>
          <Col className="gutter-row" span={24}>
            <Title level={4}>ร้านอาหารที่ใช้งาน</Title>
          </Col>
        </Row>
      </>
    )

    logicOutletElements.push(
      <>
        <Row gutter={24}>
          <Col className="gutter-row" span={24}>
            <Checkbox onChange={(e) => {
              setFieldValue("is_apply_all_brand", e.target.checked)
            }}>เข้าร่วมทุกร้านอาหาร
            </Checkbox>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col className="gutter-row" span={24}>
            < Collapse
              accordion
              collapsible={values.is_apply_all_brand ? 'disabled' : 'header'}
            >
              <Panel key="outlet_joined" header="ร้านอาหารที่เข้าร่วม">
                <OutletSelecter
                  handleChange={handleChange}
                  disabled={values.is_apply_all_brand}
                  selectedList={filterOutletSelected}
                  formValue={values}
                  setFieldValue={setFieldValue}
                  userSelectedOutlet={userSelectedOutlet}
                  brandList={brandList}
                />
              </Panel>
            </Collapse >
          </Col>
        </Row>
      </>
    )

    // Footer
    logicOutletElements.push(<Divider style={{
      marginTop: '20px',
      marginBottom: '20px'
    }} />)

    return logicOutletElements
  }

  const renderLogicSummary = (values: any, setFieldValue: any) => {
    let logicSummaryElements = []
    // Header
    logicSummaryElements.push(
      <>
        <Row gutter={24}>
          <Col className="gutter-row" span={24}>
            <Title level={4}>LS Summary</Title>
          </Col>
        </Row>
      </>
    )

    logicSummaryElements.push(
      <>
      </>
    )

    // Footer
    logicSummaryElements.push(<Divider style={{
      marginTop: '20px',
      marginBottom: '20px'
    }} />)

    return logicSummaryElements
  }

  const renderLogicDetail = (values: any, setFieldValue: any) => {
    let logicDetailElements = []

    logicDetailElements.push(
      <>
      </>
    )

    return logicDetailElements
  }

  return (
    <Skeleton loading={isLoading}>
      <MainLayout>
        <Formik
          initialValues={lsDetail}
          onSubmit={handleSubmit}
          validationSchema={Schema}
          enableReinitialize={true}
          setFieldValue={true}
        >
          {({
            values,
            resetForm,
            setFieldValue,
            handleChange }) => (
            <Form>
              <Row justify="space-around" align="middle">
                <Col span={8}>
                  <Title level={4}>LS Logic</Title>
                  <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>LS Logic</Breadcrumb.Item>
                    <Breadcrumb.Item>สร้าง LS Logic</Breadcrumb.Item>
                  </Breadcrumb>
                </Col>
                <Col span={8} offset={8} style={{ textAlign: 'end' }}>
                  <Button
                    style={{ width: '100px', marginTop: '31px' }}
                    type="primary"
                    size="middle"
                    htmlType="submit"
                    disabled={disableSubmitButton}
                  >
                    บันทึก
                  </Button>
                </Col>
              </Row>
              <Card>
                {/* Logic Info */}
                {renderLogicInfo(values, setFieldValue)}

                {/* Logic Setup */}
                {renderLogicSetup(values, setFieldValue)}

                {/* Logic Outlet */}
                {renderLogicOutlet(values, setFieldValue, handleChange)}

                {/* Logic Summary */}
                {renderLogicSummary(values, setFieldValue)}

                {/* Logic Detail */}
                {renderLogicDetail(values, setFieldValue)}

              </Card>
            </Form>
          )}
        </Formik>
      </MainLayout >
    </Skeleton>
  )
}
