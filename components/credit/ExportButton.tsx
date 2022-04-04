import Button from '@/components/Button'
import Input from '@/components/Form/Input'
import { PlusOutlined } from "@ant-design/icons"
import { Modal, Space, Typography } from 'antd'
import { Field, Form, Formik } from 'formik'
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

  const generateUI = (items: any[]) => {
    console.log(items)
    return items?.map((val: any, index: number) => {
      <>
        {console.log(index)}
        <Field
          label={{ text: 'อีเมล' }}
          name={`emails[${index}]`}
          type="text"
          component={Input}
          className="form-control round"
          id={`emails[${index}]`}
          placeholder="Please enter email"
        />
      </>
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
              {/* <Field
                label={{ text: 'อีเมล' }}
                name="emails"
                type="text"
                component={Input}
                className="form-control round"
                id="emails"
                placeholder="Please enter email"
              /> */}
              {generateUI(initialValues.emails)}
              <div style={{ marginBottom: 10 }}>
                <Button
                  type="dashed"
                  onClick={() => {
                    setInitialValues({
                      emails: [...initialValues.emails, ""],
                    })
                  }}
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
                      }
                    }}
                    size="middle"
                    htmlType="submit"
                  >
                    ส่งข้อมูล
                  </Button>
                </Space>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  )
}
