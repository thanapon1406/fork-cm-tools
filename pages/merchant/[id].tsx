import Button from '@/components/Button'
import Card from '@/components/Card'
import Input from '@/components/Form/Input'
import Select from '@/components/Form/Select'
import MainLayout from '@/layout/MainLayout'
import { approveOutlet, outletDetail, personalData } from '@/services/merchant'
import { Breadcrumb, Col, Divider, Row, Typography } from 'antd'
import { Field, Form, Formik } from 'formik'
import lodash from 'lodash'
import { useRouter } from 'next/router'
import React, { ReactElement, useEffect, useState } from 'react'
import * as Yup from 'yup'
import Ekyc from '../ekyc/component'

const { Title } = Typography

interface Props {}

export default function View({}: Props): ReactElement {
  const router = useRouter()
  const { id } = router.query
  const [ssoId, setSsoid] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  let [userInitialValues, setUserInitialValues] = useState({
    user_name: '',
    user_id: '',
    user_phone: '',
    user_email: '',
    nation_id: '',
  })

  let [outletInitialValues, setOutletInitialValues] = useState({
    outlet_name: '',
    outlet_type: '',
    tax_id: '',
    email: '',
    address: '',
    verify_status: '',
    verify_detail: [],
  })
  const verifyDetailList = [
    {
      name: 'ชื่อร้านค้า/แบรนด์ ไม่ถูกต้อง',
      value: '1',
    },
    {
      name: 'เลขประจำตัวผู้เสียภาษี ไม่ถูกต้อง',
      value: '2',
    },
    {
      name: 'ที่อยู่ร้านค้า/แบรนด์ ไม่ถูกต้อง',
      value: '3',
    },
    {
      name: 'เบอร์โทรศัพท์ร้านค้า ไม่ถูกต้อง',
      value: '4',
    },
    {
      name: 'ชื่อสาขา ไม่ถูกต้อง',
      value: '5',
    },
    {
      name: 'เลขประจำตัวผู้เสียภาษีประจำสาขา ไม่ถูกต้อง',
      value: '6',
    },
    {
      name: 'ที่อยู่สาขา ไม่ถูกต้อง',
      value: '7',
    },
    {
      name: 'เบอร์โทรศัพท์ร้านค้า ไม่ถูกต้อง',
      value: '8',
    },
  ]

  const mapBranchType: any = {
    single: 'ร้านค้าเดี่ยว',
    multiple: 'หลายสาขา',
  }

  useEffect(() => {
    if (id) {
      getOutlet()
      getPersonal()
    }
  }, [id])

  const getPersonal = async () => {
    const request: any = {
      page: 1,
      per_page: 10,
      id: id,
    }
    const { result, success } = await personalData(request)
    if (success) {
      const { data = [] } = result

      if (data.length > 0 && data[0]) {
        const { user = {} } = data[0]
        const {
          email = '',
          first_name = '',
          last_name = '',
          tel = '',
          ssoid = '',
          nation_id = '',
        } = user
        console.log(`nation_id`, nation_id)
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
        })
      } else {
        router.replace('/merchant')
      }
    }
  }

  const getOutlet = async () => {
    const request = {
      id: id,
    }
    const { result, success } = await outletDetail(request)
    setIsLoading(false)
    if (success) {
      const { data } = result
      let verifyDetail = []
      if (data.verify_detail) {
        verifyDetail = data.verify_detail.map((d: any) => d.id)
      }

      setOutletInitialValues({
        ...outletInitialValues,
        outlet_name: data.name.th,
        outlet_type: mapBranchType[data.branch_type],
        tax_id: data.tax_id,
        email: data.email,
        address: data.address,
        verify_status: data.verify_status,
        verify_detail: verifyDetail,
      })
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

    if (values.verify_status === 'rejected') {
      verify_detail = verify_detail.map((d: any) => {
        return {
          id: d,
          value: lodash.find(verifyDetailList, { value: d })?.name,
        }
      })
      verifyRequest.data.verify_detail = verify_detail
    }

    const { result, success } = await approveOutlet(verifyRequest)
    if (success) {
      router.push('/merchant')
    }
  }

  return (
    <MainLayout isLoading={isLoading}>
      <Title level={4}>อนุมัติผลการละทะเบียนเข้าใช้ระบบ</Title>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>อนุมัติผลการละทะเบียน</Breadcrumb.Item>
        <Breadcrumb.Item>ลงทะเบียนร้านค้า</Breadcrumb.Item>
        <Breadcrumb.Item>ข้อมูลร้านค้า</Breadcrumb.Item>
      </Breadcrumb>
      <Card>
        <br />
        <Formik
          enableReinitialize={true}
          initialValues={userInitialValues}
          onSubmit={() => {}}
          validationSchema={Schema}
        >
          {(values) => (
            <Form>
              <Title level={5}>ข้อมูลการลงทะเบียน</Title>
              <Title level={5}>ข้อมูลส่วนบุคคล</Title>
              <Row gutter={16}>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'ชื่อ-นามสกุล' }}
                    name="user_name"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="user_name"
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
                    name="user_phone"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="user_phone"
                    placeholder="เบอร์โทรศัพท์"
                    disabled={true}
                  />
                </Col>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'อีเมล์' }}
                    name="user_email"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="user_email"
                    placeholder="อีเมล์"
                    disabled={true}
                  />
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
        <div>{ssoId && <Ekyc sso_id={ssoId} />}</div>
        <Formik
          enableReinitialize={true}
          initialValues={outletInitialValues}
          onSubmit={handleSubmit}
          validationSchema={Schema}
        >
          {(values) => (
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
                    label={{ text: 'อีเมล์' }}
                    name="email"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="email"
                    placeholder="อีเมล์"
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
                    selectOption={verifyDetailList}
                    disabled={values.values.verify_status !== 'rejected'}
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
