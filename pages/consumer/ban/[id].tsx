import Card from '@/components/Card';
import Input from '@/components/Form/Input';
import MainLayout from '@/layout/MainLayout';
import { consumerBan, consumerList } from '@/services/consumer';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Col, Modal, notification, Row, Typography } from 'antd';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import { ReactElement, useEffect, useState } from 'react';
import CustomBadge from '../../userprofile/rider/[id]/style';
const { Title } = Typography

interface Props { }
const { confirm } = Modal

export default function BanConsumer({ }: Props): ReactElement {
  const router = useRouter()
  const id = router.query.id as string
  let [initialValues, setInitialValues] = useState({
    email: '',
    ssoId: '',
    tel: '',
    socialName: '',
    point: '',
    rank: '',
    confirmEKYC: '',
    firstName: '',
    lastName: '',
    facebookId: '',
    appleId: '',
    googleId: '',
    lineId: '',
    isBan: false,
    remark: '',
  })

  const showModal = (values: any, ban: boolean) => {
    if (values.remark == undefined || values.remark == "" && values.isBan == false) {
      Modal.warning({
        content: 'กรุณาใส่เหตุผล เพื่อยืนยันการแบนผู้ใช้งาน',
        okText: 'ตกลง',
        okButtonProps: {
          style: {
            background: "#28A745",
            borderColor: "#28A745",
          },
        },
      });
    } else {
      openPopupBannedRider(values, ban)
    }
  }

  useEffect(() => {
    console.log(`useEffect`, id)
    if (id) {
      getConsumerList()
    }
  }, [id, initialValues.ssoId])

  const getConsumerList = async () => {
    const request = {
      id: id,
    }

    const { result, success } = await consumerList(request)
    if (success) {
      const {
        data: [data],
      } = result
      if (data) {
        setInitialValues({
          ...initialValues,
          email: data.email,
          ssoId: data.sso_id,
          tel: data.tel,
          socialName: (data.social_login_first_name == undefined ? '' : data.social_login_first_name) + ' ' + (data.social_login_last_name == undefined ? '' : data.social_login_last_name),
          point: data.point,
          rank: data.ranking,
          confirmEKYC: data.confirm_e_kyc,
          firstName: data.first_name == undefined ? '' : data.first_name,
          lastName: data.last_name == undefined ? '' : data.last_name,
          googleId: data.google_id,
          facebookId: data.facebook_id,
          appleId: data.apple_id,
          lineId: data.line_id,
          isBan: data.is_ban,
          remark: data.is_ban ? data.remark : "",
        })
      }
    }
  }

  const handleSubmit = async (values: any, ban: boolean) => {
    const request = {
      id: id,
      remark: values.remark,
      is_ban: ban,
    }
    const update = {
      data: request,
    }
    const { result, success } = await consumerBan(update)
    if (success) {
      notification.success({
        message: `ดำเนินการแบนสำเร็จ`,
        description: '',
      })
    } else {
      notification.error({
        message: `ไม่สามารถทำการ แบนได้`,
        description: '',
      })
    }
  }

  const openPopupBannedRider = async (values: any, ban: boolean) => {
    confirm({
      title: ban ? 'ยืนยันการแบนผู้ใช้งาน?' : 'ยืนยันการยกเลิกแบนผู้ใช้งาน?',
      icon: <ExclamationCircleOutlined />,
      okText: "ยืนยัน",
      cancelText: "ยกเลิก",
      okButtonProps: { style: { background: !ban ? `#EB5757` : `#28A745`, borderColor: !ban ? `#EB5757` : `#28A745` } },
      async onOk() {
        handleSubmit(values, ban)
      },
      async onCancel() {
        console.log('Closed!');
      },
    })
  }

  return (
    <MainLayout>
      <>
        <Formik enableReinitialize={true} initialValues={initialValues} onSubmit={() => { }}>
          {({ values }: any) => (
            <Form>
              <Row gutter={16}>
                <Col span={20}>
                  <Title level={4}>อนุมัติผลการลงทะเบียนเข้าใช้ระบบ</Title>
                  <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>User Consumer</Breadcrumb.Item>
                    <Breadcrumb.Item>Consumer Profile</Breadcrumb.Item>
                    <Breadcrumb.Item>Consumer Details</Breadcrumb.Item>
                    <Breadcrumb.Item>Ban Consumer</Breadcrumb.Item>
                  </Breadcrumb>
                </Col>
              </Row>
              <Card>
                <Row gutter={16}>
                  <Col span={8} style={{ paddingLeft: 0 }}>
                    <h2>แบนบัญชีลูกค้า (Ban Consumer Profile)</h2>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={8}>
                    <Row gutter={16}>
                      {initialValues.firstName +
                        ' ' +
                        initialValues.lastName +
                        ' (SSO ID: ' +
                        initialValues.ssoId +
                        ')'}
                    </Row>
                    <Row gutter={16}>
                      {initialValues.isBan ? (
                        <CustomBadge status="error" text="ถูกแบนผู้ใช้งาน" />
                      ) : (
                        <CustomBadge status="success" text="ปกติ" />
                      )}
                    </Row>
                  </Col>
                  <Col span={10}>
                    <Field
                      label={{ text: 'เหตุผล' }}
                      name="remark"
                      type="text"
                      component={Input}
                      className="form-control round"
                      placeholder=""
                      isRange={true}
                    />
                  </Col>
                  <Col span={2}>
                    {initialValues.isBan ? (
                      <Button
                        type="primary"
                        style={{ marginTop: '25px' }}
                        className="confirm-button"
                        onClick={() => {
                          showModal(values, false)
                        }}
                      >
                        ยกเลิกแบนผู้ใช้งาน
                      </Button>
                    ) : (
                      <Button
                        style={{ marginTop: '25px' }}
                        type="primary"
                        danger
                        onClick={() => {
                          showModal(values, true)
                        }}
                      >
                        แบนผู้ใช้งาน
                      </Button>
                    )}
                  </Col>
                </Row>
                <Button
                  type="default"
                  style={{ float: 'left' }}
                  onClick={() => {
                    router.back()
                  }}
                >
                  ย้อนกลับ
                </Button>
              </Card>
            </Form>
          )}
        </Formik>
      </>
    </MainLayout>
  )
}
