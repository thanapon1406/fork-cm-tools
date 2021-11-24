import Button from '@/components/Button'
import Card from '@/components/Card'
import CheckBox from '@/components/Form/CheckBox'
import Input from '@/components/Form/Input'
import ImgButton from '@/components/ImgButton'
import { StatusMapping } from '@/components/outlet/Status'
import Tab from '@/components/Tab'
import { days } from '@/constants/textMapping'
import MainLayout from '@/layout/MainLayout'
import { outletDetail, personalData, updateOutlet } from '@/services/merchant'
import { Breadcrumb, Col, Divider, Modal, Row, Space, Switch, Typography } from 'antd'
import { Field, FieldArray, Form, Formik } from 'formik'
import _ from 'lodash'
import { useRouter } from 'next/router'
import React, { ReactElement, useEffect, useState } from 'react'
import * as Yup from 'yup'
const { Title, Text } = Typography

interface Props {}

export default function MerchantUserView({}: Props): ReactElement {
  const router = useRouter()
  const { id } = router.query
  const [ssoid, setSsoid] = useState('')
  const [isEdit, setIsEdit] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

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
    opening_time: '',
    closed_time: '',
  })

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
      setIsLoading(false)
      const { data = [] } = result
      if (data[0]) {
        const { user = {} } = data[0]
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
        })
      }
    }
  }

  const getOutlet = async () => {
    const request = {
      id: id,
    }
    const { result, success } = await outletDetail(request)
    let verify_email = ''
    if (success) {
      const { data } = result
      let business_times_Set: any
      let business_extra_times_Set: any
      if (data?.business_times) {
        const convertStatus = (d: any) => {
          return {
            ...d,
            status: d.status === 'open' ? true : false,
          }
        }
        business_extra_times_Set = _.filter(data.business_times, { day: 'extra' })
        business_times_Set = _.filter(data.business_times, (d: any) => d.day !== 'extra')
        business_extra_times_Set = business_extra_times_Set.map(convertStatus)
        business_times_Set = business_times_Set.map(convertStatus)
      }
      ;(verify_email = data?.email),
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
          business_times: business_times_Set,
          business_extra_times: business_extra_times_Set,
          status: data?.status,
          opening_time: data?.opening_time,
          closed_time: data?.closed_time,
        })

      const userRequest: any = {
        page: 1,
        per_page: 10,
        id: id,
      }
      const { result: userResult, success: userSuccess } = await personalData(userRequest)
      if (userSuccess) {
        setIsLoading(false)
        const { data = [] } = userResult
        if (data[0]) {
          const { user = {} } = data[0]
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
        }
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

  const handleSubmit = async (values: any) => {}
  const handleSubmitStatus = async () => {
    const body = {
      data: {
        id: id,
        opening_time: outletInitialValues.opening_time,
        closed_time: outletInitialValues.closed_time,
        tel: outletInitialValues.tel,
        status: outletInitialValues.status,
      },
    }

    const { result, success } = await updateOutlet(body)
    if (success) {
      Modal.success({
        content: <Title level={4}>แก้ไขเรียบร้อยแล้ว</Title>,
      })
    }
  }

  const outletStatusRender = (status: string) => {
    return StatusMapping[status]
  }

  const statusEditForm = (status: string) => {
    const onChange = (event: any) => {
      setOutletInitialValues({
        ...outletInitialValues,
        status: event ? 'active' : 'inactive',
      })
    }
    return (
      <Switch
        onChange={onChange}
        checkedChildren="Active"
        unCheckedChildren="In-active"
        defaultChecked={status === 'active'}
      />
    )
  }

  return (
    <MainLayout isLoading={isLoading}>
      <Row justify="space-around" align="middle">
        <Col span={8}>
          <Title level={4}>บัญชีผู้ใช้งาน</Title>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>บัญชีผู้ใช้งาน</Breadcrumb.Item>
            <Breadcrumb.Item>บัญชีร้านค้า</Breadcrumb.Item>
            <Breadcrumb.Item>ข้อมูลบัญชีร้านค้า</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col span={8} offset={8} style={{ textAlign: 'end' }}>
          {isEdit ? (
            <Space size="small">
              <Button
                type="default"
                onClick={() => {
                  setIsEdit(false)
                }}
              >
                ยกเลิก
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  setIsEdit(false)
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
        </Col>
      </Row>

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
                    สถานะร้านค้า :{' '}
                    {isEdit
                      ? statusEditForm(outletInitialValues.status)
                      : outletStatusRender(outletInitialValues.status)}
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
                    label={{ text: 'อีเมลที่ลงทะเบียน' }}
                    name="user_email"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="user_email"
                    placeholder="อีเมลที่ลงทะเบียน"
                    disabled={true}
                  />
                </Col>
              </Row>
              <Row gutter={16}>
                <Col className="gutter-row" offset={18} span={6}>
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
              <br />
              {_.isEmpty(values.business_times) === false && (
                <Row gutter={16}>
                  <Col className="gutter-row" span={6}>
                    <Text style={{ marginTop: '12px' }}>วันเวลาที่เปิดปิด</Text>
                  </Col>
                  <Col className="gutter-row" span={18}>
                    <FieldArray
                      name="business_times"
                      render={(arrayHelpers) => (
                        <div>
                          {values.business_times.map((day, index) => {
                            return (
                              <Row gutter={16} justify="space-around" align="middle" key={index}>
                                <Col className="gutter-row" span={8}>
                                  <Field
                                    label={{ text: days[day['day']] }}
                                    name={`business_times.${index}.status`}
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
              )}

              {_.isEmpty(values.business_extra_times) === false && (
                <Row gutter={16}>
                  <Col className="gutter-row" span={6}>
                    <Text style={{ marginTop: '12px' }}>วันหยุดพิเศษ</Text>
                  </Col>
                  <Col className="gutter-row" span={18}>
                    <FieldArray
                      name="business_extra_times"
                      render={(arrayHelpers) => (
                        <div>
                          {values.business_extra_times.map((day, index) => {
                            return (
                              <Row gutter={16} justify="space-around" align="middle" key={index}>
                                <Col className="gutter-row" span={8}>
                                  <Field
                                    label={{ text: `วันหยุดพิเศษ ${index + 1}` }}
                                    name={`business_extra_times.${index}.status`}
                                    component={CheckBox}
                                    className="form-control round"
                                    id="day"
                                    disabled={true}
                                  />
                                </Col>
                                <Col className="gutter-row" span={8}>
                                  <Field
                                    label={{ text: 'วันที่' }}
                                    name={`business_extra_times.${index}.start_date`}
                                    type="text"
                                    component={Input}
                                    className="form-control round"
                                    id="rating"
                                    placeholder="วันที่"
                                    disabled={true}
                                  />
                                </Col>
                                <Col className="gutter-row" span={8}>
                                  <Field
                                    label={{ text: 'วันที่' }}
                                    name={`business_extra_times.${index}.end_date`}
                                    type="text"
                                    component={Input}
                                    className="form-control round"
                                    id="rating"
                                    placeholder="วันที่"
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
              )}
            </Form>
          )}
        </Formik>
        <Tab defaultActiveKey="1">
          <Tab.TabPane tab="ยอดใข้" key="1">
            Tab 1 Content
          </Tab.TabPane>
          <Tab.TabPane tab="ยอดซื้อ" key="2">
            Tab 2 Content
          </Tab.TabPane>
        </Tab>
      </Card>
    </MainLayout>
  )
}
