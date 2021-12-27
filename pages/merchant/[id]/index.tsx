import Button from '@/components/Button'
import Card from '@/components/Card'
import Input from '@/components/Form/Input'
import Select from '@/components/Form/Select'
import StaffList from '@/containers/staff-list'
import { useLoadingContext } from '@/contexts/LoadingContext'
import MainLayout from '@/layout/MainLayout'
import { approveOutlet, outletDetail, personalData } from '@/services/merchant'
import { Breadcrumb, Col, Divider, notification, Row, Typography } from 'antd'
import { Field, Form, Formik } from 'formik'
import lodash from 'lodash'
import { useRouter } from 'next/router'
import React, { ReactElement, useEffect, useState } from 'react'
import * as Yup from 'yup'
import Ekyc from '../../ekyc/component'
const { Title } = Typography

interface Props {}

export default function View({}: Props): ReactElement {
  const router = useRouter()
  const { id } = router.query
  const [ssoId, setSsoid] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const Loading = useLoadingContext()
  let [userInitialValues, setUserInitialValues] = useState({
    user_name: '',
    user_id: '',
    user_phone: '',
    user_email: '',
    nation_id: '',
    verify_email: '',
  })

  let [outletInitialValues, setOutletInitialValues] = useState({
    outlet_name: '',
    outlet_type: '',
    tax_id: '',
    email: '',
    tel: '',
    address: '',
    verify_status: '',
    verify_detail: [],
  })

  const verifyDetailListReApprove = [
    {
      name: 'ชื่อ นามสกุลไม่ถูกต้อง',
      value: '1',
      key: 'personal',
    },
    {
      name: 'เลขบัตรประชาชนไม่ถูกต้อง',
      value: '2',
      key: 'personal',
    },
    {
      name: 'ชื่อร้านค้า/แบรนด์ ไม่ถูกต้อง',
      value: '3',
      key: 'outlet',
    },
    {
      name: 'เลขประจำตัวผู้เสียภาษี ไม่ถูกต้อง',
      value: '4',
      key: 'outlet',
    },
    {
      name: 'ที่อยู่ร้านค้า/แบรนด์ ไม่ถูกต้อง',
      value: '5',
      key: 'outlet',
    },
    {
      name: 'เบอร์โทรศัพท์ร้านค้า ไม่ถูกต้อง',
      value: '6',
      key: 'outlet',
    },
    {
      name: 'ชื่อสาขา ไม่ถูกต้อง',
      value: '7',
      key: 'outlet',
    },
    {
      name: 'เลขประจำตัวผู้เสียภาษีประจำสาขา ไม่ถูกต้อง',
      value: '8',
      key: 'outlet',
    },
    {
      name: 'ที่อยู่สาขา ไม่ถูกต้อง',
      value: '9',
      key: 'outlet',
    },
    {
      name: 'เบอร์โทรศัพท์ร้านค้า ไม่ถูกต้อง',
      value: '10',
      key: 'outlet',
    },
  ]

  const verifyDetailListRejected = [
    {
      name: 'ตรวจสอบข้อมูลส่วนตัวมีประวัติเคยช่อโกง',
      value: '20',
    },
    {
      name: 'ตรวจสอบเลขประจำตัวผู้เสียภาษี',
      value: '21',
    },
    {
      name: 'ร้านค้าขายสินค้าผิดกฎหมาย',
      value: '22',
    },
  ]

  const mapBranchType: any = {
    single: 'ร้านค้าเดี่ยว',
    multiple: 'หลายสาขา',
  }

  useEffect(() => {
    if (id) {
      getOutlet()
    }
  }, [id])

  const getOutlet = async () => {
    const request = {
      id: id,
    }
    const { result, success } = await outletDetail(request)
    let verify_email = ''
    if (success) {
      setIsLoading(false)
      const { data } = result
      let verifyDetail = []
      if (data.verify_detail) {
        verifyDetail = data.verify_detail.map((d: any) => d.id)
      }
      ;(verify_email = data?.email),
        setOutletInitialValues({
          ...outletInitialValues,
          outlet_name: data?.name.th,
          outlet_type: mapBranchType[data?.branch_type],
          tax_id: data?.tax_id,
          email: data?.email,
          address: data?.address,
          verify_status: data?.verify_status,
          verify_detail: verifyDetail,
          tel: data?.tel,
        })
    }

    const userRequest: any = {
      page: 1,
      per_page: 10,
      id: id,
    }
    const { result: userResult, success: userSuccess } = await personalData(userRequest)
    if (userSuccess) {
      const { data: userData = [] } = userResult

      if (userData.length > 0 && userData[0]) {
        const { user = {} } = userData[0]
        const {
          email = '',
          first_name = '',
          last_name = '',
          tel = '',
          ssoid = '',
          nation_id = '',
        } = user
        if (ssoid) {
          setSsoid(ssoid)
        }
        setUserInitialValues({
          ...userInitialValues,
          user_name: `${first_name} ${last_name}`,
          user_id: '',
          user_phone: tel,
          user_email: email,
          nation_id: nation_id,
          verify_email: verify_email,
        })
      } else {
        router.replace('/merchant')
      }
    }
  }

  const Schema = Yup.object().shape({
    verify_status: Yup.string().trim().required('กรุณาเลือกการอนุมัติ'),
    verify_detail: Yup.mixed().test('is-42', 'กรุณาเลือกเหตุผล', (value: Array<any>, form: any) => {
      const { parent } = form
      const { verify_status = '' } = parent
      if (verify_status === 'rejected') {
        return value.length > 0
      }
      return true
    }),
  })

  const handleSubmit = async (values: any) => {
    let { verify_detail } = values
    let verifyRequest = {
      data: {
        id: id,
        verify_status: values.verify_status,
        verify_detail: [],
      },
    }
    Loading.show()
    if (values.verify_status === 'rejected' || values.verify_status === 're-approved') {
      verify_detail = verify_detail.map((d: any) => {
        const detailList =
          values.verify_status === 'rejected' ? verifyDetailListRejected : verifyDetailListReApprove
        const verifyDetail = lodash.find(detailList, { value: d })
        return {
          id: d,
          value: lodash.get(verifyDetail, 'name'),
          key: lodash.get(verifyDetail, 'key', undefined),
        }
      })
      verifyRequest.data.verify_detail = verify_detail
    }
    const { result, success } = await approveOutlet(verifyRequest)
    if (success) {
      notification.success({
        message: `บันทึกข้อมูลเรียบร้อยแล้ว`,
        description: '',
      })
      // router.push('/merchant')
    }
    Loading.hide()
  }

  return (
    <MainLayout isLoading={isLoading}>
      <Title level={4}>อนุมัติผลการลงทะเบียนเข้าใช้ระบบ</Title>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>อนุมัติผลการลงทะเบียน</Breadcrumb.Item>
        <Breadcrumb.Item>ลงทะเบียนร้านค้า</Breadcrumb.Item>
        <Breadcrumb.Item>ข้อมูลร้านค้า</Breadcrumb.Item>
      </Breadcrumb>
      <Card>
        <Title level={4}>ข้อมูลบัญชีร้านค้า</Title>
        {id && <StaffList outletId={id} page="merchant_approve" />}
        <Divider />
        <div>{ssoId && <Ekyc sso_id={ssoId} />}</div>
        <Formik
          enableReinitialize={true}
          initialValues={outletInitialValues}
          onSubmit={handleSubmit}
          validationSchema={Schema}
        >
          {({ values, setFieldValue }) => (
            <Form>
              <Divider />
              <Title level={5}>ข้อมูลร้านค้า</Title>
              <Row gutter={16}>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'ชื่อร้านค้า' }}
                    name="outlet_name"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="outlet_name"
                    placeholder="ชื่อร้านค้า"
                    disabled={true}
                  />
                </Col>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'ประเภทร้านค้า' }}
                    name="outlet_type"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="outlet_type"
                    placeholder="ประเภทร้านค้า"
                    disabled={true}
                  />
                </Col>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'หมายเลขประจำตัวผู้เสียภาษี' }}
                    name="tax_id"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="tax_id"
                    placeholder="หมายเลขประจำตัวผู้เสียภาษี"
                    disabled={true}
                  />
                </Col>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'อีเมล' }}
                    name="email"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="email"
                    placeholder="อีเมล"
                    disabled={true}
                  />
                </Col>
              </Row>
              <Row gutter={16}>
                <Col className="gutter-row" span={18}>
                  <Field
                    label={{ text: 'ที่อยู่' }}
                    name="address"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="address"
                    placeholder="ที่อยู่"
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
                    placeholder="อีเมล"
                    disabled={true}
                  />
                </Col>
              </Row>
              <Row gutter={16}>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'การอนุมัติ' }}
                    name="verify_status"
                    component={Select}
                    id="verify_status"
                    placeholder="เลือกสถานะ"
                    defaultValue="approve"
                    onChange={(event: any) => {
                      setFieldValue('verify_status', event)
                      setFieldValue('verify_detail', [])
                    }}
                    selectOption={[
                      {
                        name: 'Approve',
                        value: 'approved',
                      },
                      {
                        name: 'Reject',
                        value: 'rejected',
                      },
                      {
                        name: 'Re-approve',
                        value: 're-approved',
                      },
                    ]}
                  />
                </Col>
                <Col className="gutter-row" span={12}>
                  <Field
                    label={{ text: 'เหตุผล' }}
                    name="verify_detail"
                    component={Select}
                    id="verify_detail"
                    mode="multiple"
                    placeholder="เลือกเหตุผล"
                    selectOption={
                      values.verify_status === 'rejected'
                        ? verifyDetailListRejected
                        : verifyDetailListReApprove
                    }
                    disabled={values.verify_status == 'approved'}
                  />
                </Col>
                <Col className="gutter-row" span={6}>
                  <Button
                    style={{ width: '120px', marginTop: '31px' }}
                    type="primary"
                    size="middle"
                    htmlType="submit"
                  >
                    Submit
                  </Button>
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
      </Card>
    </MainLayout>
  )
}
