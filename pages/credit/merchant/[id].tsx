import Button from '@/components/Button'
import Card from '@/components/Card'
import Input from '@/components/Form/Input'
import Select from '@/components/Form/Select'
import ImgButton from '@/components/ImgButton'
import Tag from '@/components/Tag'
import { creditPaymentChanel, creditStatus, verifyStatusMapping } from '@/constants/textMapping'
import MainLayout from '@/layout/MainLayout'
import { transactionDetail, verifyTransaction } from '@/services/credit'
import { personState } from '@/store'
import { convertDateToString } from '@/utils/helpers'
import { Breadcrumb, Col, Empty, Modal, Row, Typography } from 'antd'
import { Field, Form, Formik } from 'formik'
import { find, get } from 'lodash'
import { useRouter } from 'next/router'
import React, { ReactElement, useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import * as Yup from 'yup'

const { Title, Text } = Typography
interface Props {}

export default function MerchantCreditDetail({}: Props): ReactElement {
  const router = useRouter()
  const { id } = router.query
  const [isLoading, setIsLoading] = useState(true)
  let [initialValues, setInitialValues] = useState({
    ref_id: '',
    outlet_name: '',
    amount: '',
    type: '',
    created_at: '',
    status: 'progressing',
    slip_1: '',
    slip_2: '',
    slip_3: '',
    slip_4: '',
    verify_status: '',
    verify_date: '',
    verify_detail: [],
    verify_user: '',
    outlet_id: 0,
  })
  const [userObject, setUserState] = useRecoilState(personState)
  const [approveStatus, setApproveStatus] = useState('default')

  const verifyDetailOption = [
    {
      name: 'ข้อมูลสลิปไม่ถูกต้อง',
      value: '1',
    },
    {
      name: 'ไม่พบรายการใน statement',
      value: '2',
    },
    {
      name: 'ยอดเติมไม่ถูกต้อง',
      value: '3',
    },
  ]
  const approveOption = [
    {
      name: 'เลือก',
      value: '',
    },
    {
      name: verifyStatusMapping['approved'],
      value: 'approved',
    },
    {
      name: verifyStatusMapping['rejected'],
      value: 'rejected',
    },
  ]

  useEffect(() => {
    if (id) {
      fetchData()
    }
  }, [id])

  const fetchData = async () => {
    const request = {
      id: id,
    }

    const { result, success } = await transactionDetail(request)
    setIsLoading(false)
    if (success) {
      const { data } = result
      const status = get(data, 'status', '')
      const verify_status = get(data, 'verify_status', '')

      let verifyDetail = []
      if (data.verify_detail) {
        verifyDetail = data.verify_detail.map((d: any) => d.id)
      }
      if (verify_status === 'approved' || verify_status === 'rejected') {
        setApproveStatus(verify_status)
      } else if (status === 'success') {
        setApproveStatus('success')
      } else if (status === 'failed') {
        setApproveStatus('failed')
      } else {
        setApproveStatus('waiting')
      }

      setInitialValues({
        ...initialValues,
        ref_id: get(data, 'transaction_id', ''),
        outlet_name: get(data, 'outlet_name.th', ''),
        amount: get(data, 'amount', ''),
        type: creditPaymentChanel[get(data, 'type', '')],
        created_at: convertDateToString(get(data, 'created_at', '')),
        status: status,
        slip_1: get(data, 'slip_1', ''),
        slip_2: get(data, 'slip_2', ''),
        slip_3: get(data, 'slip_3', ''),
        slip_4: get(data, 'slip_4', ''),
        verify_status: verifyStatusMapping[verify_status],
        verify_date: convertDateToString(get(data, 'verify_date', '')),
        verify_detail: verifyDetail,
        verify_user: get(data, 'verify_user.name', ''),
        outlet_id: get(data, 'outlet_id', ''),
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

  const outletStatusRender = (status: string) => {
    const statusObj = creditStatus[status]
    if (statusObj) {
      return <Tag type={statusObj.status}>{statusObj.text}</Tag>
    }
    return <Tag type="warning">{status}</Tag>
  }

  const handleSubmit = async (values: typeof initialValues) => {
    let { verify_detail } = values
    const reqBody: any = {
      id: id,
      outlet_id: values.outlet_id,
      verify_status: values.verify_status,
      verify_detail: [],
      verify_user: {
        id: userObject.id,
        name: userObject.username,
      },
    }

    if (values.verify_status === 'rejected') {
      const verifyText: any[] = verify_detail.map((d: any) => {
        return {
          id: d,
          value: find(verifyDetailOption, { value: d })?.name,
        }
      })
      reqBody.verify_detail = verifyText
    }

    const { result, success } = await verifyTransaction(reqBody)
    if (success) {
      router.push('/credit/merchant')
      Modal.success({
        content: <Title level={4}>บันทึกข้อมูลเรียบร้อยแล้ว</Title>,
      })
    }
  }

  const slipRender = () => {
    const { slip_1, slip_2, slip_3, slip_4 } = initialValues
    if (slip_1 || slip_2 || slip_3 || slip_4) {
      return (
        <>
          {slip_1 && (
            <Col className="gutter-row" span={6}>
              <div style={{ marginBottom: '6px' }}>
                <Text>สลิป 1</Text>
              </div>
              <ImgButton url={slip_1} />
            </Col>
          )}
          {slip_2 && (
            <Col className="gutter-row" span={6}>
              <div style={{ marginBottom: '6px' }}>
                <Text>สลิป 2</Text>
              </div>
              <ImgButton url={slip_2} />
            </Col>
          )}
          {slip_3 && (
            <Col className="gutter-row" span={6}>
              <div style={{ marginBottom: '6px' }}>
                <Text>สลิป 3</Text>
              </div>
              <ImgButton url={slip_3} />
            </Col>
          )}
          {slip_4 && (
            <Col className="gutter-row" span={6}>
              <div style={{ marginBottom: '6px' }}>
                <Text>สลิป 4</Text>
              </div>
              <ImgButton url={slip_4} />
            </Col>
          )}
        </>
      )
    } else {
      return (
        <Col style={{ marginTop: '17px', marginLeft: '15px' }} className="gutter-row" span={24}>
          <Empty />
        </Col>
      )
    }
  }

  return (
    <MainLayout isLoading={isLoading}>
      <Row justify="space-around" align="middle">
        <Col span={12}>
          <Title level={4}>การจัดการเครดิตร้านค้า</Title>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>การจัดการเครดิตร้านค้า</Breadcrumb.Item>
            <Breadcrumb.Item>เครดิตร้านค้าทั้งหมด</Breadcrumb.Item>
            <Breadcrumb.Item>รายละเอียด</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col span={12}></Col>
        <Col span={12}></Col>
      </Row>

      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={Schema}
      >
        {({ values }) => (
          <Form>
            <Card marginBottom={15}>
              <Row gutter={16}>
                <Col className="gutter-row" span={8}>
                  <Title level={5}>รายละเอียดเครดิต</Title>
                </Col>
                <Col className="gutter-row" span={8} offset={8}>
                  <Title style={{ textAlign: 'end' }} level={5}>
                    สถานะ : {outletStatusRender(initialValues.status)}
                  </Title>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'Ref Id' }}
                    name="ref_id"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="ref_id"
                    placeholder="Ref Id"
                    disabled={true}
                  />
                </Col>
                <Col className="gutter-row" span={18}>
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
              </Row>

              <Row gutter={16}>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'จำนวนเงิน' }}
                    name="amount"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="amount"
                    placeholder="จำนวนเงิน"
                    disabled={true}
                  />
                </Col>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'ช่องทาง' }}
                    name="type"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="type"
                    placeholder="ช่องทาง"
                    disabled={true}
                  />
                </Col>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'เวลา' }}
                    name="created_at"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="created_at"
                    placeholder="เวลา"
                    disabled={true}
                  />
                </Col>
              </Row>
            </Card>
            <Card marginBottom={15}>
              <Row gutter={16}>
                <Col className="gutter-row" span={8}>
                  <Title level={5}>หลักฐานการเติมเครดิต</Title>
                </Col>
                <Col className="gutter-row" span={8} offset={8}></Col>
              </Row>
              <Row gutter={16}>{slipRender()}</Row>
              <br />
            </Card>
            {approveStatus === 'waiting' && (
              <Card marginBottom={15}>
                <Row gutter={16}>
                  <Col className="gutter-row" span={6}>
                    <Field
                      label={{ text: 'การอนุมัติ' }}
                      name="verify_status"
                      component={Select}
                      id="verify_status"
                      placeholder="เลือกสถานะ"
                      defaultValue=""
                      selectOption={approveOption}
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
                      selectOption={verifyDetailOption}
                      disabled={values.verify_status !== 'rejected'}
                    />
                  </Col>
                  <Col className="gutter-row" span={6}>
                    <Button
                      style={{ width: '120px', marginTop: '28px' }}
                      type="primary"
                      size="middle"
                      htmlType="submit"
                    >
                      Submit
                    </Button>
                  </Col>
                </Row>
              </Card>
            )}

            {approveStatus === 'rejected' && (
              <Card marginBottom={15}>
                <Row gutter={16}>
                  <Col className="gutter-row" span={6}>
                    <Field
                      label={{ text: 'การอนุมัติ' }}
                      name="verify_status"
                      component={Select}
                      id="verify_status"
                      placeholder="เลือกสถานะ"
                      defaultValue=""
                      selectOption={[
                        {
                          name: 'เลือก',
                          value: '',
                        },
                        {
                          name: 'อนุมัติ',
                          value: 'approved',
                        },
                        {
                          name: 'ไม่อนุมัติ',
                          value: 'rejected',
                        },
                      ]}
                      disabled={true}
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
                      selectOption={verifyDetailOption}
                      disabled={true}
                    />
                  </Col>
                </Row>
              </Card>
            )}

            {approveStatus === 'approved' && (
              <Card marginBottom={15}>
                <Row gutter={16}>
                  <Col className="gutter-row" span={6}>
                    <Field
                      label={{ text: 'การอนุมัติ' }}
                      name="verify_status"
                      component={Input}
                      id="verify_status"
                      placeholder="เลือกสถานะ"
                      disabled={true}
                    />
                  </Col>
                  <Col className="gutter-row" span={6}>
                    <Field
                      label={{ text: 'อนุมัติโดย' }}
                      name="verify_user"
                      component={Input}
                      id="verify_user"
                      disabled={true}
                    />
                  </Col>
                  <Col className="gutter-row" span={6}>
                    <Field
                      label={{ text: 'วันที่อนุมัติ' }}
                      name="verify_date"
                      component={Input}
                      id="verify_date"
                      disabled={true}
                    />
                  </Col>
                </Row>
              </Card>
            )}
          </Form>
        )}
      </Formik>
    </MainLayout>
  )
}
