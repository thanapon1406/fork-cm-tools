import Layout from '@/components/AuthLayout'
import Input from '@/components/Form/Input'
import { login, logout } from '@/services/login'
import { Button, Card, Col, Row, Typography } from 'antd'
import { Field, Form, Formik } from 'formik'
import type { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import * as Yup from 'yup'
import logoImg from '../public/cmt_logo_light.png'
const { Title } = Typography

const Login: NextPage = () => {
  const initialValues = {
    username: '',
    password: '',
  }

  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    logout()
  }, [])

  const handleSubmit = async (values: any) => {
    setIsLoading(true)
    const response = await login(values)
    const { result, success } = response
    setIsLoading(false)
    if (success) {
      setTimeout(() => {
        router.push('/')
      }, 1000)
    }
  }

  const Schema = Yup.object().shape({
    username: Yup.string().trim().email('กรุณากรอกอีเมลให้ถูกต้อง').required('กรุณากรอกอีเมล'),
    password: Yup.string().trim().required('กรุณากรอกรหัสผ่าน'),
  })

  return (
    <Layout>
      <Row justify="center">
        <Col span={24} xs={24} sm={12} md={6} style={{ textAlign: 'left' }}>
          <Card bordered={false}>
            <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={Schema}>
              {(values) => (
                <Form>
                  <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <Image src={logoImg} />
                    <Title level={5} style={{ color: '#dc1e24' }}>
                      KITCHEN HUB ADMIN
                    </Title>
                  </div>
                  <Field
                    name="username"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="username"
                    autoComplete="off"
                    placeholder="Username"
                  />

                  <Field
                    name="password"
                    type="password"
                    component={Input}
                    className="form-control round"
                    id="password"
                    autoComplete="off"
                    placeholder="Password"
                  />

                  <Button
                    htmlType="submit"
                    type="primary"
                    shape="round"
                    style={{ marginTop: '5px' }}
                    loading={isLoading}
                    block
                  >
                    ลงชื่อเข้าใช้
                  </Button>

                  <div style={{ marginTop: '10px' }}>
                    <Link href="/forgotpassword">ลืมรหัสผ่าน</Link>
                  </div>
                </Form>
              )}
            </Formik>
          </Card>
        </Col>
      </Row>
    </Layout>
  )
}

export default Login
