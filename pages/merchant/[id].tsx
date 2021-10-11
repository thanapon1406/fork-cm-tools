import React, { ReactElement, useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import MainLayout from '@/layout/MainLayout'
import Select from '@/components/Form/Select'
import Button from '@/components/Button'
import Table from '@/components/Table'
import Card from '@/components/Card'
import { Row, Col, Typography, Breadcrumb, Divider } from 'antd'
const { Title } = Typography
import { Formik, Form, Field } from 'formik'
import Input from '@/components/Form/Input'
import Ekyc from '../ekyc/[id]'
import * as Yup from 'yup'
import lodash from 'lodash'
import { approveOutlet, outletDetail, outletList } from '@/services/merchant'
import { useRecoilState } from 'recoil'
import { merchantState } from '@/store'

interface Props {}

export default function view({}: Props): ReactElement {
  const router = useRouter()
  const { id } = router.query
  const [userObj, setUserObj] = useRecoilState(merchantState)
  const [ssoId, setSsoid] = useState('')
  let [userInitialValues, setUserInitialValues] = useState({
    user_name: '',
    user_id: '',
    user_phone: '',
    user_email: '',
  })

  let [outletInitialValues, setOutletInitialValues] = useState({
    outlet_name: '124',
    outlet_type: '',
    tax_id: '',
    email: '',
    address: '',
    verify_status: '',
    verify_detail: [],
  })
  const verifyDetailList = [
    {
      name: 'เหตผลที่1',
      value: '1',
    },
    {
      name: 'เหตผลที่2',
      value: '2',
    },
    {
      name: 'เหตผลที่3',
      value: '3',
    },
    {
      name: 'เหตผลที่4',
      value: '4',
    },
    {
      name: 'เหตผลที่5',
      value: '5',
    },
  ]

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
    const { result, success } = await outletList(request)
    if (success) {
      const { data } = result
      const { user = {} } = data[0]
      console.log(`user`, user)
      const { email = '', first_name = '', last_name = '', tel = '', ssoid = '' } = user
      console.log(`ssoid`, ssoid)
      setSsoid(ssoid)
      setUserInitialValues({
        ...userInitialValues,
        user_name: `${first_name} ${last_name}`,
        user_id: '',
        user_phone: tel,
        user_email: email,
      })
    }
    return
  }

  const getOutlet = async () => {
    const request = {
      id: id,
    }
    const { result, success } = await outletDetail(request)
    if (success) {
      const { data } = result
      let verifyDetail = []
      if (data.verify_detail) {
        verifyDetail = data.verify_detail.map((d: any) => d.id)
      }

      setOutletInitialValues({
        ...outletInitialValues,
        outlet_name: data.name.th,
        outlet_type: data.outlet_type,
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
  })

  const handleSubmit = async (values: any) => {
    let { verify_detail } = values
    verify_detail = verify_detail.map((d: any) => {
      return {
        id: d,
        value: lodash.find(verifyDetailList, { value: d })?.name,
      }
    })
    const verifyRequest = {
      data: {
        id: id,
        verify_status: values.verify_status,
        verify_detail: verify_detail,
      },
    }

    const { result, success } = await approveOutlet(verifyRequest)
    if (success) {
      console.log(`result`, result)
    }
  }

  return (
    <MainLayout>
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
                    name="user_id"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="user_id"
                    placeholder="เลขบัตรประชาชน"
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
                  />
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
        <div>
          {/* 7490b5b4-636b-4121-8c93-f0e2fc945a4a //fortest*/}
          {ssoId && <Ekyc isComponent sso_id={ssoId} />}
        </div>
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
                    placeholder="เลือก"
                    defaultValue="approve"
                    selectOption={[
                      {
                        name: 'Approve',
                        value: 'approve',
                      },
                      {
                        name: 'Reject',
                        value: 'reject',
                      },
                      {
                        name: 'Re-approve',
                        value: 're-approve',
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
                    placeholder="เลือก"
                    selectOption={verifyDetailList}
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
