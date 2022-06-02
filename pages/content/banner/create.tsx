import Card from '@/components/Card';
import DateTimeRangePicker from '@/components/Form/DateTimeRangePicker';
import Input from '@/components/Form/Input';
import MainLayout from '@/layout/MainLayout';
import { createBanner } from '@/services/banner';
import { uploadImage } from '@/services/cdn';
import { LinkOutlined, PlusOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Col, Input as AntdInput, Modal, Radio, Row, Switch, Typography, Upload } from 'antd';
import { Field, Form, Formik } from 'formik';
import { omit } from 'lodash';
import moment from 'moment';
import { useRouter } from 'next/router';
import { ReactElement, useState } from 'react';
import * as Yup from 'yup';
import noImage from '../../../public/asset/images/no-image-available.svg';

const { Title } = Typography
const { warning } = Modal

interface Props { }

interface FormInterface {
  name: string
  status: string
  type: string
  action: string
  action_url: string
  image_url: string
  start_date?: string | null | undefined
  end_date?: string | null | undefined
  priority?: number | null | undefined
  show_date: {
    start: any
    end: any
  },
}

const initialValues: FormInterface = {
  name: '',
  status: '',
  type: 'type',
  action: '',
  action_url: '',
  image_url: '',
  start_date: '',
  end_date: '',
  priority: 0,
  show_date: {
    start: moment().startOf('day').format('YYYY-MM-DDTHH:mm:ss.000Z'),
    end: moment().endOf('day').format('YYYY-MM-DDTHH:mm:ss.000Z'),
  },
}

const Schema = Yup.object().shape({
  name: Yup.string().trim().required('กรุณากรอกชื่อ Banner')
})

