
import CustomBadge from '@/components/Badge';
import Card from '@/components/Card';
import Input from "@/components/Form/Input";
import MainLayout from '@/layout/MainLayout';
import { consumerBan, consumerList } from '@/services/consumer';
import { Breadcrumb, Button, Col, Modal, notification, Row, Typography } from "antd";
import { Field, Form, Formik } from "formik";
import { useRouter } from 'next/router';
import { default as React, ReactElement, useEffect, useState } from 'react';
const { Title } = Typography

interface Props { }

export default function BanConsumer({ }: Props): ReactElement {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isBanConsumer, setIsBanConsumer] = useState(false);
  const [remark, setRemark] = useState('');

  const [isEdit, setIsEdit] = useState(false)
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
    isBan: false
  })

  const showModal = (values: any, ban: boolean) => {
    setIsModalVisible(true)
    setIsBanConsumer(ban)
    setRemark(values.remark)
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleOk = () => {
    handleSubmit()
    setIsModalVisible(false);
  };

  useEffect(() => {
    console.log(`useEffect`, id)
    if (id) {
      getConsumerList()
    }
  }, [id])

  const getConsumerList = async () => {
    const request = {
      id: id,
    }

    const { result, success } = await consumerList(request)
    if (success) {
      const { data: [data] } = result
      if (data) {
        setInitialValues({
          ...initialValues,
          email: data.email,
          ssoId: data.sso_id,
          tel: data.tel,
          socialName: data.social_login_first_name + " " + data.social_login_last_name,
          point: data.point,
          rank: data.ranking,
          confirmEKYC: data.confirm_e_kyc,
          firstName: data.first_name,
          lastName: data.last_name,
          googleId: data.google_id,
          facebookId: data.facebook_id,
          appleId: data.apple_id,
          lineId: data.line_id,
          isBan: data.is_ban,
        })
      }
    }
  }


  const handleSubmit = async () => {
    const request = {
      id: id,
      remark: remark,
      is_ban: isBanConsumer
    }
    const update = {
      data: request
    }
    const { result, success } = await consumerBan(update)
    if (success) {
      notification.success({
        message: `ดำเนินการแบนสำเร็จ`,
        description: "",
      });
      router.back()
    } else {
      notification.error({
        message: `ไม่สามารถทำการ แบนได้`,
        description: "",
      });
    }
    setIsEdit(!isEdit)
  }

  return (
    <MainLayout>
      <>
        <Formik
          enableReinitialize={true}
          initialValues={initialValues}
          onSubmit={() => { }}
        >
          {({ values }: any) => (
            <Form>
              <Row gutter={16}>
                <Col span={20}>
                  <Title level={4}>อนุมัติผลการละทะเบียนเข้าใช้ระบบ</Title>
                  <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>User Consumer</Breadcrumb.Item>
                    <Breadcrumb.Item>Consumer Profile</Breadcrumb.Item>
                    <Breadcrumb.Item>Consumer Details</Breadcrumb.Item>
                    <Breadcrumb.Item>Ban Consumer</Breadcrumb.Item>
                  </Breadcrumb>
                </Col>
              </Row>
              <Card>
                <Row gutter={16} >
                  <Col span={8} style={{ paddingLeft: 0 }}>
                    <h2>แบนบัญชีลูกค้า (Ban Consumer Profile)</h2>
                  </Col>
                </Row>
                <Row gutter={16} >
                  <Col span={8}>
                    <Row gutter={16} >
                      {initialValues.firstName + " " + initialValues.lastName + " (Consumer ID: " + initialValues.ssoId + ")"}
                    </Row>
                    <Row gutter={16} >
                      {initialValues.isBan ? <CustomBadge
                        customMapping={{
                          status: "error",
                          text: "ถูกแบนผู้ใช้งาน",
                        }}
                      ></CustomBadge> :
                        <CustomBadge
                          customMapping={{
                            status: "success",
                            text: "ปกติ",
                          }}
                        ></CustomBadge>}
                    </Row>
                  </Col>
                  <Col span={14}>
                    <Field
                      label={{ text: "เหตุผล" }}
                      name="remark"
                      type="text"
                      component={Input}
                      className="form-control round"
                      placeholder=""
                      isRange={true}
                    />
                  </Col>
                  <Col span={2}>
                    {
                      initialValues.isBan ?
                        <Button style={{ marginTop: '25px' }}
                          onClick={() => {
                            showModal(values, false)
                          }}
                        >
                          ยกเลิก</Button> :
                        <Button
                          style={{ marginTop: '25px' }}
                          type="primary"
                          danger
                          onClick={() => {
                            showModal(values, true)
                          }}
                        >แบน</Button>
                    }
                  </Col>
                </Row>
                <Button
                  type='default'
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
        <Modal
          okText="ยืนยัน"
          cancelText="ยกเลิก"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          {isBanConsumer ?
            <p>ยืนยันการแบนผู้ใช้งาน?</p> :
            <p>ยืนยันการยกเลิกแบนผู้ใช้งาน?</p>
          }
        </Modal>
      </>
    </MainLayout >

  )
}
