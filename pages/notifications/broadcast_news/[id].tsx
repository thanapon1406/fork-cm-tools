import Card from '@/components/Card';
import DatePicker from '@/components/Form/DatePicker';
import Input from '@/components/Form/Input';
import Select from '@/components/Form/Select';
import TextArea from '@/components/Form/TextArea';
import MainLayout from '@/layout/MainLayout';
import { getBroadcastNew, requestBroadcastNewInterface, updateBroadcastNew } from '@/services/broadcastNews';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Col, Modal, Row, Switch, Typography } from 'antd';
import { Field, Form, Formik } from 'formik';
import { range } from 'lodash';
import moment, { Moment } from "moment";
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactElement, useEffect, useState } from 'react';
import * as Yup from 'yup';
const { Title } = Typography
const { confirm } = Modal


const EditBroadcastNew = (): ReactElement => {
  const router = useRouter()
  const { id } = router.query
  const [isActive, setActive] = useState('active')
  const [isActiveStatus, setIsActiveStatus] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [isdone, setIsdone] = useState(false)
  const [isSendnow, setIsSendnow] = useState(true)
  const [isShedule, setSchedule] = useState(true)
  let [initialValues, setInitialValues] = useState({
    app_type: '',
    title: '',
    body: '',
    schedule_at: '',
    active_status: '',
    send_now: false,
    status: '',
  })



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
          title: String(values.title),
          body: String(values.body),
          schedule_at: scheduleAt,
          // status: String("submit"),
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
    title: Yup.string().trim().max(50).required('กรุณากรอกชื่อเรื่อง'),
    body: Yup.string().trim().max(255).required('กรุณากรอกรายละเอียด'),
    schedule_at: Yup.mixed().test('is-42', 'กรุณาเลือกเหตุผล', (value: string, form: any) => {
      if (!isShedule && value === undefined || value === "") {
        return false
      }
      return true
    }),
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
      setInitialValues(data)
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

          <Title level={4}>Broadcast News</Title>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>
              <Link href="/notifications/broadcast_news">
                Notifications
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>Edit Broadcast News </Breadcrumb.Item>
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
        {/* <Title level={5}>Create Broadcast News</Title> */}
        <Formik enableReinitialize={true}
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={Schema}
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
                    label={{ text: 'รายละเอียด' }}
                    name="body"
                    type="text"
                    component={TextArea}
                    className="form-control round"
                    id="body"
                    placeholder="รายละเอียดรองรับไม่เกิน 255 ตัวอักษร"
                    disabled={!isEdit}
                  />
                </Col>
              </Row>
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
                  {/* <Field
                    name="schedule_at"
                    component={DatePicker}
                    showTime={{ format: 'HH:mm' }}
                    disabledDate={disabledDate}
                    id="schedule_at"
                    placeholder="ตั้งเวลาส่ง"
                    disabled={isShedule || !isEdit || isSendnow}
                  // disabled={!isEdit}
                  /> */}
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
                        แก้ไข
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