export default function BannerCreate({ }: Props): ReactElement {
  const router = useRouter()
  const [isActive, setActive] = useState('active')
  const [loadingImage, setloadingImage] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [isAction, setAction] = useState('')
  const [exampleLink, setExampleLink] = useState('')

  const handleStatus = (event: any) => {
    const checkStatus = isActive == 'active' ? 'inactive' : 'active'
    setActive(checkStatus)
  }

  const handleAction = (event: any) => {
    setAction(event.target.value)
    
    if(event.target.value == 'external_url'){
      setExampleLink('* ตัวอย่าง https://www.google.com/')
    }else if(event.target.value == 'internal_url'){
      setExampleLink('* ตัวอย่าง khconsumer://host?outletId=xxx&productId=xxxx&app=consumer')
    }
  }

  const handleChangeImage = async (info: any) => {
    const fileSize = (info.size / 1024) / 1024
    const isJPNG = info.type === 'image/jpeg';
    const isJPG = info.type === 'image/jpg';
    const isPNG = info.type === 'image/png';

    if (!isJPNG && !isJPG && !isPNG) {
      warning({
        title: `กรุณาเลือกรูปภาพ`,
        afterClose() {
          setImageUrl('')
        }
      })
      return false
    }

    if (fileSize > 1) {
      warning({
        title: `กรุณาเลือกรูปภาพขนาดไม่เกิน 1MB`,
        afterClose() {
        }
      })
      return false
    }

    setloadingImage(true)
    const res = await uploadImage(info)
    setloadingImage(false)
    setImageUrl(res.upload_success.modal_pop_up)
  }

  const dateFormat = 'YYYY-MM-DDTHH:mm:ss.000Z'

  const handleSubmit = async (values: typeof initialValues) => {
    if (imageUrl == '') {
      warning({
        title: `กรุณาเลือกรูปภาพ`,
        afterClose() {
        }
      })
      return false
    }
    values.image_url = imageUrl
    values.status = isActive

    if (values.show_date.start != '') {
      values.start_date = moment(values.show_date.start).format(dateFormat)
    } else {
      values.start_date = null
    }
    if (values.show_date.end != '') {
      values.end_date = moment(values.show_date.end).format(dateFormat)
    } else {
      values.end_date = null
    }

    if (values.action_url == '') {
      values.action = ''
    } else {
      if (isAction == '') {
        warning({
          title: `กรุณาเลือก Action Link`,
          afterClose() {
          }
        })
        return false
      }
      values.action = isAction
    }

    const dataCreate = { data: omit(values, ['show_date']) }
    const { success } = await createBanner(dataCreate)

    if (success) {
      router.push('/content/banner');
    }
  }

  return (
    <MainLayout>
      <Row justify="space-around" align="middle">
        <Col span={8}>
          <Title level={4}>Banner</Title>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Content</Breadcrumb.Item>
            <Breadcrumb.Item>Banner Create</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col span={8} offset={8} style={{ textAlign: 'end' }}></Col>
      </Row>

      <Card>
        <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={Schema}>
          {({ values, resetForm, setFieldValue }) => (
            <Form>
              <Row gutter={24}>
                <Col className="gutter-row" span={24}>
                  <Field
                    label={{ text: "ชื่อ Banner" }}
                    name="name"
                    type="text"
                    component={Input}
                    rows={2}
                    className="form-control round"
                    id="name" />
                </Col>

                <Col className="gutter-row" span={24}
                  style={{
                    borderTop: "2px solid #f2f2f2",
                    paddingTop: "15px",
                    paddingBottom: "15px"
                  }}>
                  <b>สถานะ</b>
                  <Row gutter={24}>
                    <Col className="gutter-row" span={24} style={{ marginTop: "10px" }}>
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

                <Col className="gutter-row" span={24}
                  style={{
                    borderTop: "2px solid #f2f2f2",
                    paddingTop: "15px",
                    paddingBottom: "15px"
                  }}>
                  <Row gutter={24}>
                    <Col span={24}>
                      <b>ลิงค์</b><span style={{ color: "#9999" }}> (ไม่บังคับ)</span>
                    </Col>
                  </Row>

                  <Row gutter={24} style={{ marginTop: "5px" }}>
                    <Col span={24}>
                      <Radio.Group onChange={handleAction} value={isAction}>
                        <Radio value="external_url">External</Radio>
                        <Radio value="internal_url">Internal</Radio>
                      </Radio.Group>
                    </Col>
                  </Row>

                  <Row gutter={24} style={{ marginTop: "10px" }}>
                    <Col span={24}>
                      <AntdInput 
                        placeholder="ลิงค์" 
                        name="action_url"
                        id="action_url"
                        type="text"
                        onChange={(e: any) => {
                          setFieldValue('action_url', e?.target?.value)
                        }}
                        prefix={<LinkOutlined style={{ fontSize: "20px", color: "#4dd2ff" }} />} 
                      />
                      <span style={{ fontSize: "12px", color: "red" }}>{ exampleLink }</span>
                    </Col>
                  </Row>
                </Col>

                <Col className="gutter-row" span={12}
                  style={{
                    borderTop: "2px solid #f2f2f2",
                    paddingTop: "15px",
                    paddingBottom: "15px"
                  }}>
                  <Field
                    label={{ text: "Priority" }}
                    name="priority"
                    type="number"
                    component={Input}
                    rows={2}
                    className="form-control round"
                    id="priority" />
                </Col>

                <Col className="gutter-row" span={12}
                  style={{
                    borderTop: "2px solid #f2f2f2",
                    paddingTop: "15px",
                    paddingBottom: "15px"
                  }}>
                  <Field
                    label={{ text: 'วันเวลาแสดง Banner' }}
                    name="show_date"
                    component={DateTimeRangePicker}
                    id="show_date"
                    placeholder="show_date"
                  />
                </Col>
              </Row>

              <Row gutter={24}>
                <Col className="gutter-row" span={24}
                  style={{
                    borderTop: "2px solid #f2f2f2",
                    paddingTop: "15px",
                    paddingBottom: "15px"
                  }}>
                  <label style={{ display: "block", marginBottom: "10px" }}>อัพโหลดรูปภาพ</label>
                </Col>

                <Upload
                  name="file"
                  id="file"
                  onRemove={e => { setImageUrl('') }}
                  beforeUpload={handleChangeImage}
                  maxCount={1}
                >

                  <Button style={{ marginLeft: 10 }} icon={<PlusOutlined />}>เพิ่มรูปภาพ</Button>
                </Upload>
                <label style={{ marginLeft: 10, color: 'red' }}>* หมายเหตุ ควรเลือกรูปภาพขนาดไม่เกิน 1MB</label>

                <Col className="gutter-row" span={24} style={{ marginTop: "35px", marginBottom: "20px", textAlign: "center" }}>
                  <img style={{ width: 'auto', height: 240 }} alt="example" src={imageUrl != '' ? imageUrl : noImage.src} />
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
      </Card>
    </MainLayout>
  )
}

