import Card from '@/components/Card';
import CheckBox2 from '@/components/Form/CheckBox2';
import DatePicker from '@/components/Form/DatePicker';
import Input from '@/components/Form/Input';
import InputLink from '@/components/Form/InputLink';
import Select from '@/components/Form/Select';
import TextArea from '@/components/Form/TextArea';
import MainLayout from '@/layout/MainLayout';
import { createBroadcastNew } from '@/services/broadcastNews';
import { uploadImage } from '@/services/cdn';
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Col, Divider, Modal, Radio, Row, Switch, Typography, Upload } from 'antd';
import { Field, Form, Formik } from 'formik';
import { range } from 'lodash';
import moment, { Moment } from "moment";
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactElement, useState } from 'react';
import * as Yup from 'yup';
import noImage from '../../../public/asset/images/no-image-available.svg';

const { Title, Text } = Typography
const { confirm, warning } = Modal

const NotificationsBroadcastNews = (): ReactElement => {
  const router = useRouter()

  const [isActive, setActive] = useState('active')
  const [isShedule, setSchedule] = useState(true)
  const [placeholderLink, setPlaceholderLink] = useState('ลิงค์')
  const [isLink, setIsLink] = useState(true)
  const [imageUrl, setImageUrl] = useState('')
  const [loadingImage, setloadingImage] = useState(false)
  const initialValues = {
    app_type: '',
    news_type_id: '',
    news_type_name: '',
    title: '',
    body: '',
    body_full: '',
    button_name: '',
    schedule_at: '',
    msg_app: true,
    push_noti: true,
    link_type: '',
    link: '',
    imageUrl: ''
  }

  const Schema = Yup.object().shape({
    app_type: Yup.string().trim().required('กรุณาเลือกแอพพลิเคชัน'),
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
  const handleChangeImage = async (info: any) => {
    const isJPNG = info.type === 'image/jpeg'
    const isJPG = info.type === 'image/jpg'
    const isPNG = info.type === 'image/png'
    const fileSize = info.size / 1024 / 1024

    if (!isJPNG && !isJPG && !isPNG) {
      warning({
        title: `กรุณาเลือกรูปภาพ`,
        afterClose() {
          setImageUrl('')
        },
      })
      return null
    }

    if (fileSize > 1) {
      warning({
        title: `กรุณาเลือกรูปภาพขนาดไม่เกิน 1MB`,
        afterClose() { },
      })
      return false
    }

    setloadingImage(true)
    const res = await uploadImage(info)
    setloadingImage(false)
    setImageUrl(res.upload_success.modal_pop_up)
  }

  const handleSubmit = (values: typeof initialValues) => {
    values.imageUrl = imageUrl
    let scheduleAt = values.schedule_at
    if (scheduleAt == "") {
      scheduleAt = String(moment().format());
    }

    confirm({
      title: `ยืนยันการส่ง Broadcast News (${values.title})`,
      icon: <ExclamationCircleOutlined />,
      async onOk() {
        const data = {
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
          status: String("submit"),
          link_type: String(values.link_type),
          link: String(values.link),
          active_status: isActive,
          send_now: isShedule,
          imageUrl: String(values.imageUrl)
        }

        const { result, success } = await createBroadcastNew(data)
        if (success) {
          router.push('/notifications/broadcast_news');
        }
      },
    })
  }

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
            <Breadcrumb.Item>สร้างการแจ้งเตือน </Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col span={8} offset={8} style={{ textAlign: 'end' }}></Col>
      </Row>
      <Card>
        {/* <Title level={5}>Create Broadcast News</Title> */}
        <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={Schema} enableReinitialize={true}>
          {({ values, resetForm, setFieldValue }) => (
            <Form>
              <Row gutter={16}>
                <Col className="gutter-row" span={8} >
                  <Field
                    label={{ text: 'แอพพลิเคชัน' }}
                    name="app_type"
                    component={Select}
                    id="app_type"
                    placeholder="แอพพลิเคชัน"
                    defaultValue=""
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
                    defaultValue=""
                    selectOption={[
                      {
                        name: 'เลือกประเภทแจ้งเตือน',
                        value: '',
                      },
                      {
                        name: 'ประกาศข่าว',
                        value: '1',
                      },
                      {
                        name: 'โปรโมชัน',
                        value: '2',
                      },
                      {
                        name: 'อื่นๆ',
                        value: '3',
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
                    label={{ text: "ชื่อเรื่อง" }}
                    // style={{ color: "red" }}
                    name="title"
                    type="text"
                    component={Input}
                    rows={2}
                    className="form-control round"
                    id="title"
                    placeholder="ชื่อเรื่องรองรับไม่เกิน 50 ตัวอักษร"
                  />
                </Col>
                <Col className="gutter-row" span={8}></Col>
              </Row>
              <Row gutter={24}>
                <Col
                  className="gutter-row"
                  span={24}
                  style={{
                    // borderTop: '2px solid #f2f2f2',
                    paddingTop: '15px',
                    paddingBottom: '15px',
                  }}
                >
                  <label style={{ display: 'block', marginBottom: '10px' }}>อัพโหลดรูปภาพ</label>
                </Col>

                <Upload
                  name="file"
                  onRemove={(e) => {
                    setImageUrl('')
                  }}
                  beforeUpload={handleChangeImage}
                  maxCount={1}
                >
                  <Button
                    // disabled={isEdit ? false : true}
                    style={{ marginLeft: 10 }}
                    icon={<PlusOutlined />}
                  >
                    เพิ่มรูปภาพ
                  </Button>
                </Upload>
                <label style={{ marginLeft: 10, color: 'red' }}>
                  * แนะนำ รูปภาพ ขนาด 1.8:1 328x182px หรือขนาดไม่เกิน 1 MB และไฟล์ jpeg,jpg,png
                </label>

                <Col
                  className="gutter-row"
                  span={24}
                  style={{ marginTop: '35px', marginBottom: '20px' }}
                >
                  <img
                    style={{ width: 'auto', height: 240 }}
                    alt="example"
                    src={imageUrl != '' ? imageUrl : noImage.src}
                  />
                </Col>
              </Row>
              <Row gutter={16}>
                <Col className="gutter-row" span={8} >
                  <Field
                    label={{ text: "รายละเอียดแบบย่อ" }}
                    name="body"
                    type="text"
                    component={TextArea}
                    className="form-control round"
                    id="body"
                    placeholder="รายละเอียดแบบย่อรองรับไม่เกิน 255 ตัวอักษร"
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
                  />
                </Col>
              </Row>
              <Divider />
              <Title level={5}>ตั้งค่าปุ่มรายละเอียด</Title>
              <Row gutter={16}>
                <Col className="gutter-row" span={8} >
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

                      <Radio name="link_type" value={'inapp'} >ลิ้งค์เข้าในแอพพลิเคชัน</Radio>
                      <Radio name="link_type" value={'outapp'} >ลิ้งค์ไปนอกแอพพลิเคชัน</Radio>
                    </Radio.Group>

                    <Field
                      label={{ text: "" }}
                      name="link"
                      type="text"
                      component={InputLink}
                      rows={2}
                      className="form-control round"
                      id="link"
                      placeholder={placeholderLink}
                      disabled={isLink}
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
                      defaultChecked={isShedule == true ? true : false}
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
                    disabled={isShedule}
                    showNow={false}
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
                          defaultChecked={isActive == 'active' ? true : false}
                        />
                      </span>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col className="gutter-row" span={8}>
                  <Button
                    style={{ width: '120px', marginTop: '31px' }}
                    type="primary"
                    size="middle"
                    htmlType="submit"
                  >
                    บันทึก
                  </Button>
                </Col>
              </Row>
            </Form>
          )}
        </Formik>

      </Card >
    </MainLayout >
  )
}


export default NotificationsBroadcastNews