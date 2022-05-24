
import DateTimeRangePicker from '@/components/Form/DateTimeRangePicker';
import Input from '@/components/Form/Input';
import Select from '@/components/Form/Select';
import TextArea from '@/components/Form/TextArea';
import MainLayout from '@/layout/MainLayout';
import { uploadImage } from '@/services/cdn';
import { createModalPopUp } from '@/services/modalPopUp';
import { LoadingOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Card, Col, Modal, Radio, Row, Space, Switch, Typography, Upload } from 'antd';
import { Field, Form, Formik } from 'formik';
import { omit } from 'lodash';
import moment from 'moment';
import { useRouter } from 'next/router';
import { ReactElement, useState } from 'react';
import { SketchPicker } from 'react-color';
import * as Yup from 'yup';
import noImage from '../../../public/asset/images/no-image-available.svg';

const { Title } = Typography
const { warning } = Modal

const BannerModalPopUpCreate = (): ReactElement => {
  const router = useRouter()

  const [isActive, setActive] = useState('active')
  const [loadingImage, setloadingImage] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [typeModal, setTypeModal] = useState(1)

  const handleSetTypeModal = (event: any) => {
    setColorButton1("#ffffff")
    setTextColorButton1("#000000")
    setColorButton2("#ffffff")
    setTextColorButton2("#000000")
    setTypeModal(event)
  }

  const [textColorButton1, setTextColorButton1] = useState("#000000");
  const [colorButton1, setColorButton1] = useState("#ffffff");

  const handleTextColorButton1 = (event: any) => {
    setTextColorButton1(event.hex)
  }
  const handleColorButton1 = (event: any) => {
    setColorButton1(event.hex)
  }

  const [textColorButton2, setTextColorButton2] = useState("#000000");
  const [colorButton2, setColorButton2] = useState("#ffffff");
  const handleTextColorButton2 = (event: any) => {
    setTextColorButton2(event.hex)
  }
  const handleColorButton2 = (event: any) => {
    setColorButton2(event.hex)
  }

  const uploadButton = (
    <div>
      {loadingImage ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );


  const button1 = {
    text: '',
    text_color: '',
    background_color: '',
    action_url: '',
    action_type: ''
  }

  const button2 = {
    text: '',
    text_color: '',
    background_color: '',
    action_url: '',
    action_type: ''
  }

  const initialValues = {
    name: '',
    status: '',
    type: 1,
    image: '',
    image_action_url: '',
    image_action_type: '',
    start_date: '',
    end_date: '',
    priority: 0,
    app_id: '',
    content: {
      title: "",
      text: ""
    },
    show_date: {
      start: moment().startOf('day').format('YYYY-MM-DDTHH:mm:ss.000Z'),
      end: moment().endOf('day').format('YYYY-MM-DDTHH:mm:ss.000Z'),
    },
    buttons: [button1, button2],
    textButton1: '',
    actionButton1: '',
    actionType1: '',
    textButton2: '',
    actionButton2: '',
    actionType2: '',
  }


  const Schema = Yup.object().shape({
    app_id: Yup.string().trim().required('กรุณาเลือกแอพที่ต้องการส่ง'),
    name: Yup.string().trim().required('กรุณากรอกชื่อ modal pop up'),
    textButton1: Yup.string().when("type", {
      is: (v: number) => v > 2,
      then: Yup.string().required("กรุณากรอกคำบนปุ่ม"),
    }),
    textButton2: Yup.string().when("type", {
      is: (v: number) => v > 3,
      then: Yup.string().required("กรุณากรอกคำบนปุ่ม"),
    })
  })

  const dateFormat = 'YYYY-MM-DDTHH:mm:ss.000Z'

  const handleSubmit = async (values: typeof initialValues) => {
    if (imageUrl == '') {
      warning({
        title: `กรุณาเลือกรูปภาพ`,
        afterClose() {
        }
      })
      return null
    }

    values.image = imageUrl
    values.status = isActive

    if (values.show_date.start != '') {
      values.start_date = moment(values.show_date.start).format(dateFormat)
    }
    if (values.show_date.end != '') {
      values.end_date = moment(values.show_date.end).format(dateFormat)
    }

    if (typeModal == 3) {
      button1.text = values.textButton1
      button1.text_color = textColorButton1
      button1.background_color = colorButton1
      button1.action_url = values.actionButton1
      button1.action_type = values.actionType1
      values.buttons[0] = button1
    }
    if (typeModal == 4) {
      button1.text = values.textButton1
      button1.action_type = values.actionType1
      button1.text_color = textColorButton1
      button1.background_color = colorButton1
      button1.action_url = values.actionButton1
      button2.text = values.textButton2
      button2.text_color = textColorButton2
      button2.background_color = colorButton2
      button2.action_url = values.actionButton2
      button2.action_type = values.actionType2
      values.buttons[0] = button1
      values.buttons[1] = button2
    }
    const value = omit(values, ['show_date'], ['textButton1'], ['actionButton1'], ['actionType1'], ['textButton2'], ['actionButton2'], ['actionType2']);
    console.log(value)
    const { result, success } = await createModalPopUp(value)
    if (success) {
      router.push('/content/modal-pop-up');
    }
  }

  const handleStatus = (event: any) => {
    const checkStatus = isActive == 'active' ? 'inactive' : 'active'
    setActive(checkStatus)
  }

  const handleChangeImage = async (info: any) => {
    const isJPNG = info.type === 'image/jpeg';
    const isJPG = info.type === 'image/jpg';
    const isPNG = info.type === 'image/png';

    if (!isJPNG && !isJPG && !isPNG) {
      warning({
        title: `ไฟล์รูปภาพที่เลือกไม่ถูกต้อง`,
        afterClose() {
        }
      })
      return null
    }

    setloadingImage(true)
    console.log(handleChangeImage, info)
    const res = await uploadImage(info)
    setloadingImage(false)
    setImageUrl(res.upload_success.modal_pop_up)
  }

  const renderTitle = (type: number) => {

    if (typeModal > 2) {
      return (
        <>
          <Row gutter={16} style={{ marginTop: 20 }}>
            <Col className="gutter-row" span={8}>
              <Field
                label={{ text: "ชื่อเรื่อง" }}
                name="content.title"
                type="text"
                component={Input}
                rows={2}
                className="form-control round"
                id="content.title"
                validate={(value: string) => {
                  if (type > 2) {
                    if (value == "") {
                      return "กรุณากรอกชื่อเรื่อง"
                    }
                  }
                }}
              />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col className="gutter-row" span={8} >
              <Field
                label={{ text: "รายละเอียด" }}
                name="content.text"
                type="text"
                component={TextArea}
                className="form-control round"
                id="content.text"
              />
            </Col>
          </Row>
        </>
      )
    }
  }

  const renderButtons = (values: any) => {
    if (typeModal == 3) {
      return (
        <>
          <Row gutter={24} style={{ marginTop: 20 }}>
            <Col className="gutter-row" span={8}>
              <Field
                label={{ text: "คำบนปุ่ม" }}
                name="textButton1"
                type="text"
                component={Input}
                rows={2}
                className="form-control round"
                id="textButton1"
              />
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col className="gutter-row" span={12}>
              <Field
                label={{ text: "Action ของปุ่ม URL " }}
                name="actionButton1"
                type="text"
                component={Input}
                rows={2}
                className="form-control round"
                id="actionButton1"
                validate={(value: string) => {
                  if (values.actionType1 != '') {
                    if (value == "") {
                      return "กรุณากรอก Action ของปุ่ม 1"
                    }
                  }
                }}
              />
              <label style={{ marginBottom: 10, color: 'red' }}>{values.actionType1 == "external_url" ? "* ตัวอย่าง https://www.google.com/" : values.actionType1 == "internal_url" ? "* ตัวอย่าง khconsumer://host?outletId=xxx&productId=xxxx&app=consumer" : ""}</label>
            </Col>
            <Col className="gutter-row" span={12} >
              <Field
                label={{ text: 'Action type ของปุ่ม' }}
                name="actionType1"
                component={Select}
                id="actionType1"
                defaultValue=""
                selectOption={[
                  {
                    name: 'ไม่ระบุ',
                    value: '',
                  },
                  {
                    name: 'external url',
                    value: 'external_url',
                  },
                  {
                    name: 'internal url',
                    value: 'internal_url',
                  },
                ]}
              />
            </Col>
          </Row>
          <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
            <Col className="gutter-row" span={8}>
              <label>สีปุ่ม</label>
              <SketchPicker color={colorButton1} onChangeComplete={handleColorButton1} />
            </Col>
            <Col className="gutter-row" span={8}>
              <label>สีคำของปุ่ม</label>
              <SketchPicker color={textColorButton1} onChangeComplete={handleTextColorButton1} />
            </Col>
          </Row>
        </>
      )
    }
    if (typeModal == 4) {
      return (
        <>
          <Row gutter={16} style={{ marginTop: 20 }}>
            <Col className="gutter-row" span={8}>
              <Field
                label={{ text: "คำบนปุ่ม 1" }}
                name="textButton1"
                type="text"
                component={Input}
                rows={2}
                className="form-control round"
                id="textButton1"
              />
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col className="gutter-row" span={12}>
              <Field
                label={{ text: "Action ของปุ่ม 1 URL" }}
                name="actionButton1"
                type="text"
                component={Input}
                rows={2}
                className="form-control round"
                id="actionButton1"
                validate={(value: string) => {
                  if (values.actionType1 != '') {
                    if (value == "") {
                      return "กรุณากรอก Action ของปุ่ม 1"
                    }
                  }
                }}
              />
              <label style={{ marginBottom: 10, color: 'red' }}>{values.actionType1 == "external_url" ? "* ตัวอย่าง https://www.google.com/" : values.actionType1 == "internal_url" ? "* ตัวอย่าง khconsumer://host?outletId=xxx&productId=xxxx&app=consumer" : ""}</label>
            </Col>
            <Col className="gutter-row" span={12} >
              <Field
                label={{ text: 'Action type ของปุ่ม 1' }}
                name="actionType1"
                component={Select}
                id="actionType1"
                defaultValue=""
                selectOption={[
                  {
                    name: 'ไม่ระบุ',
                    value: '',
                  },
                  {
                    name: 'external url',
                    value: 'external_url',
                  },
                  {
                    name: 'internal url',
                    value: 'internal_url',
                  },
                ]}
              />
            </Col>
          </Row>
          <Row gutter={16} style={{ marginTop: 20 }}>
            <Col className="gutter-row" span={8}>
              <label>สีปุ่ม 1</label>
              <SketchPicker color={colorButton1} onChangeComplete={handleColorButton1} />
            </Col>
            <Col className="gutter-row" span={8}>
              <label>สีคำของปุ่ม 1</label>
              <SketchPicker color={textColorButton1} onChangeComplete={handleTextColorButton1} />
            </Col>
          </Row>
          <Row gutter={24} style={{ marginTop: 20 }}>
            <Col className="gutter-row" span={8}>
              <Field
                label={{ text: "คำบนปุ่ม 2" }}
                name="textButton2"
                type="text"
                component={Input}
                rows={2}
                className="form-control round"
                id="textButton2"
              />
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col className="gutter-row" span={12}>
              <Field
                label={{ text: "Action ของปุ่ม 2 URL" }}
                name="actionButton2"
                type="text"
                component={Input}
                rows={2}
                className="form-control round"
                id="actionButton2"
                validate={(value: string) => {
                  if (values.actionType2 != '') {
                    if (value == "") {
                      return "กรุณากรอก Action ของปุ่ม 2"
                    }
                  }
                }}
              />
              <label style={{ marginBottom: 10, color: 'red' }}>{values.actionType2 == "external_url" ? "* ตัวอย่าง https://www.google.com/" : values.actionType2 == "internal_url" ? "* ตัวอย่าง khconsumer://host?outletId=xxx&productId=xxxx&app=consumer" : ""}</label>
            </Col>
            <Col className="gutter-row" span={12} >
              <Field
                label={{ text: 'Action type ของปุ่ม 2' }}
                name="actionType2"
                component={Select}
                id="actionType2"
                defaultValue=""
                selectOption={[
                  {
                    name: 'ไม่ระบุ',
                    value: '',
                  },
                  {
                    name: 'external url',
                    value: 'external_url',
                  },
                  {
                    name: 'internal url',
                    value: 'internal_url',
                  },
                ]}
              />
            </Col>
          </Row>
          <Row gutter={16} style={{ marginTop: 20 }}>
            <Col className="gutter-row" span={8}>
              <label>สีปุ่ม 2</label>
              <SketchPicker color={colorButton2} onChangeComplete={handleColorButton2} />
            </Col>
            <Col className="gutter-row" span={8}>
              <label>สีคำของปุ่ม 2</label>
              <SketchPicker color={textColorButton2} onChangeComplete={handleTextColorButton2} />
            </Col>
          </Row>
        </>
      )
    }
  }

  return (
    <MainLayout>
      <Row justify="space-around" align="middle">
        <Col span={8}>
          <Title level={4}>Modal Pop Up</Title>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Content</Breadcrumb.Item>
            <Breadcrumb.Item>Modal Pop Up Create</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col span={8} offset={8} style={{ textAlign: 'end' }}></Col>
      </Row>
      <Card>
        <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={Schema}>
          {({ values, resetForm, setFieldValue }) => (
            <Form>
              <Row gutter={24}>
                <Col className="gutter-row" span={8}>
                  <Field
                    label={{ text: "ชื่อ modal pop up" }}
                    name="name"
                    type="text"
                    component={Input}
                    rows={2}
                    className="form-control round"
                    id="name"
                  />
                </Col>
                <Col className="gutter-row" span={8} >
                  <Field
                    label={{ text: 'แอพที่ต้องการส่ง' }}
                    name="app_id"
                    component={Select}
                    id="app_id"
                    placeholder="แอพที่ต้องการส่ง"
                    defaultValue=""
                    selectOption={[
                      {
                        name: 'Consumer',
                        value: 1,
                      },
                      {
                        name: 'Merchant',
                        value: 2,
                      },
                      {
                        name: 'Rider',
                        value: 3,
                      },
                    ]}
                  />
                </Col>
              </Row>
              <Row gutter={24}>
                <label>รูปภาพ : </label>
                <Upload
                  name="file"
                  onRemove={e => { setImageUrl('') }}
                  beforeUpload={handleChangeImage}
                >
                  <Button style={{ marginLeft: 10 }} icon={<UploadOutlined />}>เลือกรูป</Button>
                </Upload>
                {values.type < 3 ? (
                  <label style={{ marginLeft: 10, color: 'red' }}>* หมายเหตุ แนะนำ รูปภาพ ขนาด 9:16 1080x1920px และไฟล์ jpeg,jpg,png</label>
                ) : (
                  <label style={{ marginLeft: 10, color: 'red' }}>* หมายเหตุ  แนะนำ รูปภาพ ขนาด 1:1 1080x1080px และไฟล์ jpeg,jpg,png</label>
                )}
              </Row>
              <Row gutter={16} style={{ marginTop: 20 }}>
                <Col className="gutter-row" span={24} >
                  <Radio.Group name="type"
                    defaultValue={values.type}
                    value={values.type}
                    onChange={e => {
                      setFieldValue("type", e.target.value)
                      handleSetTypeModal(e.target.value)
                    }}>
                    <Space direction='vertical'>
                      <Row gutter={24}>
                        <Col className="gutter-row" span={6}>
                          <Radio name="type" value={1}>
                            <Card
                              hoverable
                              style={{ width: 240, height: 240, borderRadius: '50%' }}
                              cover={<img style={{ width: 240, height: 240, borderRadius: '50%' }} alt="example" src={imageUrl != '' ? imageUrl : noImage.src} />}
                            >
                            </Card>
                          </Radio>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Radio name="type" value={2}>
                            <Card
                              hoverable
                              style={{ width: 240, height: 240 }}
                              cover={<img style={{ width: 240, height: 240 }} alt="example" src={imageUrl != '' ? imageUrl : noImage.src} />}
                            >
                            </Card>
                          </Radio>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Radio name="type" value={3}>
                            <Card
                              hoverable
                              style={{ width: 240 }}
                              cover={<img alt="example" src={imageUrl != '' ? imageUrl : noImage.src} />}
                            >
                              <p>{values.content.title == "" ? "ชื่อเรื่อง" : values.content.title}</p>
                              <p>{values.content.text == "" ? "รายละเอียด" : values.content.text}</p>
                              <Button style={{ backgroundColor: colorButton1, color: textColorButton1 }}>{values.textButton1 == "" ? "ปุ่ม 1" : values.textButton1}</Button>
                            </Card>
                          </Radio>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Radio name="type" value={4}>
                            <Card
                              hoverable
                              style={{ width: 240 }}
                              cover={<img alt="example" src={imageUrl != '' ? imageUrl : noImage.src} />}
                            >
                              <p>{values.content.title == "" ? "ชื่อเรื่อง" : values.content.title}</p>
                              <p>{values.content.text == "" ? "รายละเอียด" : values.content.text}</p>
                              <div style={{ display: 'flex', flexDirection: "row", justifyContent: "space-between" }}>
                                <Button style={{ backgroundColor: colorButton1, color: textColorButton1 }}>{values.textButton1 == "" ? "ปุ่ม 1" : values.textButton1}</Button>
                                <Button style={{ backgroundColor: colorButton2, color: textColorButton2 }}>{values.textButton2 == "" ? "ปุ่ม 2" : values.textButton2}</Button>
                              </div>
                            </Card>
                          </Radio>
                        </Col>
                      </Row>
                    </Space>
                  </Radio.Group>
                </Col>
              </Row>
              <Row gutter={16} style={{ marginTop: 20 }}>
                <Col className="gutter-row" span={8}>
                  <Field
                    label={{ text: "image action url" }}
                    name="image_action_url"
                    type="text"
                    component={Input}
                    rows={2}
                    className="form-control round"
                    id="image_action_url"
                    validate={(value: string) => {
                      if (values.image_action_type != '') {
                        if (value == "") {
                          return "กรุณากรอก image action url"
                        }
                      }
                    }}
                  />
                </Col>
                <Col className="gutter-row" span={8} >
                  <Field
                    label={{ text: 'image action type' }}
                    name="image_action_type"
                    component={Select}
                    id="image_action_type"
                    defaultValue=""
                    selectOption={[
                      {
                        name: 'ไม่ระบุ',
                        value: '',
                      },
                      {
                        name: 'external url',
                        value: 'external_url',
                      },
                      {
                        name: 'internal url',
                        value: 'internal_url',
                      },
                    ]}
                  />
                </Col>
              </Row>
              {renderTitle(values.type)}
              {renderButtons(values)}
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
              <Row gutter={16} style={{ marginTop: 20 }}>
                <Col className="gutter-row" span={8}>
                  <Field
                    label={{ text: "priority" }}
                    name="priority"
                    type="number"
                    component={Input}
                    rows={2}
                    className="form-control round"
                    id="priority"
                  />
                </Col>
                <Col className="gutter-row" span={8}>
                  <Field
                    label={{ text: 'วันเวลาแสดง Modal Popup' }}
                    name="show_date"
                    component={DateTimeRangePicker}
                    id="show_date"
                    placeholder="show_date"
                  />
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


export default BannerModalPopUpCreate