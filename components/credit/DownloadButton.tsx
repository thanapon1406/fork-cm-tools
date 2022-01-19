import Button from '@/components/Button'
import Input from '@/components/Form/Input'
import { DownloadOutlined } from '@ant-design/icons'
import { Modal, Space, Typography } from 'antd'
import { Field, Form, Formik } from 'formik'
import React, { ReactElement, useState } from 'react'
import * as Yup from 'yup'
const { Title, Text } = Typography

interface Props {
  handelSubmit?: any
}

export default function DownloadButton({ handelSubmit }: Props): ReactElement {
  const [config, setConfig] = useState({
    visible: false,
  })
  const [downloadInitialValues, setDownloadInitialValues] = useState({
    email: '',
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

  const handleOk = () => {}

  const handleSubmitDownload = async (values: typeof downloadInitialValues) => {
    handelSubmit(values)
  }

  return (
    <div>
      <Button
        style={{ width: '120px' }}
        type="primary"
        size="middle"
        icon={<DownloadOutlined />}
        onClick={showModal}
      >
        ดาวน์โหลด
      </Button>
      <Modal visible={config.visible} centered title={null} footer={null} onCancel={hideModal}>
        <Title level={3}>ต้องการดาวน์โหลดรายงานใช่หรือไม่</Title>
        <Title style={{ color: '#d9d9d9', margin: 0 }} level={5}>
          กรุณากรอกอีเมลที่ต้องการรับรายงาน
        </Title>
        <br />
        <Formik
          initialValues={downloadInitialValues}
          onSubmit={handleSubmitDownload}
          validationSchema={Schema}
        >
          {({ values, resetForm }) => (
            <Form>
              <Field
                // label={{ text: 'เหตุผล' }}
                name="email"
                type="text"
                component={Input}
                className="form-control round"
                id="email"
                placeholder="Please enter email"
              />
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
                      if (values.email) {
                        handleSubmitDownload(values)
                        hideModal()
                        resetForm()
                      }
                    }}
                    size="middle"
                    htmlType="submit"
                  >
                    ยืนยัน
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