import Input from '@/components/Form/Input'
import MainLayout from '@/layout/MainLayout'
import { getRider, getRiderDetail, updateRider } from '@/services/rider'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Breadcrumb, Button, Card, Col, Modal, Row, Typography } from 'antd'
import { Field, Form, Formik } from 'formik'
import _ from 'lodash'
import { useRouter } from 'next/router'
import React, { ReactElement, useEffect, useState } from 'react'
import * as Yup from 'yup'
import CustomBadge from './style'

const { Title } = Typography
const { confirm } = Modal
interface Props { }

interface IQueryRider {
  id?: string | string[] | undefined
}

interface IRiderDetail {
  id?: string
  first_name?: string
  last_name?: string
  code?: string
  banned_status?: boolean
  banned_reason?: string
  active_status?: string
}

export default function RiderBan({ }: Props): ReactElement {
  const router = useRouter()
  const { id } = router.query
  let [_isLoading, setIsLoading] = useState(true)
  let [riderDetail, setRiderDetail] = useState<IRiderDetail>({})

  const Schema = Yup.object().shape({})

  useEffect(() => {
    if (id) {
      fetchData(id)
    }
  }, [id])

  const fetchData = async (id: any) => {
    const request: IQueryRider = {
      id: id,
    }
    setIsLoading(true)
    const { result, success } = await getRiderDetail(request)

    if (success) {
      const { data } = result
      let RiderDetail: IRiderDetail = {
        id: _.get(data, 'id') ? _.get(data, 'id') : '',
        first_name: _.get(data, 'first_name') ? _.get(data, 'first_name') : '',
        last_name: _.get(data, 'last_name') ? _.get(data, 'last_name') : '',
        code: _.get(data, 'code') ? _.get(data, 'code') : '',
        banned_status: _.get(data, 'banned_status') ? _.get(data, 'banned_status') : false,
        banned_reason: _.get(data, 'banned_reason') ? _.get(data, 'banned_reason') : '',
        active_status: _.get(data, 'active_status') ? _.get(data, 'active_status') : '',
      }
      setRiderDetail(RiderDetail)
      setIsLoading(false)
    } else {
      router.push(`/userprofile/rider`)
    }
  }

  const handleSubmit = async (values: IRiderDetail) => {
    // validate remark
    // console.log("values", values)
    const valid = await validateValue(values)
    if (valid) {
      openPopupBannedRider(values)
    } else {
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
    }
    // openPopupBannedRider(values)
  }

  const validateValue = async (values: IRiderDetail) => {
    const updateBannedStatus = !values.banned_status
    let valid = true
    if (updateBannedStatus && values.banned_reason == "") {
      valid = false
    }
    return valid
  }

  const openPopupBannedRider = async (values: IRiderDetail) => {
    const updateBannedStatus = !values.banned_status
    confirm({
      title: updateBannedStatus ? 'ยืนยันการแบนผู้ใช้งาน?' : 'ยืนยันการยกเลิกแบนผู้ใช้งาน?',
      icon: <ExclamationCircleOutlined />,
      okText: 'ยืนยัน',
      cancelText: 'ยกเลิก',
      okButtonProps: {
        style: {
          background: !riderDetail.banned_status ? `#EB5757` : `#28A745`,
          borderColor: !riderDetail.banned_status ? `#EB5757` : `#28A745`,
        },
      },
      async onOk() {
        // check job count
        const riderQuery = {
          id: id,
          page: 1,
          per_page: 1,
          include: 'job_count',
        }
        const { result, success } = await getRider(riderQuery)
        const { message, data } = result
        if (success) {
          const riderJobCount = _.get(data[0], 'job_count') ? _.get(data[0], 'job_count') : 0
          if (riderJobCount > 0) {
            // notification.error({
            //   message: `ไม่สามารถทำการแบนไรเดอร์นี้ได้`,
            //   description: 'ตรวจสอบพบงานของไรเดอร์คงค้างในระบบ',
            // })
            Modal.warning({
              title: 'ไม่สามารถทำการแบนไรเดอร์นี้ได้',
              content: 'ตรวจสอบพบงานของไรเดอร์คงค้างในระบบ',
              okText: 'ตกลง',
              okButtonProps: {
                style: {
                  background: "#28A745",
                  borderColor: "#28A745",
                },
              },
              async onOk() {
                router.reload()
              },
            });
          } else {
            // Update rider profile
            const riderBanData = {
              data: {
                id: id,
                banned_status: updateBannedStatus,
                banned_reason: updateBannedStatus ? values.banned_reason : "",
                active_status: updateBannedStatus ? 'inactive' : values.active_status,
              },
            }

            const { result, success } = await updateRider(riderBanData)
            if (success) {
              // notification.success({
              //   message: `สำเร็จ`,
              //   description: '',
              // })
              Modal.success({
                content: 'สำเร็จ',
                async onOk() {
                  router.reload()
                },
                okText: 'ตกลง',
                okButtonProps: {
                  style: {
                    background: "#28A745",
                    borderColor: "#28A745",
                  },
                },
              });
              // router.reload()
            } else {
              // Handle Case : Not Success
              // notification.success({
              //   message: `ไม่สำเร็จ`,
              //   description: '',
              // })
              Modal.error({
                content: 'ไม่สำเร็จ',
                okText: 'ตกลง',
                okButtonProps: {
                  style: {
                    background: "#28A745",
                    borderColor: "#28A745",
                  },
                },
              });
            }
          }
        } else {
          router.push(`/userprofile/rider`)
        }
      },
      async onCancel() {
        console.log('Closed!')
      },
    })
  }

  return (
    <MainLayout>
      {!_isLoading && (
        <>
          <Formik initialValues={riderDetail} onSubmit={handleSubmit} validationSchema={Schema}>
            {({ values, setFieldValue }) => (
              <Form>
                <Row gutter={16}>
                  <Col className="gutter-row" span={8}>
                    <Title level={4}>บัญชีผู้ใช้งาน</Title>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                      <Breadcrumb.Item>บัญชีผู้ใช้งาน</Breadcrumb.Item>
                      <Breadcrumb.Item>
                        <a href={`/userprofile/rider`}>บัญชีไรเดอร์</a>
                      </Breadcrumb.Item>
                      <Breadcrumb.Item>
                        <a href={`/userprofile/rider/${id}`}>ข้อมูลบัญชีไรเดอร์</a>
                      </Breadcrumb.Item>
                      <Breadcrumb.Item>แบนผู้ใช้งาน</Breadcrumb.Item>
                    </Breadcrumb>
                  </Col>
                </Row>
                <Card>
                  <Title level={5}>การแบนไรเดอร์</Title>
                  <Row gutter={16} style={{ paddingTop: 5 }}>
                    <Col span={8}>
                      {`${riderDetail.first_name} ${riderDetail.last_name} (Rider ID:${riderDetail.code})`}
                    </Col>
                    <Col span={10}>เหตุผล</Col>
                  </Row>
                  <Row gutter={16} style={{ paddingTop: 10 }}>
                    <Col span={8}>
                      {riderDetail.banned_status ? (
                        <CustomBadge status="error" text={`ถูกแบนผู้ใช้งาน`} />
                      ) : (
                        <CustomBadge status="success" text={`ปกติ`} />
                      )}
                    </Col>
                    <Col span={10}>
                      <Field
                        name="banned_reason"
                        type="text"
                        component={Input}
                        className="form-control"
                        id="banned_reason"
                        placeholder=""
                      />
                    </Col>
                    <Col span={6}>
                      <Button
                        style={{
                          width: '140px',
                          background: !riderDetail.banned_status ? `#EB5757` : `#17C2D7`,
                          borderColor: !riderDetail.banned_status ? `#EB5757` : `#17C2D7`,
                        }}
                        type="primary"
                        size="middle"
                        htmlType="submit"
                      >
                        {!riderDetail.banned_status ? `แบนผู้ใช้งาน` : `ยกเลิกแบนผู้ใช้งาน`}
                      </Button>
                    </Col>
                  </Row>
                  <Row gutter={16} style={{ paddingTop: 10 }}>
                    <Button
                      onClick={() => {
                        router.push(`/userprofile/rider/${id}`)
                      }}
                      style={{ width: '120px', background: '#96989C', borderColor: '#96989C' }}
                      type="primary"
                      size="middle"
                    >
                      ย้อนกลับ
                    </Button>
                  </Row>
                </Card>
              </Form>
            )}
          </Formik>
        </>
      )}
    </MainLayout>
  )
}
