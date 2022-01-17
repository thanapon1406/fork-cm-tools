import CustomBadge from '@/components/Badge'
import Button from '@/components/Button'
import Card from '@/components/Card'
import Input from '@/components/Form/Input'
import { userStatus } from '@/constants/textMapping'
import MainLayout from '@/layout/MainLayout'
import { getStaff, outletDetail } from '@/services/merchant'
import { GetSocialLinkProvider } from '@/services/sso'
import { StopOutlined } from '@ant-design/icons'
import { Breadcrumb, Col, Row, Space, Typography } from 'antd'
import { Field, Form, Formik } from 'formik'
import { map } from 'lodash'
import moment from 'moment'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { ReactElement, useEffect, useState } from 'react'
import facebookLogo from '../../../public/asset/icon/facebook.png'
import googleLogo from '../../../public/asset/icon/google.png'
import lineLogo from '../../../public/asset/icon/line.png'
const { Title, Text } = Typography
interface Props {}

interface Personal {
  staff: Array<any>
  default_value: Array<any>
}

export default function StaffMerchant({}: Props): ReactElement {
  const router = useRouter()
  const { id, user_id } = router.query
  const [isLoadingPage, setIsLoading] = useState(true)

  let [userInitialValues, setUserInitialValues] = useState({
    name: '',
    user_id: '',
    tel: '',
    email: '',
    line_id: '',
    nation_id: '',
    verify_email: '',
    is_ban: false,
    register_date: '',
    created_at: '',
    status: '',
    social: [],
  })

  useEffect(() => {
    if (id) {
      getOutlet(id, user_id)
    }
  }, [id])

  const getOutlet = async (outletId: any, userId: any) => {
    const request = {
      id: outletId,
    }
    const { result, success } = await outletDetail(request)
    let verify_email = ''
    if (success) {
      const { data: outletData } = result
      verify_email = outletData?.email
      const userRequest: any = {
        page: 1,
        per_page: 10,
        id: userId,
      }

      const { result: userResult, success: userSuccess } = await getStaff(userRequest)
      if (userSuccess) {
        setIsLoading(false)
        const { data } = userResult
        const {
          email = '',
          firstname = '',
          lastname = '',
          tel = '',
          sso_id = '',
          nation_id = '',
          is_ban = false,
          line_id = '',
          user_status = '',
          created_at = '',
        } = data

        let social: any = []
        if (sso_id) {
          const socialReq = {
            uid: sso_id,
            project_id: '1',
          }
          const { result: ssoResult, success: ssoSuccess } = await GetSocialLinkProvider(socialReq)
          if (ssoSuccess) {
            const { data } = ssoResult
            social = map(data, (val) => {
              return val['provider'] || '-'
            })
          }
        }

        setUserInitialValues({
          ...userInitialValues,
          name: `${firstname} ${lastname}`,
          user_id: '',
          tel: tel,
          email: email,
          nation_id: nation_id,
          verify_email: verify_email,
          is_ban: is_ban,
          status: user_status,
          line_id: line_id,
          register_date: created_at ? moment(created_at).format('YYYY-MM-DD HH:mm') : '',
          created_at: created_at ? moment(created_at).format('YYYY-MM-DD HH:mm') : '',
          social: social,
        })
      }
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

  const handleSubmit = (values: Personal) => {}

  const renderSocialLink = (socialList: any) => {
    return socialList.map((val: string) => {
      let logImg = googleLogo
      switch (val) {
        case 'google':
          logImg = googleLogo
          break
        case 'facebook':
          logImg = facebookLogo
          break
        case 'line':
          logImg = lineLogo
          break
      }
      return (
        <span id={val} style={{ marginRight: '10px' }}>
          <Image src={logImg} width={30} height={30} />
        </span>
      )
    })
  }

  return (
    <MainLayout isLoading={isLoadingPage}>
      <Row justify="space-around" align="middle">
        <Col span={24}>
          <Title level={4}>บัญชีผู้ใช้งาน</Title>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>อนุมัติผลการลงทะเบียน</Breadcrumb.Item>
            <Breadcrumb.Item>ลงทะเบียนร้านค้า</Breadcrumb.Item>
            <Breadcrumb.Item>ข้อมูลร้านค้า</Breadcrumb.Item>
            <Breadcrumb.Item>ข้อมูลพนักงาน</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col span={8} offset={8} style={{ textAlign: 'end' }}></Col>
      </Row>
      <Card>
        <Formik enableReinitialize={true} initialValues={userInitialValues} onSubmit={() => {}}>
          {(values) => (
            <Form>
              <br />
              <Row gutter={[16, 24]}>
                <Col className="gutter-row" span={4}>
                  <Title level={5}>ข้อมูลส่วนบุคคล</Title>
                </Col>
                <Col className="gutter-row" span={4}>
                  <Button
                    type="primary"
                    size="small"
                    disabled
                    onClick={() => {
                      router.push(
                        '/userprofile/merchant/[id]/ban-user',
                        `/userprofile/merchant/${id}/ban-user`
                      )
                    }}
                    isDanger={true}
                  >
                    <StopOutlined />
                    แบนผู้ใช้งาน
                  </Button>
                </Col>
                <Col className="gutter-row" span={14} style={{ textAlign: 'end' }} offset={2}>
                  <Space size={20}>
                    <Space>
                      <Text strong>สถานะพนักงาน : </Text>
                      <CustomBadge
                        customMapping={banTextMapping(userInitialValues.is_ban)}
                        size="default"
                      ></CustomBadge>
                    </Space>
                    <Space>
                      <Text strong>สถานะCMS : </Text>
                      <CustomBadge
                        customMapping={userStatus[userInitialValues.status]}
                        size="default"
                      ></CustomBadge>
                    </Space>
                  </Space>
                </Col>
              </Row>
              <br />
              <Row gutter={16}>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'ชื่อ-นามสกุล' }}
                    name="name"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="name"
                    placeholder="ชื่อนามสกุล"
                    disabled={true}
                  />
                </Col>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'เลขบัตรประชาชน' }}
                    name="nation_id"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="nation_id"
                    placeholder="เลขบัตรประชาชน"
                    disabled={true}
                  />
                </Col>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'เบอร์โทรศัพท์' }}
                    name="tel"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="tel"
                    placeholder="เบอร์โทรศัพท์"
                    disabled={true}
                  />
                </Col>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'อีเมลที่ลงทะเบียน' }}
                    name="email"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="email"
                    placeholder="อีเมลที่ลงทะเบียน"
                    disabled={true}
                  />
                </Col>
              </Row>
              <Row gutter={16}>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'LINE ID' }}
                    name="line_id"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="line_id"
                    placeholder="LINE ID"
                    disabled={true}
                  />
                </Col>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'วันที่สร้างพนักงาน' }}
                    name="created_at"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="created_at"
                    placeholder="LINE ID"
                    disabled={true}
                  />
                </Col>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'วันที่ลงทะเบียน Merchant app' }}
                    name="register_date"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="register_date"
                    placeholder="LINE ID"
                    disabled={true}
                  />
                </Col>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'อีเมลที่ยืนยัน' }}
                    name="verify_email"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="verify_email"
                    placeholder="อีเมลที่ยืนยัน"
                    disabled={true}
                  />
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
        <div>
          <Text strong>Social Login</Text>
        </div>
        <br />
        {renderSocialLink(userInitialValues.social)}
        <br />
        <br />
        <br />
        <Row gutter={16} style={{ paddingTop: 10 }}>
          <Col span={12} md={12} xs={24}>
            <Button
              onClick={() => {
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
