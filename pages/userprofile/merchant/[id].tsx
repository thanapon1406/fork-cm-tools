import Card from '@/components/Card'
import CheckBox from '@/components/Form/CheckBox'
import Input from '@/components/Form/Input'
import ImgButton from '@/components/ImgButton'
import Tag from '@/components/Tag'
import { days } from '@/constants/textMapping'
import useViewImage from '@/hooks/useViewImage'
import MainLayout from '@/layout/MainLayout'
import { approveOutlet, outletDetail, personalData } from '@/services/merchant'
import { Breadcrumb, Col, Divider, Row, Typography } from 'antd'
import { Field, FieldArray, Form, Formik } from 'formik'
import lodash from 'lodash'
import { useRouter } from 'next/router'
import React, { ReactElement, useEffect, useState } from 'react'
import * as Yup from 'yup'
const { Title, Text } = Typography

interface Props {}

export default function MerchantUserView({}: Props): ReactElement {
  const router = useRouter()
  const { id } = router.query
  const [ssoId, setSsoid] = useState('')
  let [userInitialValues, setUserInitialValues] = useState({
    user_name: '',
    user_id: '',
    user_phone: '',
    user_email: '',
  })

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
    business_times: [
      {
        id: 113,
        day: 'mon',
        outlet_id: 174,
        opening_time: '09:00',
        closed_time: '22:00',
        created_at: '2021-10-15T08:39:22Z',
        updated_at: '2021-10-15T08:39:22Z',
      },
      {
        id: 114,
        day: 'tue',
        outlet_id: 174,
        opening_time: '09:00',
        closed_time: '22:00',
        created_at: '2021-10-15T08:39:22Z',
        updated_at: '2021-10-15T08:39:22Z',
      },
      {
        id: 115,
        day: 'wed',
        outlet_id: 174,
        opening_time: '09:00',
        closed_time: '22:00',
        created_at: '2021-10-15T08:39:22Z',
        updated_at: '2021-10-15T08:39:22Z',
      },
      {
        id: 116,
        day: 'thu',
        outlet_id: 174,
        opening_time: '09:00',
        closed_time: '22:00',
        created_at: '2021-10-15T08:39:22Z',
        updated_at: '2021-10-15T08:39:22Z',
      },
      {
        id: 117,
        day: 'fri',
        outlet_id: 174,
        opening_time: '09:00',
        closed_time: '22:00',
        created_at: '2021-10-15T08:39:22Z',
        updated_at: '2021-10-15T08:39:22Z',
      },
      {
        id: 118,
        day: 'sat',
        outlet_id: 174,
        opening_time: '09:00',
        closed_time: '22:00',
        created_at: '2021-10-15T08:39:22Z',
        updated_at: '2021-10-15T08:39:22Z',
      },
      {
        id: 119,
        day: 'sun',
        outlet_id: 174,
        opening_time: '09:00',
        closed_time: '22:00',
        created_at: '2021-10-15T08:39:22Z',
        updated_at: '2021-10-15T08:39:22Z',
      },
    ],
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
      if (data[0]) {
        const { user = {} } = data[0]
        const { email = '', first_name = '', last_name = '', tel = '', ssoid = '' } = user
        if (ssoid) {
          setSsoid(ssoid)
        }
        setUserInitialValues({
          ...userInitialValues,
          user_name: `${first_name} ${last_name}`,
          user_id: '',
          user_phone: tel,
          user_email: email,
        })
      }
    }
  }

  const getOutlet = async () => {
    const request = {
      id: id,
    }
    const { result, success } = await outletDetail(request)
    if (success) {
      const { data } = result
      setOutletInitialValues({
        ...outletInitialValues,
        outlet_name: data?.name.th,
        outlet_type: mapBranchType[data.branch_type],
        tax_id: data?.tax_id,
        email: data?.email,
        full_address: data.full_address,
        address: data.address,
        verify_status: data.verify_status,
        photo: data?.photo,
        banner_photo: data?.banner_photo,
        latitude: data?.latitude,
        longitude: data?.longitude,
        tel: data?.tel,
        rating: data?.rating,
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
  const {
    onClickViewMedia,
    isShowMediaModal,
    setIsShowMediaModal,
    mediaType,
    mediaUrl,
    isLoadingMedia,
  } = useViewImage()

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
              <Row gutter={16}>
                <Col className="gutter-row" span={8}>
                  <Title level={5}>ข้อมูลบัญชีร้านค้า</Title>
                </Col>
                <Col className="gutter-row" span={8} offset={8}>
                  <Title style={{ textAlign: 'end' }} level={5}>
                    สถานะผู้ใช้งาน : <Tag type="primary">Active</Tag>
                  </Title>
                </Col>
              </Row>
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

        <Formik
          enableReinitialize={true}
          initialValues={outletInitialValues}
          onSubmit={handleSubmit}
          validationSchema={Schema}
        >
          {({ values }) => (
            <Form>
              <Divider />
              <Title level={5}>ข้อมูลร้านค้า</Title>
              <Row gutter={16}>
                <Col className="gutter-row" span={6}>
                  <div style={{ marginBottom: '6px' }}>
                    <Text>รูปภาพร้านค้า</Text>
                  </div>
                  <ImgButton url={values.photo} />
                </Col>
                <Col className="gutter-row" span={6}>
                  <div style={{ marginBottom: '6px' }}>
                    <Text>รูปภาพปกร้านค้า</Text>
                  </div>
                  <ImgButton url={values.banner_photo} />
                </Col>
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
              </Row>
              <Row gutter={16}>
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

                <Col className="gutter-row" span={18}>
                  <Field
                    label={{ text: 'ที่อยู่' }}
                    name="full_address"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="full_address"
                    placeholder="ที่อยู่"
                    disabled={true}
                  />
                </Col>
              </Row>

              <Row gutter={16}>
                <Col className="gutter-row" span={3}>
                  <Field
                    label={{ text: 'ละติจูด' }}
                    name="latitude"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="latitude"
                    placeholder="ประเภทร้านค้า"
                    disabled={true}
                  />
                </Col>

                <Col className="gutter-row" span={3}>
                  <Field
                    label={{ text: 'ลองจิจูด' }}
                    name="longitude"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="longitude"
                    placeholder="ลองจิจูด"
                    disabled={true}
                  />
                </Col>

                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'ตำแหน่งร้านค้า' }}
                    name="address"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="address"
                    placeholder="ตำแหน่งร้านค้า"
                    disabled={true}
                  />
                </Col>

                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'เบอร์โทรร้านค้า' }}
                    name="tel"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="tel"
                    placeholder="เบอร์โทรร้านค้า"
                    disabled={true}
                  />
                </Col>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'คะแนนร้านค้า' }}
                    name="rating"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="rating"
                    placeholder="คะแนนร้านค้า"
                    disabled={true}
                  />
                </Col>
              </Row>

              <Title level={5}>ข้อมูลการเปิด-ปิดร้าน</Title>

              <Row gutter={16}>
                <Col className="gutter-row" span={6}>
                  <Text style={{ marginTop: '12px' }}>วันเวลาที่เปิดปิด</Text>
                </Col>
                <Col className="gutter-row" span={18}>
                  <FieldArray
                    name="friends"
                    render={(arrayHelpers) => (
                      <div>
                        {values.business_times.map((day, index) => {
                          return (
                            <Row gutter={16} justify="space-around" align="middle" key={index}>
                              <Col className="gutter-row" span={8}>
                                <Field
                                  label={{ text: days[day['day']] }}
                                  name={`business_times.${index}.day`}
                                  component={CheckBox}
                                  className="form-control round"
                                  id="day"
                                  disabled={true}
                                />
                              </Col>
                              <Col className="gutter-row" span={8}>
                                <Field
                                  label={{ text: 'เวลา' }}
                                  name={`business_times.${index}.opening_time`}
                                  type="text"
                                  component={Input}
                                  className="form-control round"
                                  id="rating"
                                  placeholder="เวลา"
                                  disabled={true}
                                />
                              </Col>
                              <Col className="gutter-row" span={8}>
                                <Field
                                  label={{ text: 'เวลา' }}
                                  name={`business_times.${index}.closed_time`}
                                  type="text"
                                  component={Input}
                                  className="form-control round"
                                  id="rating"
                                  placeholder="เวลา"
                                  disabled={true}
                                />
                              </Col>
                            </Row>
                          )
                        })}
                      </div>
                    )}
                  />
                </Col>
              </Row>
              <Row gutter={16}>
                <Col className="gutter-row" span={6}>
                  <Text style={{ marginTop: '12px' }}>วันหยุดพิเศษ</Text>
                </Col>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'วันหยุดพิเศษ 1' }}
                    name="rating"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="rating"
                    placeholder="เวลา"
                    disabled={true}
                  />
                </Col>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'วันหยุดพิเศษ 2' }}
                    name="rating"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="rating"
                    placeholder="เวลา"
                    disabled={true}
                  />
                </Col>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'วันหยุดพิเศษ 3' }}
                    name="rating"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="rating"
                    placeholder="เวลา"
                    disabled={true}
                  />
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
      </Card>
    </MainLayout>
  )
}
