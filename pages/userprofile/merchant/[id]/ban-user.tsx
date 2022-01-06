import CustomBadge from '@/components/Badge'
import Button from '@/components/Button'
import Card from '@/components/Card'
import Input from '@/components/Form/Input'
import MainLayout from '@/layout/MainLayout'
import { banUser, personalData } from '@/services/merchant'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Breadcrumb, Col, Modal, notification, Row, Space, Typography } from 'antd'
import { Field, FieldArray, Form, Formik } from 'formik'
import { find, get, map } from 'lodash'
import { useRouter } from 'next/router'
import React, { ReactElement, useEffect, useState } from 'react'
const { confirm, useModal } = Modal

const { Title, Text } = Typography

interface Props {}

interface StaffModel {
  brand_list: string[]
  client_id: string
  created_at: Date
  email: string
  firstname: string
  id: number
  is_ban: boolean
  lastname: string
  outlet_list: string[]
  permissions_outlet: number[]
  sso_id: string
  tel: string
  updated_at: Date
  user_service_type: string
  user_status: string
  user_type: string
  ban_detail: string
}
interface Personal {
  staff: Array<any>
  default_value: Array<any>
}

export default function BanUserOutlet({}: Props): ReactElement {
  const router = useRouter()
  const { id } = router.query
  const [isLoadingPage, setIsLoading] = useState(true)

  let [outletInitialValues, setOutletInitialValues] = useState<Personal>({
    staff: [],
    default_value: [],
  })

  useEffect(() => {
    if (id) {
      getStaff(id)
    }
  }, [id])

  const getStaff = async (outletId: any) => {
    const request = {
      id: outletId,
      page: 1,
      per_page: 10,
      include_staff: true,
    }
    const { result, success } = await personalData(request)
    if (success) {
      setIsLoading(false)
      const { data } = result
      const personal = data[0]
      const { staff = [] } = personal
      let staffs = map(staff, (value: any, indedx: number) => {
        let ban_detail = ''
        const isBan = get(value, 'is_ban', false)
        if (isBan) {
          ban_detail = get(value, 'ban_detail')
        }
        return {
          ...value,
          is_ban: isBan,
          ban_detail,
        }
      })

      setOutletInitialValues({ staff: staffs, default_value: staff })
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

  const handleSubmit = (saving: boolean) => async (values: Personal, userId: any) => {
    if (!saving) {
      return
    }

    const staff = find(values.staff, { id: userId })
    const defaultStaff = find(outletInitialValues.default_value, { id: userId })

    if (staff.is_ban && staff.ban_detail == defaultStaff.ban_detail) {
      const modal = Modal.error({
        title: 'แจ้งเตือน',
        content: `กรุณาใส่เหตุผลเพื่อแบนผู้ใช้งาน`,
      })
      return
    }

    confirm({
      title: staff.is_ban ? 'ยืนยันการยกเลิกแบนผู้ใช้งาน?' : 'ยืนยันการแบนผู้ใช้งาน?',
      icon: <ExclamationCircleOutlined />,
      okText: 'ยืนยัน',
      cancelText: 'ยกเลิก',
      okButtonProps: {
        style: {
          background: !staff.is_ban ? `#EB5757` : `#28A745`,
          borderColor: !staff.is_ban ? `#EB5757` : `#28A745`,
        },
      },
      async onOk() {
        banUserSubmit(staff)
      },
      async onCancel() {
        console.log('Closed!')
      },
    })
  }

  const banUserSubmit = async (value: StaffModel) => {
    const request = {
      data: {
        id: value.id,
        is_ban: !value.is_ban,
        ban_detail: value.ban_detail,
        outlet_id: id,
      },
    }
    const { result, success } = await banUser(request)
    if (success) {
      notification.success({
        message: `สำเร็จ`,
        description: '',
      })
      router.reload()
    } else {
      // Handle Case : Not Success
      notification.error({
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
            <Title level={4}>พนักงาน</Title>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col className="gutter-row" span={12}>
            <Title level={4}>การระงับผู้ใช้งาน</Title>
          </Col>
        </Row>
        <br />
        <Formik
          enableReinitialize={true}
          initialValues={outletInitialValues}
          onSubmit={handleSubmit(false)}
        >
          {({ values }) => (
            <Form>
              <FieldArray
                name="business_times"
                render={(arrayHelpers) => (
                  <div>
                    {values.staff.map((staff: StaffModel, index) => {
                      return (
                        <Row
                          key={'staff_' + index}
                          gutter={16}
                          align="middle"
                          justify="space-around"
                        >
                          <Col className="gutter-row" md={9} xs={24} span={9}>
                            <Space direction="vertical">
                              <Text>
                                {`${staff?.firstname} ${staff?.lastname}`} (รหัสพนักงาน : -)
                              </Text>
                              <CustomBadge
                                size="default"
                                customMapping={banTextMapping(staff.is_ban)}
                              ></CustomBadge>
                            </Space>
                          </Col>
                          <Col className="gutter-row" md={11} xs={24} span={11}>
                            <Field
                              label={{ text: 'เหตุผล' }}
                              type="text"
                              name={`staff.${index}.ban_detail`}
                              component={Input}
                              className="form-control round"
                              id="ban_detail"
                              placeholder="เหตุผล"
                            />
                          </Col>
                          <Col span={4} md={4} xs={24} style={{ padding: '0 19px' }}>
                            {staff.is_ban ? (
                              <Button
                                type="primary"
                                block
                                onClick={() => handleSubmit(true)(values, staff.id)}
                              >
                                ยกเลิก
                              </Button>
                            ) : (
                              <Button
                                type="primary"
                                block
                                isDanger={true}
                                onClick={() => handleSubmit(true)(values, staff.id)}
                                htmlType="submit"
                              >
                                แบน
                              </Button>
                            )}
                          </Col>
                        </Row>
                      )
                    })}
                  </div>
                )}
              />
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
                // router.push(`/userprofile/merchant/${id}`)
                router.back()
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
