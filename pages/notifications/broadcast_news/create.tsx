import Card from '@/components/Card';
import DatePicker from '@/components/Form/DatePicker';
import Input from '@/components/Form/Input';
import Select from '@/components/Form/Select';
import TextArea from '@/components/Form/TextArea';
import MainLayout from '@/layout/MainLayout';
import { createBroadcastNew } from '@/services/broadcastNews';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Col, Modal, Row, Switch, Typography } from 'antd';
import { Field, Form, Formik } from 'formik';
import moment, { Moment } from "moment";
import { useRouter } from 'next/router';
import { ReactElement, useState } from 'react';
import * as Yup from 'yup';

const { Title } = Typography
const { confirm } = Modal

const NotificationsBroadcastNews = (): ReactElement => {
  const router = useRouter()

  const [isActive, setActive] = useState('active')
  const [isShedule, setSchedule] = useState(true)

  const initialValues = {
    app_type: '',
    title: '',
    body: '',
    schedule_at: '',

  }

  const Schema = Yup.object().shape({
    app_type: Yup.string().trim().required('กรุณาเลือกแอพที่ต้องการส่ง'),
    title: Yup.string().trim().required('กรุณากรอกชื่อแคมเปญ'),
    body: Yup.string().trim().required('กรุณากรอกรายละเอียด'),
    schedule_at: Yup.mixed().test('is-42', 'กรุณาเลือกเหตุผล', (value: string, form: any) => {
      if (!isShedule && value === undefined || value === "") {
        return false
      }
      return true
    }),
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
          app_type: String(values.app_type),
          title: String(values.title),
          body: String(values.body),
          schedule_at: scheduleAt,
          status: String("submit"),
          active_status: isActive,
          send_now: isShedule
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

    return d && d < moment().endOf('day');
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
          <Title level={4}>Broadcast News</Title>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Notifications</Breadcrumb.Item>
            <Breadcrumb.Item>Create Broadcast News </Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col span={8} offset={8} style={{ textAlign: 'end' }}></Col>
      </Row>
      <Card>
        {/* <Title level={5}>Create Broadcast News</Title> */}
        <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={Schema}>
          {({ values, resetForm, setFieldValue }) => (
            <Form>
              <Row gutter={16}>
                <Col className="gutter-row" span={8} >
                  <Field
                    label={{ text: 'แอพที่ต้องการส่ง' }}
                    name="app_type"
                    component={Select}
                    id="app_type"
                    placeholder="แอพที่ต้องการส่ง"
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
              </Row>
              <Row gutter={16}>
                <Col className="gutter-row" span={8}>
                  <Field
                    label={{ text: 'ชื่อแคมเปญ' }}
                    name="title"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="title"
                    placeholder="ชื่อแคมเปญ"
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
                    placeholder="รายละเอียด"
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
                      defaultChecked={isShedule == true ? true : false}
                    />
                  </div>
                  <Field
                    name="schedule_at"
                    component={DatePicker}
                    showTime={{ format: 'HH:mm' }}
                    disabledDate={disabledDate}
                    id="schedule_at"
                    placeholder="ตั้งเวลาส่ง"
                    disabled={isShedule}
                  />
                </Col>
              </Row>
              <Row gutter={16}>
                <Col className="gutter-row" span={16}>
                  สถานะแคมเปญ
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