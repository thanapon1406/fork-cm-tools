import Card from '@/components/Card';
import CheckBox2 from '@/components/Form/CheckBox2';
import DatePicker from '@/components/Form/DatePicker';
import Input from '@/components/Form/Input';
import InputLink from '@/components/Form/InputLink';
import Select from '@/components/Form/Select';
import TextArea from '@/components/Form/TextArea';
import MainLayout from '@/layout/MainLayout';
import { getBroadcastNew, requestBroadcastNewInterface, updateBroadcastNew } from '@/services/broadcastNews';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Col, Divider, Modal, Radio, Row, Switch, Typography } from 'antd';
import { Field, Form, Formik } from 'formik';
import _, { range } from 'lodash';
import moment, { Moment } from "moment";
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactElement, useEffect, useState } from 'react';
import * as Yup from 'yup';
const { Title, Text } = Typography
const { confirm } = Modal

let initalVaulues = {
  app_type: '',
  news_type_id: '',
  news_type_name: '',
  title: '',
  body: '',
  body_full: '',
  schedule_at: '',
  active_status: '',
  send_now: false,
  msg_app: false,
  push_noti: false,
  status: '',
  button_name: '',
  link_type: '',
  link: ''
}
const EditBroadcastNew = (): ReactElement => {
  const router = useRouter()
  const { id } = router.query
  const [isActive, setActive] = useState('active')
  const [isActiveStatus, setIsActiveStatus] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [isdone, setIsdone] = useState(false)
  const [isSendnow, setIsSendnow] = useState(true)
  const [isShedule, setSchedule] = useState(true)
  const [placeholderLink, setPlaceholderLink] = useState('ลิงค์')
  const [isLink, setIsLink] = useState(true)
  let [initialValues, setInitialValues] = useState(initalVaulues)



  const handleSubmit = (values: typeof initialValues) => {
    let scheduleAt = values.schedule_at

    if (scheduleAt == "") {
      scheduleAt = String(moment().format());
    }

    confirm({
      title: `ยืนยันการส่ง Broadcast News (${values.title})`,
      icon: <ExclamationCircleOutlined />,
      async onOk() {
        const data = {
          id: id,
          app_type: String(values.app_type),
          news_type_id: String(values.news_type_id),
          news_type_name: String(values.news_type_name),
          title: String(values.title),
          body: String(values.body),
          body_full: String(values.body_full),
          button_name: String(values.button_name),
          schedule_at: scheduleAt,
          msg_app: values.msg_app,
          push_noti: values.push_noti,
          // status: String("submit"),
          link_type: String(values.link_type),
          link: String(values.link),
          active_status: isActive,
          send_now: isShedule

        }

        const { result, success } = await updateBroadcastNew(data)
        if (success) {
          router.push('/notifications/broadcast_news');
        }
      },
    })

  }

  const Schema = Yup.object().shape({
    app_type: Yup.string().trim().required('กรุณาเลือกแอพที่ต้องการส่ง'),
    news_type_id: Yup.string().trim().required('กรุณาเลือกประเภทแจ้งเตือน'),
    title: Yup.string().trim().max(50).required('กรุณากรอกชื่อเรื่อง'),
    body: Yup.string().trim().max(255).required('กรุณากรอกรายละเอียดแบบย่อ'),
    body_full: Yup.string().trim().required('กรุณากรอกรายละเอียดแบบเต็ม'),
    schedule_at: Yup.mixed().test('is-42', 'กรุณาตั้งเวลาส่ง', (value: string, form: any) => {
      let customDate = moment().format("YYYY-MM-DD HH:mm");
      let newValue = moment(value).add(-4, "minute").format("YYYY-MM-DD HH:mm")
      if (!isShedule && value === undefined || value === "") {
        if (newValue < customDate) {
          return false
        }
        return false
      }
      return true
    }),
    msg_app: Yup.boolean().when('push_noti', (push_noti: any, schema: any) => {
      return schema.test({
        test: (msg_app: any) => {
          if (msg_app === true || push_noti === true) {
            return true
          }
        },
        message: "กรุณาเลือก จัดเก็บข้อความในแอปพลิชั่น หรือ Push Notification",
      })

    }),
    button_name: Yup.string().when('link_type', (link_type: any, schema: any) => {
      return schema.test({
        test: (button_name: any) => {
          if (link_type == 'inapp' || link_type == 'outapp') {
            if (button_name == undefined) {
              return false
            } else {
              return true
            }
          }
          return true
        },
        message: "กรุณาใส่ชื่อปุ่ม",
      })
    }),
    link: Yup.string().when('link_type', (link_type: any, schema: any) => {
      return schema.test({
        test: (link: any) => {
          if (link_type == 'inapp' || link_type == 'outapp') {
            if (link == undefined) {
              return false
            } else {
              return true
            }
          }
          return true
        },
        message: "กรุณาใส่ลิงค์",
      })
    })
  })

  const disabledDate = (d: Moment) => {
    if (!d) {
      return false;
    }
    let customDate = moment().format("YYYY-MM-DD");
    return d && d < moment(customDate, "YYYY-MM-DD");
  }

  const disabledDateTime = (current: Moment) => {
    const isToday = moment(current).isSame(new Date(), "day");
    let hour = moment(new Date()).hour();
    let minute = moment(new Date()).minute();
    if (isToday) {
      minute += 5;
      if (minute >= 60) {
        minute = minute - 60;
        hour += 1;
        if (hour >= 24) {
          hour = hour - 24;
        }
      }
      return {
        disabledHours: () => range(0, hour),
        disabledMinutes: () => range(0, minute)
      };
    } else {
      return {};
    }
  }

  const handleStatus = (event: any) => {
    const checkStatus = isActive == 'active' ? 'inactive' : 'active'
    setActive(checkStatus)
  }
  const handleSheduleStatus = (event: any) => {
    const checkStatus = !isShedule
    setSchedule(checkStatus)
  }

  const fetchBroadCastNew = async (id: any) => {
    const request: requestBroadcastNewInterface = {
      id: id
    }

    const { result, success } = await getBroadcastNew(id)
    if (success) {
      const { meta, data } = result
      let customDate = moment().format("YYYY-MM-DD HH:mm");

      let objData = {
        app_type: _.get(data, "app_type") ? _.get(data, "app_type") : "",
        news_type_id: _.get(data, "news_type_id") ? _.get(data, "news_type_id") : 0,
        news_type_name: _.get(data, "news_type_name") ? _.get(data, "news_type_name") : "",
        title: _.get(data, "title") ? _.get(data, "title") : "",
        body: _.get(data, "body") ? _.get(data, "body") : "",
        body_full: _.get(data, "body_full") ? _.get(data, "body_full") : "",
        button_name: _.get(data, "button_name") ? _.get(data, "button_name") : "",
        schedule_at: _.get(data, "schedule_at") ? _.get(data, "schedule_at") : "",
        active_status: _.get(data, "active_status") ? _.get(data, "active_status") : "",
        send_now: _.get(data, "send_now") ? _.get(data, "send_now") : false,
        status: _.get(data, "status") ? _.get(data, "status") : "",
        msg_app: _.get(data, "msg_app") ? _.get(data, "msg_app") : false,
        push_noti: _.get(data, "push_noti") ? _.get(data, "push_noti") : false,
        link_type: _.get(data, "link_type") ? _.get(data, "link_type") : "",
        link: _.get(data, "link") ? _.get(data, "link") : ""
      }
      setInitialValues(objData)
      setSchedule(data.send_now)

      setActive(data.active_status)
      if (data.status !== "submit") {
        setIsdone(true)
      }
      if (data.send_now === false) {
        setIsSendnow(true)
      }
      if (moment(data.schedule_at).format("YYYY-MM-DD HH:mm") <= moment(customDate).format("YYYY-MM-DD HH:mm")) {
        setIsdone(true)
      }

    }
  }

  const handleEdit = async (values: any) => {
    let customDate = moment().format("YYYY-MM-DD HH:mm");
    if (moment(initialValues.schedule_at).format("YYYY-MM-DD HH:mm") <= moment(customDate).format("YYYY-MM-DD HH:mm")) {
      setIsActiveStatus(true)
    }
    setIsEdit(!isEdit)


  }

  useEffect(() => {

    if (id) {
      fetchBroadCastNew(id)
    }


  }, [id])
  return (
    <MainLayout>
      <Row justify="space-around" align="middle">
        <Col span={8}>

          <Title level={4}>แจ้งเตือน</Title>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>
              <Link href="/notifications/broadcast_news">
                แจ้งเตือน
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>แก้ไขการแจ้งเตือน </Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col span={8} offset={8} style={{ textAlign: 'end' }}>

          {(isdone) ? <></> : (isEdit) ?
            <>

              <Button style={{ float: 'right', marginRight: "10px" }}
                type="default"
                size="middle"
                htmlType="button"
                onClick={handleEdit}
              // onClick={handleCancelEdit}
              >
                ยกเลิก
              </Button>
            </>
            :
            <Button style={{ float: 'right' }}
              type="primary"
              size="middle"
              htmlType="button"
              onClick={handleEdit}
            >
              แก้ไข
            </Button>
          }
        </Col>
      </Row>
      <Card>
        <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={Schema} enableReinitialize={true}
        // enableReinitialize={true}
        //   initialValues={initialValues}
        //   onSubmit={handleSubmit}
        //   validationSchema={Schema}
        >
          {({ values, resetForm, setFieldValue }) => (
            <Form id="form1">
              <Row gutter={16}>
                <Col className="gutter-row" span={8} >
                  <Field
                    label={{ text: 'แอพที่ต้องการส่ง' }}
                    name="app_type"
                    component={Select}
                    id="app_type"
                    placeholder="แอพที่ต้องการส่ง"
                    defaultValue=""
                    disabled={!isEdit}
                    selectOption={[
                      {
                        name: 'กรุณาเลือก',
                        value: '',
                      },
                      {
                        name: 'ทั้งหมด',
                        value: 'all',
                      },
                      {
                        name: 'Rider',
                        value: 'rider',
                      },
                      {
                        name: 'Consumer',
                        value: 'consumer',
                      },
                      {
                        name: 'Merchant',
                        value: 'merchant',
                      },
                    ]}
                  />
                </Col>
                <Col className="gutter-row" span={5}>
                  <div style={{ marginTop: '28px' }}>
                    <Field
                      label={{ text: "จัดเก็บข้อความในแอปพลิชั่น" }}
                      name="msg_app"
                      component={CheckBox2}
                      className="form-control round"
                      id="msg_app"
                      disabled={!isEdit}
                    />

                  </div>
                </Col>
                <Col className="gutter-row" span={5}>
                  <div style={{ marginTop: '28px' }}>
                    <Field
                      label={{ text: "Push Notification " }}
                      name={`push_noti`}
                      component={CheckBox2}
                      className="form-control round"
                      id="push_noti"
                      disabled={!isEdit}
                    />
                  </div>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col className="gutter-row" span={8} >
                  <Field
                    label={{ text: 'ประเภทแจ้งเตือน' }}
                    name="news_type_id"
                    component={Select}
                    id="news_type_id"
                    placeholder="เลือกประเภทแจ้งเตือน"
                    disabled={!isEdit}
                    selectOption={[
                      {
                        name: 'กรุณาเลือก',
                        value: '',
                      },
                      {
                        name: 'ประกาศข่าว',
                        value: 1,
                      },
                      {
                        name: 'โปรโมชัน',
                        value: 2,
                      },
                      {
                        name: 'อื่นๆ',
                        value: 3,
                      },
                    ]}
                    onChange={(event: any, form: any) => {
                      setFieldValue('news_type_id', event)
                      if (form.children != undefined && form.children != "กรุณาเลือก") {
                        setFieldValue('news_type_name', form.children)
                      }
                    }}
                  />
                </Col>
              </Row>
              <Row gutter={16}>
                <Col className="gutter-row" span={8}>
                  <Field
                    label={{ text: 'ชื่อเรื่อง' }}
                    name="title"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="title"
                    placeholder="ชื่อเรื่องรองรับไม่เกิน 50 ตัวอักษร"
                    disabled={!isEdit}
                  />
                </Col>
                <Col className="gutter-row" span={8}></Col>
              </Row>
              <Row gutter={16}>
                <Col className="gutter-row" span={8} >
                  <Field
                    label={{ text: 'รายละเอียดแบบย่อ' }}
                    name="body"
                    type="text"
                    component={TextArea}
                    className="form-control round"
                    id="body"
                    placeholder="รายละเอียดแบบย่อรองรับไม่เกิน 255 ตัวอักษร"
                    disabled={!isEdit}
                  />
                </Col>
              </Row>
              <Row gutter={16}>
                <Col className="gutter-row" span={8} >
                  <Field
                    label={{ text: "รายละเอียดแบบเต็ม" }}
                    name="body_full"
                    type="text"
                    component={TextArea}
                    className="form-control round"
                    id="body_full"
                    placeholder="รายละเอียดแบบเต็ม"
                    disabled={!isEdit}
                  />
                </Col>
              </Row>
              <Divider />
              <Title level={5}>ตั้งค่าปุ่มรายละเอียด</Title>
              <Row gutter={16}>
                <Col className="gutter-row" span={8} >
                  {/* <Field
                    label={{ text: "ชื่อปุ่ม" }}
                    name="button_name"
                    type="text"
                    component={Input}
                    rows={2}
                    className="form-control round"
                    id="button_name"
                    placeholder="ชื่อในปุ่มที่ต้องการใช้ เช่น ตกลง"
                    disabled={!isEdit}
                  /> */}
                  <Field
                    label={{ text: "ชื่อปุ่ม" }}
                    name="button_name"
                    type="text"
                    component={Input}
                    rows={2}
                    className="form-control round"
                    id="button_name"
                    placeholder="ชื่อในปุ่มที่ต้องการใช้ เช่น ตกลง"
                  />
                </Col>
              </Row>
              <Row gutter={16}>
                <Col className="gutter-row" span={8} >
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Text style={{ marginBottom: "6px" }} >ลิงค์</Text>
                    <Radio.Group name="link_type"
                      // disabled={(isEdit) ? false : true}
                      style={{ marginBottom: "6px" }}
                      defaultValue={values.link_type}
                      value={values.link_type}
                      disabled={!isEdit}
                      onChange={e => {
                        setFieldValue("link_type", e.target.value)
                        if (e.target.value === "inapp") {
                          setPlaceholderLink('khconsumer://host?outletId=368')
                          setIsLink(false)
                        } else if (e.target.value === "outapp") {
                          setPlaceholderLink('https://www.kitchenhub-th.com/')
                          setIsLink(false)
                        } else {
                          setPlaceholderLink('ลิงค์')
                          setIsLink(true)
                        }
                      }}>
                      {/* <Radio value={1}>A</Radio> */}
                      <Radio name="link_type" value={'inapp'} >ลิ้งค์เข้าในแอพพลิเคชัน</Radio>
                      <Radio name="link_type" value={'outapp'} >ลิ้งค์ไปนอกแอพพลิเคชัน</Radio>
                    </Radio.Group>

                    {/* <InputAntd
                      name="link"
                      id="link"
                      className="form-control round"
                      onChange={e => {
                        setFieldValue("link", e?.target?.value)
                      }}
                      addonBefore={<LinkOutlined />} defaultValue={values.link} value={values.link} placeholder={placeholderLink}
                      disabled={!isEdit || isLink}

                    /> */}
                    <Field
                      label={{ text: "" }}
                      name="link"
                      type="text"
                      component={InputLink}
                      rows={2}
                      className="form-control round"
                      id="link"
                      placeholder={placeholderLink}
                      disabled={!isEdit || isLink}
                    />
                  </div>

                </Col>
              </Row>
              <Divider />
              <Title level={5}>ตั้งเวลาส่ง</Title>
              <Row gutter={16}>
                <Col className="gutter-row" span={8}>
                  <div style={{ paddingTop: 2, paddingBottom: 5, display: 'flex', justifyContent: 'space-between' }}>
                    ตั้งเวลาส่ง
                    <Switch
                      onClick={handleSheduleStatus}
                      checkedChildren="ส่งทันที"
                      unCheckedChildren="ตั้งเวลา"
                      checked={isShedule == true ? true : false}
                      disabled={!isEdit || isSendnow}
                    />
                  </div>
                  <Field
                    name="schedule_at"
                    component={DatePicker}
                    showTime={{
                      hideDisabledOptions: true,
                      defaultValue: moment(
                        moment(moment().toDate(), "HH:mm").add(5, "minute"),
                        "HH:mm"
                      )
                    }}
                    disabledDate={disabledDate}
                    disabledTime={disabledDateTime}
                    id="schedule_at"
                    placeholder="ตั้งเวลาส่ง"
                    disabled={isShedule || !isEdit || isSendnow}
                  />
                </Col>
              </Row>
              <Row gutter={16}>
                <Col className="gutter-row" span={16}>
                  สถานะ
                  <Row gutter={16}>
                    <Col className="gutter-row" span={16} style={{ marginTop: "10px" }}>
                      <span >
                        <Switch
                          onClick={handleStatus}
                          checkedChildren="active"
                          unCheckedChildren="inactive"
                          checked={isActive == "active" ? true : false}
                          disabled={!isEdit || isActiveStatus}
                        />
                      </span>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col className="gutter-row" span={8}>
                  {(isdone) ? <></>
                    :
                    <>
                      <Button
                        style={{ width: '120px', marginTop: '31px' }}
                        type="primary"
                        size="middle"
                        htmlType="submit"
                        disabled={!isEdit}
                      >
                        บันทึก
                      </Button>
                      <Button
                        style={{ width: '120px', marginTop: '31px' }}
                        type="default"
                        size="middle"
                        htmlType="button"
                        onClick={handleEdit}
                        disabled={!isEdit}
                      >
                        ยกเลิก
                      </Button>

                    </>
                  }
                </Col>
              </Row>
            </Form>
          )}
        </Formik>

      </Card >
    </MainLayout >
  )
}


export default EditBroadcastNew