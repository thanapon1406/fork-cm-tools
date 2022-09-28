import DateTimeRangePicker from '@/components/Form/DateTimeRangePicker'
import Select from '@/components/Form/Select'
import ReactQuill from "@/components/QuilNoSSR"
import MainLayout from '@/layout/MainLayout'
import { createMaintenance, getMaintenance } from '@/services/maintenance'
import {
  Breadcrumb,
  Button,
  Card,
  Col, Divider, Modal, notification, Radio,
  Row, Space, Typography
} from 'antd'
import { Field, Form, Formik } from 'formik'
import { omit } from 'lodash'
import moment from 'moment'
import { useRouter } from 'next/router'
import { ReactElement, useEffect, useState } from 'react'
import 'react-quill/dist/quill.snow.css'
import { mapDateTH } from '../../utils/helpers'
const { Title } = Typography
const { warning } = Modal

const BannerModalPopUpCreate = (): ReactElement => {
  const router = useRouter()
  const [editDateTime, setEditDateTime] = useState(true)
  const [editReason, setEditReason] = useState(true)
  let [_isLoading, setIsLoading] = useState(true)
  const [initialValues, setInitialValues] = useState({
    status: 'open',
    reason: 'ขอแจ้งปิดเพื่อปรับปรุงระบบชั่วคราว',
    message: '',
    brand_id: process.env.NEXT_PUBLIC_KITCHENHUB_BRAND_ID,
    start_date: '',
    end_date: '',
    show_date: {
      start: moment().startOf('day').format('YYYY-MM-DDTHH:mm:ss.000Z'),
      end: moment().endOf('day').format('YYYY-MM-DDTHH:mm:ss.000Z'),
    },
  })

  const dateFormat = 'YYYY-MM-DDTHH:mm:ss.000Z'

  const handleSubmit = async (values: typeof initialValues) => {

    values.brand_id = process.env.NEXT_PUBLIC_KITCHENHUB_BRAND_ID
    if (values.show_date.start != '') {
      values.start_date = moment(values.show_date.start).format(dateFormat)
    }
    if (values.show_date.end != '') {
      values.end_date = moment(values.show_date.end).format(dateFormat)
    }

    let value = omit(
      values,
      ['show_date'],
    )

    if (value.status == "open") {
      value.reason = ""
      value.message = ""
    }
    if (value.status == "close" || value.status == "open") {
      value.start_date = moment().startOf('day').format('YYYY-MM-DDTHH:mm:ss.000Z')
      value.end_date = moment().endOf('day').format('YYYY-MM-DDTHH:mm:ss.000Z')
    }

    const { result, success } = await createMaintenance({ data: value })
    if (success) {
      notification.success({
        message: `บันทึกข้อมูลสำเร็จ`,
        description: '',
        duration: 3,
      })
    }
  }


  const getMaintenanceData = async () => {
    setIsLoading(true)
    const { result, success } = await getMaintenance()
    console.log(result);

    if (success) {
      const data = result.data
      let d = {
        ...initialValues,
        status: data.status,
        reason: data.reason ? data.reason : "ขอแจ้งปิดเพื่อปรับปรุงระบบชั่วคราว",
        message: data.message,
        start_date: data.start_date,
        end_date: data.end_date,
        show_date: {
          start: data.start_date,
          end: data.end_date,
        },
      }
      data.status == "period" ? setEditDateTime(false) : setEditDateTime(true)
      data.status == "open" ? setEditReason(true) : setEditReason(false)
      setInitialValues(d)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    getMaintenanceData()
  }, [])

  return (
    <MainLayout>
      {!_isLoading && (
        <>
          <Formik initialValues={initialValues} onSubmit={handleSubmit}>
            {({ values, resetForm, setFieldValue }) => (
              <Form>
                <Row justify="space-around" align="middle">
                  <Col span={8}>
                    <Title level={4}>ปิดปรับปรุงระบบ</Title>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                      <Breadcrumb.Item>รายการปิดปรับปรุงระบบ</Breadcrumb.Item>
                      <Breadcrumb.Item>สร้างการปิดปรับปรุงระบบ</Breadcrumb.Item>
                    </Breadcrumb>
                  </Col>
                  <Col span={8} offset={8} style={{ textAlign: 'end' }}>
                    <Button
                      style={{ width: '120px' }}
                      type="primary"
                      size="middle"
                      htmlType="submit"
                    >
                      บันทึก
                    </Button>
                  </Col>
                </Row>
                <Card>
                  <Title level={5}>สร้างการปิดปรับปรุงระบบ</Title>
                  <Row style={{ marginTop: 20 }}>
                    <Radio.Group
                      name="status"
                      defaultValue={values.status}
                      value={values.status}
                      onChange={(e) => {
                        console.log(e.target.value);
                        setFieldValue('status', e.target.value)
                        e.target.value == "period" ? setEditDateTime(false) : setEditDateTime(true)
                        e.target.value == "open" ? setEditReason(true) : setEditReason(false)
                        if (e.target.value == "period") {
                          const timeFrom = moment(values.start_date).format('HH:mm')
                          const timeTo = moment(values.end_date).format('HH:mm')
                          setFieldValue('message', `<div style="text-align:center;">เพื่อเพิ่มประสิทธิภาพในการให้บริการ<br>ในวันที่ ${mapDateTH(values.start_date)} ช่วงเวลา ${timeFrom} น. - ${mapDateTH(values.start_date)} ถึง ${timeTo} น.</div>`)
                        } else if (e.target.value == "close") {
                          setFieldValue('message', `<div style="text-align:center;">เพื่อเพิ่มประสิทธิภาพในการให้บริการ</div>`)
                        } else if (e.target.value == "open") {
                          setFieldValue('message', ``)
                        }
                      }}
                    >
                      <Space direction="vertical">
                        <Radio name="status" value={"open"}>
                          เปิดการทำงานของระบบทันที
                        </Radio>
                        <Radio name="status" value={"close"}>
                          ปิดการทำงานของระบบทันที
                        </Radio>
                        <Row>
                          <Col className="gutter-row">
                            <Radio name="status" value={"period"}>
                              ตั้งเวลา ปิด/เปิด ระบบ
                            </Radio>
                          </Col>
                          <Col className="gutter-row">
                            <Field
                              name="show_date"
                              onChange={(e: any, date: any) => {
                                const timeFrom = moment(date[0]).format('HH:mm')
                                const timeTo = moment(date[1]).format('HH:mm')

                                setFieldValue('message', `<div style="text-align:center;">เพื่อเพิ่มประสิทธิภาพในการให้บริการ<br>ในวันที่ ${mapDateTH(date[0])} ช่วงเวลา ${timeFrom} น. - ${mapDateTH(date[1])} ถึง ${timeTo} น.</div>`)
                              }}
                              component={DateTimeRangePicker}
                              disabled={editDateTime}
                              id="show_date"
                              placeholder="show_date"
                            />
                          </Col>
                        </Row>
                      </Space>
                    </Radio.Group>
                  </Row>
                  <Divider />
                  <Row>
                    <Col className="gutter-row" span={12}>
                      <Field
                        label={{ text: 'เหตุผลที่ปิดระบบ' }}
                        name="reason"
                        component={Select}
                        onChange={(e: any) => {
                          setFieldValue('reason', e)
                        }}
                        id="reason"
                        disabled={editReason}
                        selectOption={[
                          {
                            name: 'ปิดเพื่อปรับปรุงระบบ',
                            value: "ขอแจ้งปิดเพื่อปรับปรุงระบบชั่วคราว",
                          },
                          {
                            name: 'ปิดเพื่ออัพเดทเวอร์ชั่น',
                            value: "ขอแจ้งปิดเพื่ออัพเดทเวอร์ชัน",
                          },
                          {
                            name: 'ปิดระบบถาวร',
                            value: "ขอแจ้งปิดระบบถาวร",
                          },
                        ]}
                      />
                    </Col>
                    <Col className="gutter-row" span={24}
                      style={{
                        paddingBottom: '80px',
                      }}>
                      <label style={{ display: 'block', marginBottom: '10px' }}>ข้อความที่แสดงบนแอปฯ</label>
                      <ReactQuill
                        readOnly={editReason}
                        theme="snow"
                        value={values.message}
                        onChange={(content, delta, source, editor) => {
                          setFieldValue('message', editor.getHTML())
                        }}
                        style={{ height: '220px' }}
                        modules={{
                          toolbar: [
                            [{ header: [1, 2, false] }],
                            ['bold', 'italic', 'underline', 'strike', 'link'],
                            [{ color: [] }, { background: [] }],
                            [
                              { list: 'ordered' },
                              { list: 'bullet' },
                              { indent: '-1' },
                              { indent: '+1' },
                            ],
                          ],
                        }}
                      />
                    </Col>
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

export default BannerModalPopUpCreate
