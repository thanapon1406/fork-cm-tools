import Button from '@/components/Button'
import Input from '@/components/Form/Input'
import { CloseOutlined, PlusOutlined } from "@ant-design/icons"
import { Col, Modal, Row, Space, Typography } from 'antd'
import { Field, FieldArray, Form, Formik } from 'formik'
import moment from 'moment'
import React, { ReactElement, useState } from 'react'
import * as Yup from 'yup'

const { Title, Text } = Typography

interface Props {
  propsSubmit?: any
}

export default function ExportButton({ propsSubmit }: Props): ReactElement {
  const [config, setConfig] = useState({
    visible: false,
  })
  const [initialValues, setInitialValues] = useState({
    emails: [""],
  })

  const Schema = Yup.object().shape({
    username: Yup.string().trim().email('กรุณากรอกอีเมลให้ถูกต้อง').required('กรุณากรอกอีเมล'),
  })

  const showModal = () => {
    setConfig({
      visible: true,
    })
  }

  const hideModal = () => {
    setConfig({
      visible: false,
    })
  }

  const submit = async (values: typeof initialValues) => {
    propsSubmit(values)
  }

  var date = moment().format("YYYY-MM-DD")
  return (
    <div>
      <Button
        style={{ width: '120px', marginTop: '31px' }}
        type="primary"
        size="middle"
        onClick={showModal}
      >
        Export
      </Button>
      <Modal visible={config.visible} centered title={null} footer={null} onCancel={hideModal}>
        <Title level={4} style={{ display: "flex", justifyContent: "center" }}>ส่งข้อมูลบัญชีร้านค้าไปยังอีเมล</Title>
        <Title style={{ margin: 0, display: "flex", justifyContent: "center", fontWeight: 300 }} level={5}>
          ข้อมูลบัญชีร้านค้าวันที่ {date}
        </Title>
        <Title style={{ color: '#818181', marginTop: 10, marginBottom: 0 }} level={5}>
          อีเมลที่ส่งข้อมูล
        </Title>
        <br />
        <Formik
          initialValues={initialValues}
          onSubmit={submit}
          validationSchema={Schema}
        >
          {({ values, resetForm }) => (
            <Form>
              <FieldArray
                name="emails"
                render={arrayHelpers => (
                  <div>
                    {values.emails && values.emails.length > 0 && (
                      values.emails.map((email, index) => (
                        <div key={index}>
                          <Row gutter={10} >
                            <Col className="gutter-row" span={values.emails.length !== 1 ? 23 : 24}>
                              <Field
                                label={{ text: 'อีเมล' }}
                                name={`emails.${index}`}
                                type="text"
                                component={Input}
                                className="form-control round"
                                id={`emails.${index}`}
                                placeholder="Please enter email"
                              />
                            </Col>
                            {values.emails.length !== 1 &&
                              <Col className="gutter-row" span={1}>
                                <CloseOutlined style={{ marginTop: "36px" }} onClick={() => arrayHelpers.remove(index)} />
                              </Col>
                            }
                          </Row>
                        </div>
                      ))
                    )}
                    <div style={{ marginBottom: "24px" }}>
                      <Button
                        type="dashed"
                        onClick={() => arrayHelpers.push('')}
                        block
                        icon={<PlusOutlined />}
                      >
                        เพิ่มอีเมล
                      </Button>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <Space>
                        <Button
                          style={{ width: '120px' }}
                          type="default"
                          size="middle"
                          onClick={hideModal}
                        >
                          ยกเลิก
                        </Button>
                        <Button
                          style={{ width: '120px' }}
                          type="primary"
                          onClick={() => {
                            if (values.emails) {
                              submit(values)
                              hideModal()
                              resetForm()
                              setInitialValues({
                                emails: [""],
                              })
                            }
                          }}
                          size="middle"
                          htmlType="submit"
                        >
                          ส่งข้อมูล
                        </Button>
                      </Space>
                    </div>
                  </div>
                )}
              />


            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  )
}
