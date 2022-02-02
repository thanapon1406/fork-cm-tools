import CustomBadge from '@/components/Badge'
import Button from '@/components/Button'
import Card from '@/components/Card'
import Input from '@/components/Form/Input'
import MainLayout from '@/layout/MainLayout'
import { banOutlet, outletDetail } from '@/services/merchant'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Breadcrumb, Col, Modal, notification, Row, Space, Typography } from 'antd'
import { Field, Form, Formik } from 'formik'
import { get } from 'lodash'
import { useRouter } from 'next/router'
import React, { ReactElement, useEffect, useState } from 'react'
import * as Yup from 'yup'
const { confirm } = Modal

const { Title, Text } = Typography

interface Props { }

export default function BanOutlet({ }: Props): ReactElement {
  const router = useRouter()
  const { id } = router.query
  const [isLoadingPage, setIsLoading] = useState(true)

  let [outletInitialValues, setOutletInitialValues] = useState({
    ban_detail: '',
    outlet_id: 0,
    outlet_name: '',
    shop_id: '',
    is_ban: false,
    default_ban_detail: '',
  })

  useEffect(() => {
    if (id) {
      getOutlet(id)
    }
  }, [id])

  const getOutlet = async (outletId: any) => {
    const request = {
      id: outletId,
    }
    const { result, success } = await outletDetail(request)
    if (success) {
      setIsLoading(false)
      const { data } = result
      const isBan = get(data, 'is_ban', false)
      let ban_detail = ''
      if (isBan) {
        ban_detail = get(data, 'ban_detail')
      }

      setOutletInitialValues({
        ...outletInitialValues,
        outlet_name: get(data, 'name.th'),
        outlet_id: get(data, 'id'),
        shop_id: get(data, 'shop_id', '-'),
        is_ban: isBan,
        ban_detail: ban_detail,
        default_ban_detail: get(data, 'ban_detail'),
      })
    } else {
      router.push(`/userprofile/merchant/${id}`)
    }
  }

  const banTextMapping = (
    isBan: boolean
  ): { status: 'processing' | 'success' | 'error' | 'waiting'; text: string } => {
    return isBan
      ? {
        status: 'error',
        text: 'ถูกแบน',
      }
      : {
        status: 'success',
        text: 'ปกติ',
      }
  }

  const Schema = Yup.object().shape({})

  const handleSubmit = async (values: typeof outletInitialValues) => {
    if (values.is_ban && values.ban_detail == outletInitialValues.default_ban_detail) {
      const modal = Modal.error({
        title: 'แจ้งเตือน',
        content: `กรุณาใส่เหตุผลเพื่อแบนร้านค้า`,
      })
      return
    }

    confirm({
      title: values.is_ban ? 'ยืนยันการยกเลิกแบนร้านค้า?' : 'ยืนยันการแบนร้านค้า?',
      icon: <ExclamationCircleOutlined />,
      okText: 'ยืนยัน',
      cancelText: 'ยกเลิก',
      okButtonProps: {
        style: {
          background: !values.is_ban ? `#EB5757` : `#28A745`,
          borderColor: !values.is_ban ? `#EB5757` : `#28A745`,
        },
      },
      async onOk() {
        banOutletSubmit(values)
      },
      async onCancel() {
        console.log('Closed!')
      },
    })
  }

  const banOutletSubmit = async (value: typeof outletInitialValues) => {
    const request = {
      data: {
        id: value.outlet_id,
        is_ban: !value.is_ban,
        ban_detail: value.ban_detail,
      },
    }
    const { result, success } = await banOutlet(request)
    if (success) {
      notification.success({
        message: `สำเร็จ`,
        description: '',
      })
      router.reload()
    } else {
      // Handle Case : Not Success
      notification.success({
        message: `ไม่สำเร็จ`,
        description: '',
      })
    }
  }

  return (
    <MainLayout isLoading={isLoadingPage}>
      <Row justify="space-around" align="middle">
        <Col span={24}>
          <Title level={4}>บัญชีผู้ใช้งาน</Title>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>บัญชีผู้ใช้งาน</Breadcrumb.Item>
            <Breadcrumb.Item>บัญชีร้านค้า</Breadcrumb.Item>
            <Breadcrumb.Item>ข้อมูลบัญชีร้านค้า</Breadcrumb.Item>
            <Breadcrumb.Item>ระงับผู้ใช้งาน</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col span={8} offset={8} style={{ textAlign: 'end' }}></Col>
      </Row>
      <Card>
        <Row gutter={16}>
          <Col className="gutter-row" span={12}>
            <Title level={4}>ร้านค้า</Title>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col className="gutter-row" span={12}>
            <Title level={4}>การระงับร้านค้า</Title>
          </Col>
        </Row>
        <br />
        <Formik
          enableReinitialize={true}
          initialValues={outletInitialValues}
          onSubmit={handleSubmit}
          validationSchema={Schema}
        >
          {({ values }) => (
            <Form>
              <Row gutter={16} align="middle" justify="space-around">
                <Col className="gutter-row" md={9} xs={24} span={9}>
                  <Space direction="vertical">
                    <Text>
                      1.{values.outlet_name} (MerchantId : {values.shop_id})
                    </Text>
                    <CustomBadge
                      size="default"
                      customMapping={banTextMapping(values.is_ban)}
                    ></CustomBadge>
                  </Space>
                </Col>
                <Col className="gutter-row" md={11} xs={24} span={11}>
                  <Field
                    label={{ text: 'เหตุผล' }}
                    name="ban_detail"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="ban_detail"
                    placeholder="เหตุผล"
                  />
                </Col>
                <Col span={4} md={4} xs={24} style={{ padding: '0 19px' }}>
                  {values.is_ban ? (
                    <Button type="primary" block htmlType="submit">
                      ยกเลิกแบนผู้ใช้งาน
                    </Button>
                  ) : (
                    <Button type="primary" block htmlType="submit" isDanger={true}>
                      แบนผู้ใช้งาน
                    </Button>
                  )}
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
        <br />
        <br />
        <br />
        <Row gutter={16} style={{ paddingTop: 10 }}>
          <Col span={12} md={12} xs={24}>
            <Button
              onClick={() => {
                router.push(`/userprofile/merchant/${id}`)
              }}
              style={{ width: '120px', background: '#96989C', borderColor: '#96989C' }}
              type="primary"
              size="middle"
            >
              ย้อนกลับ
            </Button>
          </Col>
        </Row>
      </Card>
    </MainLayout>
  )
}
