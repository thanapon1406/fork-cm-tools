import Card from '@/components/Card'
import Input from '@/components/Form/Input'
import MainLayout from '@/layout/MainLayout'
import { Breadcrumb, Button, Col, Row, Select, Switch, Typography } from 'antd'
import { Field, Form, Formik } from 'formik'
import _ from 'lodash'
import { useRouter } from 'next/router'
import React, { ReactElement } from 'react'
import * as Yup from 'yup'

const { Title } = Typography
interface Props { }

export default function WalletSetting({ }: Props): ReactElement {
  const Router = useRouter()
  const partner = _.get(Router, 'query.partner') ? _.get(Router, 'query.partner') : ""
  const initialValues = {
    minimum_amount: 0,
    minimum_alert: true,
    minimum_email: [],
    top_up_alert: false,
    top_up_email: [],
  }

  const Schema = Yup.object().shape({})

  const handleSubmit = (values: typeof initialValues) => {
    console.log("values", values)
  }

  return (
    <MainLayout>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={Schema}>
        {({
          values,
          resetForm,
          setFieldValue,

        }) => (
          <Form>
            <Row gutter={16}>
              <Col className="gutter-row" span={8}>
                <Title level={4}>กระเป๋าตังค์</Title>
                <Breadcrumb style={{ margin: '16px 0' }}>
                  <Breadcrumb.Item>กระเป๋าตังค์</Breadcrumb.Item>
                  <Breadcrumb.Item>{partner.toUpperCase()}</Breadcrumb.Item>
                  <Breadcrumb.Item>ตั้งค่ากระเป๋าตังค์</Breadcrumb.Item>
                </Breadcrumb>
              </Col>
              <Col className="gutter-row" span={16} style={{ textAlign: 'right' }}>
                <div className="ant-form ant-form-vertical">
                  <Button
                    style={{ width: '120px', marginTop: '31px', background: '#28A745', borderColor: '#28A745' }}
                    type="primary"
                    size="middle"
                    htmlType="submit"
                  >
                    บันทึก
                  </Button>
                </div>
              </Col>
            </Row>
            <Card>
              <Title level={5}>ตั้งค่ากระเป๋าตังค์</Title>
              <Row gutter={16} style={{ paddingTop: 5 }}>
                <Col span={4}>
                  แจ้งเตือนเมื่อมียอดเงินในกระเป๋าน้อยกว่า
                </Col>
                <Col span={2}>
                  <Switch
                    checked={values.minimum_alert}
                    onChange={(value: any) => {
                      setFieldValue('minimum_alert', value)
                    }}
                  />
                </Col>
                <Col span={4}>
                  <Field
                    name="minimum_amount"
                    type="text"
                    component={Input}
                    className="form-control"
                    id="minimum_amount"
                    placeholder=""
                  />
                </Col>
              </Row>
              <Row gutter={16} style={{ paddingTop: 5 }}>
                <Col span={6} offset={6}>
                  <Select
                    mode="tags"
                    style={{ width: '100%', marginBottom: 24 }}
                    onChange={(value: any) => {
                      setFieldValue('minimum_email', value)
                    }}
                    tokenSeparators={[',']}
                    showArrow={false}
                    filterOption={false}
                    notFoundContent={null}
                    maxTagCount='responsive'
                  >
                  </Select>
                </Col>
              </Row>
              <Row gutter={16} style={{ paddingTop: 5 }}>
                <Col span={4}>
                  แจ้งเตือน<br />เมื่อมีเงินเข้ากระเป๋าตังค์
                </Col>
                <Col span={2}>
                  <Switch
                    checked={values.top_up_alert}
                    onChange={(value: any) => {
                      setFieldValue('top_up_alert', value)
                    }}
                  />
                </Col>
                <Col span={6}>
                  <Select
                    mode="tags"
                    style={{ width: '100%' }}
                    onChange={(value: any) => {
                      setFieldValue('top_up_email', value)
                    }}
                    tokenSeparators={[',']}
                    showArrow={false}
                    filterOption={false}
                    notFoundContent={null}
                    maxTagCount='responsive'
                  >
                  </Select>
                </Col>
              </Row>
            </Card>

          </Form>)}
      </Formik>
    </MainLayout >
  );
};