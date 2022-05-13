
import Button1 from '@/components/Button'
import DateTimeRangePicker from '@/components/Form/DateTimeRangePicker'
import Input from '@/components/Form/Input'
import Select from '@/components/Form/Select'
import TextArea from '@/components/Form/TextArea'
import MainLayout from '@/layout/MainLayout'
import { uploadImage } from '@/services/cdn'
import { getModalPopUp, updateModalPopUp } from '@/services/modalPopUp'
import { UploadOutlined } from '@ant-design/icons'
import { Breadcrumb, Button, Card, Col, Modal, notification, Radio, Row, Space, Switch, Typography, Upload } from 'antd'
import { Field, Form, Formik } from 'formik'
import { omit } from 'lodash'
import moment from 'moment'
import { useRouter } from 'next/router'
import { default as React, ReactElement, useEffect, useState } from 'react'
import { SketchPicker } from 'react-color'
import * as Yup from 'yup'
import noImage from '../../../public/asset/images/no-image-available.svg'
const { Title } = Typography
interface Props { }
const { warning } = Modal


export default function View({ }: Props): ReactElement {
  // const [brandObject, setBrandState] = useRecoilState(brandState)
  let [_isLoading, setIsLoading] = useState(true)
  const [isEdit, setIsEdit] = useState(false)
  const router = useRouter()
  const [isActive, setActive] = useState('')
  const id = router.query.id as string

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

  const dateFormat = 'YYYY-MM-DDTHH:mm:ss.000Z'


  let [initialValues, setInitialValues] = useState({
    id: 0,
    app_id: '',
    image: '',
    image_action_url: '',
    image_action_type: '',
    name: '',
    priority: '',
    status: '',
    type: '',
    start_date: '',
    end_date: '',
    content: {
      text: '',
      title: ''
    },
    show_date: {
      start: '',
      end: ''
    },
    buttons: [],
    textButton1: '',
    actionButton1: '',
    actionType1: '',
    textButton2: '',
    actionButton2: '',
    actionType2: ''
  })

  useEffect(() => {
    console.log(`useEffect`, id)
    if (id) {
      getModalPopup()
    }
  }, [id])

  const getModalPopup = async () => {
    setIsLoading(true)
    const { result, success } = await getModalPopUp(id)
    if (success) {
      const data = result.data
      setActive(data.status)
      setImageUrl(data.image)
      setTypeModal(data.type)
      let d = {
        ...initialValues,
        id: data.id,
        app_id: data.app_id,
        image: data.image,
        image_action_url: data.image_action_url,
        image_action_type: data.image_action_type,
        name: data.name,
        priority: data.priority,
        type: data.type,
        start_date: data.start_date,
        end_date: data.end_date,
        show_date: {
          start: data.start_date,
          end: data.end_date
        },
        content: {
          text: data.content.text,
          title: data.content.title
        }
      }

      if (data.type > 2) {
        d.textButton1 = data.buttons[0].text
        d.actionButton1 = data.buttons[0].action_url
        d.actionType1 = data.buttons[0].action_type
        setColorButton1(data.buttons[0].background_color)
        setTextColorButton1(data.buttons[0].text_color)
      }
      if (data.type > 3) {
        d.textButton2 = data.buttons[1].text
        d.actionButton2 = data.buttons[1].action_url
        d.actionType2 = data.buttons[1].action_type
        setColorButton2(data.buttons[1].background_color)
        setTextColorButton2(data.buttons[1].text_color)
      }
      setInitialValues(d)
    }
    setIsLoading(false)
  }

  const handleSubmit = async (values: any) => {
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
      button1.text_color = textColorButton1
      button1.background_color = colorButton1
      button1.action_url = values.actionButton1
      button1.action_type = values.actionType1
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

    const { result, success } = await updateModalPopUp(value)
    if (success) {
      notification.success({
        message: `ดำเนินการอัพเดตสถานะสำเร็จ`,
        description: '',
      })
      router.push('/banner/modal-pop-up');
    } else {
      notification.error({
        message: `ไม่สามารถทำการ อัพเดตได้`,
        description: '',
      })
    }
  }

  const handleStatus = (event: any) => {
    const checkStatus = isActive == 'active' ? 'inactive' : 'active'
    setActive(checkStatus)
  }

  const renderTitle = () => {
    if (typeModal > 2) {
      return (
        <>
          <Row gutter={16}>
            <Col className="gutter-row" span={8}>
              <Field
                disabled={(isEdit) ? false : true}
                label={{ text: "ชื่อเรื่อง" }}
                name="content.title"
                type="text"
                component={Input}
                rows={2}
                className="form-control round"
                id="content.title"
              />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col className="gutter-row" span={8} >
              <Field
                disabled={(isEdit) ? false : true}
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

  const renderButtons = () => {
    if (typeModal == 3) {
      return (
        <>
          <Row gutter={24}>
            <Col className="gutter-row" span={8}>
              <Field
                disabled={(isEdit) ? false : true}
                label={{ text: "คำบนปุ่ม" }}
                name="textButton1"
                type="text"
                component={Input}
                rows={2}
                className="form-control round"
                id="textButton1"
              />
            </Col>
            <Col className="gutter-row" span={8}>
              <Field
                disabled={(isEdit) ? false : true}
                label={{ text: "Action ของปุ่ม" }}
                name="actionButton1"
                type="text"
                component={Input}
                rows={2}
                className="form-control round"
                id="actionButton1"
              />
            </Col>
            <Col className="gutter-row" span={8} >
              <Field
                disabled={(isEdit) ? false : true}
                label={{ text: 'Action type ของปุ่ม' }}
                name="actionType1"
                component={Select}
                id="actionType1"
                selectOption={[
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
          <Row gutter={16}>
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
          <Row gutter={24}>
            <Col className="gutter-row" span={8}>
              <Field
                disabled={(isEdit) ? false : true}
                label={{ text: "คำบนปุ่ม 1" }}
                name="textButton1"
                type="text"
                component={Input}
                rows={2}
                className="form-control round"
                id="textButton1"
              />
            </Col>
            <Col className="gutter-row" span={8}>
              <Field
                disabled={(isEdit) ? false : true}
                label={{ text: "Action ของปุ่ม 1" }}
                name="actionButton1"
                type="text"
                component={Input}
                rows={2}
                className="form-control round"
                id="actionButton1"
              />
            </Col>
            <Col className="gutter-row" span={8} >
              <Field
                disabled={(isEdit) ? false : true}
                label={{ text: 'Action type ของปุ่ม 1' }}
                name="actionType1"
                component={Select}
                id="actionType1"
                selectOption={[
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
          <Row gutter={16}>
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
                disabled={(isEdit) ? false : true}
                label={{ text: "คำบนปุ่ม 2" }}
                name="textButton2"
                type="text"
                component={Input}
                rows={2}
                className="form-control round"
                id="textButton2"
              />
            </Col>
            <Col className="gutter-row" span={8}>
              <Field
                disabled={(isEdit) ? false : true}
                label={{ text: "Action ของปุ่ม 2" }}
                name="actionButton2"
                type="text"
                component={Input}
                rows={2}
                className="form-control round"
                id="actionButton2"
              />
            </Col>
            <Col className="gutter-row" span={8} >
              <Field
                disabled={(isEdit) ? false : true}
                label={{ text: 'Action type ของปุ่ม 2' }}
                name="actionType2"
                component={Select}
                id="actionType2"
                selectOption={[
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
          <Row gutter={16}>
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

  const handleChangeImage = async (info: any) => {
    setloadingImage(true)
    console.log(handleChangeImage, info)
    const res = await uploadImage(info)
    setloadingImage(false)
    setImageUrl(res.upload_success.modal_pop_up)
  };

  const Schema = Yup.object().shape({
    app_id: Yup.string().trim().required('กรุณาเลือกแอพที่ต้องการส่ง'),
    name: Yup.string().trim().required('กรุณากรอกชื่อ modal pop up')
  })


  return (
    <MainLayout>
      {!_isLoading && (
        <>
          <Formik enableReinitialize={true} initialValues={initialValues} validationSchema={Schema} onSubmit={() => { }}>
            {({ values, resetForm, setFieldValue }: any) => (
              <Form>
                <Row gutter={16}>
                  <Col span={20}>
                    <Title level={4}>Banner</Title>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                      <Breadcrumb.Item>Banner</Breadcrumb.Item>
                      <Breadcrumb.Item>Modal Pop Up</Breadcrumb.Item>
                      <Breadcrumb.Item>Modal Pop Up Details</Breadcrumb.Item>
                    </Breadcrumb>
                  </Col>
                  <Col span={4}>
                    {isEdit ? (
                      <>
                        <Button1
                          style={{ float: 'right', backGroundColor: 'forestgreen !important' }}
                          size="middle"
                          className="confirm-button"
                          onClick={() => {
                            handleSubmit(values)
                          }}
                        >
                          บันทึก
                        </Button1>
                        <Button1
                          style={{ float: 'right', marginRight: '10px' }}
                          type="default"
                          size="middle"
                          onClick={() => {
                            setIsEdit(!isEdit)
                          }}
                        >
                          ยกเลิก
                        </Button1>
                      </>
                    ) : (
                      <Button1
                        style={{ float: 'right', backGroundColor: 'forestgreen !important' }}
                        type="primary"
                        size="middle"
                        onClick={() => {
                          setIsEdit(true)
                        }}
                      >
                        แก้ไข
                      </Button1>
                    )}
                  </Col>
                </Row>
                <Card>
                  <Row gutter={24}>
                    <Col className="gutter-row" span={8}>
                      <Field
                        disabled={(isEdit) ? false : true}
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
                        disabled={(isEdit) ? false : true}
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
                  </Row>
                  <Row gutter={16} style={{ marginTop: 20 }}>
                    <Col className="gutter-row" span={24} >
                      <Radio.Group name="type"
                        disabled={(isEdit) ? false : true}
                        defaultValue={values.type}
                        value={values.type}
                        onChange={e => {
                          setFieldValue("type", e.target.value)
                          handleSetTypeModal(e.target.value)
                        }}>
                        <Space direction='vertical'>
                          <Row gutter={24}>
                            <Col className="gutter-row" span={6}>
                              <Radio name="type" value={1} >
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
                        disabled={(isEdit) ? false : true}
                        label={{ text: "image action url" }}
                        name="image_action_url"
                        type="text"
                        component={Input}
                        rows={2}
                        className="form-control round"
                        id="image_action_url"
                      />
                    </Col>
                    <Col className="gutter-row" span={8} >
                      <Field
                        disabled={(isEdit) ? false : true}
                        label={{ text: 'image action type' }}
                        name="image_action_type"
                        component={Select}
                        id="image_action_type"
                        selectOption={[
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
                  {renderTitle()}
                  {renderButtons()}
                  <Row gutter={16} >
                    <Col className="gutter-row" span={16}>
                      สถานะ
                      <Row gutter={16}>
                        <Col className="gutter-row" span={16} style={{ marginTop: "10px" }}>
                          <span >
                            <Switch
                              disabled={(isEdit) ? false : true}
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
                        disabled={(isEdit) ? false : true}
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
                        disabled={(isEdit) ? false : true}
                        label={{ text: 'วันเวลาแสดง Modal Popup' }}
                        name="show_date"
                        component={DateTimeRangePicker}
                        id="show_date"
                        placeholder="show_date"
                      />
                    </Col>
                  </Row>
                </Card>
              </Form>
            )}
          </Formik>
        </>
      )
      }

    </MainLayout >
  )
}
