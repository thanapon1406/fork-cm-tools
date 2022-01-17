import CustomBadge from '@/components/Badge'
import Button from '@/components/Button'
import Card from '@/components/Card'
import Input from '@/components/Form/Input'
import Tag from '@/components/Tag'
import { onlineStatusTag, outletStatusTH, userStatus } from '@/constants/textMapping'
import { useLoadingContext } from '@/contexts/LoadingContext'
import MainLayout from '@/layout/MainLayout'
import { getStaff, outletDetail, updateOutletStatus } from '@/services/merchant'
import { GetSocialLinkProvider } from '@/services/sso'
import { StopOutlined } from '@ant-design/icons'
import { Breadcrumb, Col, Modal, Row, Select, Space, Typography } from 'antd'
import { Field, Form, Formik } from 'formik'
import { filter, map } from 'lodash'
import moment from 'moment'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { ReactElement, useEffect, useState } from 'react'
import facebookLogo from '../../../../public/asset/icon/facebook.png'
import googleLogo from '../../../../public/asset/icon/google.png'
import lineLogo from '../../../../public/asset/icon/line.png'

const { Title, Text } = Typography
interface Props {}

interface Personal {
  staff: Array<any>
  default_value: Array<any>
}

export default function StaffMerchantProfile({}: Props): ReactElement {
  const router = useRouter()
  const { id, user_id } = router.query
  const [isLoadingPage, setIsLoading] = useState(true)
  const [isEdit, setIsEdit] = useState(false)
  const Loading = useLoadingContext()

  let [outletInitialValues, setOutletInitialValues] = useState({
    outlet_name: '',
    outlet_type: '',
    tax_id: '',
    email: '',
    full_address: '',
    address: '',
    verify_status: '',
    photo: '',
    banner_photo: '',
    latitude: '',
    longitude: '',
    tel: '',
    rating: '',
    business_times: [],
    business_extra_times: [],
    status: '',
    default_status: '',
    opening_time: '',
    closed_time: '',
    available_credit: 0,
    isBan: false,
    user_service_type: '',
    brand_name: '',
    online_status: '',
    default_online_status: '',
  })

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

        setOutletInitialValues({
          ...outletInitialValues,
          outlet_name: outletData?.name.th,
          tax_id: outletData?.tax_id,
          email: outletData?.email,
          full_address: outletData.full_address,
          address: outletData.address,
          verify_status: outletData.verify_status,
          photo: outletData?.photo,
          banner_photo: outletData?.banner_photo,
          latitude: outletData?.latitude,
          longitude: outletData?.longitude,
          tel: outletData?.tel,
          rating: outletData?.rating,
          status: outletData?.status,
          default_status: outletData?.status,
          opening_time: outletData?.opening_time,
          closed_time: outletData?.closed_time,
          available_credit: outletData?.available_credit,
          isBan: outletData?.is_ban,
          online_status: outletData?.online_status,
          default_online_status: outletData?.online_status,
        })
      }
    }
  }

  const summaryBanStaff = (staffList: Array<any>) => {
    const banList = filter(staffList, (value) => {
      return value?.is_ban === true
    })
    if (staffList.length === 0) {
      return banTextMapping(false, true)
    }
    if (banList.length === staffList.length) {
      return banTextMapping(true)
    }
    return banTextMapping(false)
  }

  const handleSubmit = (values: Personal) => {}
  const handleSubmitStatus = async () => {
    // if (outletInitialValues.online_status === 'online') {
    //   const modal = Modal.error({
    //     title: 'แจ้งเตือน',
    //     content: `ไม่สามารถเปิดร้านได้ เนื่องจากพนักงานถูกระงับการใช้งาน`,
    //   })

    //   return
    // }
    Loading.show()
    const body = {
      data: {
        id: id,
        status: outletInitialValues.status,
        online_status: outletInitialValues.online_status,
      },
    }

    const { result, success } = await updateOutletStatus(body)
    if (success) {
      setOutletInitialValues({
        ...outletInitialValues,
        default_status: outletInitialValues.status,
        default_online_status: outletInitialValues.online_status,
      })
      //Todo: Get After update
      getOutlet(id, user_id)
      Modal.success({
        content: <Title level={4}>แก้ไขเรียบร้อยแล้ว</Title>,
      })
      setIsEdit(false)
    }
    Loading.hide()
  }

  const banTextMapping = (
    isBan: boolean,
    inactive = false
  ): { status: 'processing' | 'success' | 'error' | 'waiting'; text: string } => {
    if (inactive) {
      return {
        status: 'waiting',
        text: 'Inactive',
      }
    }
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

  const onlineStatusEditForm = (status: string) => {
    const onChange = (event: any) => {
      setOutletInitialValues({
        ...outletInitialValues,
        online_status: event ? event : 'offline',
      })
    }

    return (
      <Select
        style={{ width: '81px' }}
        defaultValue={outletInitialValues.online_status}
        onChange={onChange}
        size="small"
      >
        <Select.Option value="online">ร้านเปิด</Select.Option>
        <Select.Option value="offline">ร้านปิด</Select.Option>
      </Select>
    )
  }

  const outletStatusEditForm = (status: string) => {
    const onChange = (event: any) => {
      setOutletInitialValues({
        ...outletInitialValues,
        status: event ? event : 'closed',
      })
    }

    return (
      <Select
        style={{ width: '113px' }}
        defaultValue={outletInitialValues.status}
        onChange={onChange}
        size="small"
      >
        <Select.Option value="active">ดำเนินกิจการ</Select.Option>
        <Select.Option value="closed">ปิดกิจการ</Select.Option>
        <Select.Option value="temporarily_closed">ปิดปรับปรุง</Select.Option>
      </Select>
    )
  }

  const onlineStatusRender = (status: string) => {
    const mapping = onlineStatusTag[status]
    return status ? <Tag type={mapping?.status}>{mapping?.text}</Tag> : ''
  }

  const outletStatusRender = (status: string) => {
    const mapping = outletStatusTH[status]
    return status ? <Tag type={mapping.status}>{mapping.text}</Tag> : ''
  }

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
        <span key={val} style={{ marginRight: '10px' }}>
          <Image src={logImg} width={30} height={30} />
        </span>
      )
    })
  }

  return (
    <MainLayout isLoading={isLoadingPage}>
      <Row justify="space-around" align="middle">
        <Col span={12}>
          <Title level={4}>บัญชีผู้ใช้งาน</Title>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>บัญชีผู้ใช้งาน</Breadcrumb.Item>
            <Breadcrumb.Item>บัญชีร้านค้า</Breadcrumb.Item>
            <Breadcrumb.Item>ข้อมูลบัญชีร้านค้า</Breadcrumb.Item>
            <Breadcrumb.Item>ข้อมูลพนักงาน</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col span={12} style={{ textAlign: 'end' }}>
          <div>
            {isEdit ? (
              <Space size="small">
                <Button
                  type="default"
                  onClick={() => {
                    setIsEdit(false)
                    setOutletInitialValues({
                      ...outletInitialValues,
                      status: outletInitialValues.default_status,
                      online_status: outletInitialValues.default_online_status,
                    })
                  }}
                >
                  ยกเลิก
                </Button>
                <Button
                  type="primary"
                  onClick={() => {
                    handleSubmitStatus()
                  }}
                >
                  บันทึก
                </Button>
              </Space>
            ) : (
              <Button
                type="default"
                onClick={() => {
                  setIsEdit(true)
                }}
              >
                แก้ไข
              </Button>
            )}
          </div>
          <Space>
            <Title style={{ textAlign: 'end', margin: '16px 0px' }} level={5}>
              ร้านเปิด-ปิด :{' '}
              {isEdit
                ? onlineStatusEditForm(outletInitialValues.status)
                : onlineStatusRender(outletInitialValues.online_status)}
            </Title>
            <Title style={{ textAlign: 'end', margin: '16px 0px' }} level={5}>
              สถานะร้านค้า :{' '}
              {isEdit
                ? outletStatusEditForm(outletInitialValues.status)
                : outletStatusRender(outletInitialValues.status)}
            </Title>
          </Space>
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
                    disabled={!isEdit || outletInitialValues.default_online_status == 'online'}
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
