import Button from '@/components/Button';
import Card from '@/components/Card';
import Input from '@/components/Form/Input';
import Select from '@/components/Form/Select';
import MainLayout from '@/layout/MainLayout';
import { Breadcrumb, Col, Divider, Radio, Row, Typography } from 'antd';
import { Field, Form, Formik } from 'formik';
import _ from 'lodash';
import { useRouter } from 'next/router';
import React, { ReactElement, useEffect, useState } from 'react';
import * as Yup from 'yup';


const { Title } = Typography
const CUSTOMER_DISCOUNT = "customer_discount"
const CUSTOMER_PAY = "customer_pay"
const SUBSIDIZE = "subsidize"
const BAHT = "baht"
const PERCENT = "percent"

interface Props { }

export default function CreateLogisticSubsidize({ }: Props): ReactElement {
  const Router = useRouter()
  const [lsDetail, setLsDetail] = useState({
    name: "",
    type: "",
    type_name: "",
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

  useEffect(() => {
  }, [])

  const handleSubmit = async (values: typeof lsDetail) => {
    const type = values["type"]
    if (type == CUSTOMER_PAY) {
      values.discount_type = BAHT
      values.ls_type = PERCENT
    } else if (type == SUBSIDIZE) {
      values.discount_type = ""
    }
    console.log("Create LS Config! ", values)
  }

  const Schema = Yup.object().shape({
    name: Yup.string().trim().max(255).required('กรุณากรอกชื่อ LS Config'),
    type: Yup.string().trim().required('กรุณาระบุ LS Logics'),
  })

  const renderLogicSetup = (values: any, setFieldValue: any) => {
    console.log("values", values)
    let deliveryFeeRuleElement = []
    const logicType = _.get(values, "type") ? _.get(values, "type") : ""
    if (logicType) {
      // Header
      deliveryFeeRuleElement.push(
        <>
          <Row gutter={24}>
            <Col className="gutter-row" span={24}>
              <Title level={4}>Logic Setup</Title>
            </Col>
          </Row>
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
        </>
      )

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
      deliveryFeeRuleElement.push(
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
      deliveryFeeRuleElement.push(
        logicSubsidize
      )


      // Footer
      deliveryFeeRuleElement.push(
        <Divider style={{
          marginTop: '5px',
          marginBottom: '20px'
        }} />
      )
    } else {
      deliveryFeeRuleElement.push(null)
    }
    return deliveryFeeRuleElement
  }

  return (
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
          setFieldValue }) => (
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
              {/* Name */}
              <Row gutter={16}>
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
              </Row>
              {/* Type */}
              <Row gutter={16}>
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
              </Row>
              <Divider style={{
                marginTop: '5px',
                marginBottom: '20px'
              }} />

              {/* Logic Setup */}
              {renderLogicSetup(values, setFieldValue)}


            </Card>
          </Form>
        )}
      </Formik>
    </MainLayout >
  )
}
