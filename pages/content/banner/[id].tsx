import Button1 from '@/components/Button';
import Card from '@/components/Card';
import DateTimeRangePicker from '@/components/Form/DateTimeRangePicker';
import Input from '@/components/Form/Input';
import MainLayout from '@/layout/MainLayout';
import { findBanner, updateBanner } from '@/services/banner';
import { uploadImage } from '@/services/cdn';
import { LinkOutlined, PlusOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Col, Modal, notification, Radio, Row, Switch, Typography, Upload } from 'antd';
import { Field, Form, Formik } from 'formik';
import { omit } from 'lodash';
import moment from 'moment';
import { useRouter } from 'next/router';
import { ReactElement, useEffect, useState } from 'react';
import * as Yup from 'yup';
import noImage from '../../../public/asset/images/no-image-available.svg';

const { Title } = Typography
const { warning } = Modal

interface Props { }

const initialValuesDefault = {
  id: 0,
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

const urlMatch = /^((http|https):\/\/)?(www.)?(?!.*(http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+(\/)?.([\w\?[a-zA-Z-_%\/@?]+)*([^\/\w\?[a-zA-Z0-9_-]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/

const Schema = Yup.object().shape({
  name: Yup.string().trim().required('กรุณากรอกชื่อ Banner'),
  action_url: Yup.string()
    .matches(urlMatch, 'Enter correct url!')
})

export default function BannerView({ }: Props): ReactElement {
  const router = useRouter()
  const [isActive, setActive] = useState('active')
  const [loadingImage, setloadingImage] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [isAction, setAction] = useState('')
  const [initialValues, setInitialValues] = useState(initialValuesDefault)
  const [isEdit, setIsEdit] = useState(false)
  const { id } = router.query

  useEffect(() => {
    if (id != undefined) {
      fetchDataBanner()
    }

  }, [id])

  const fetchDataBanner = async () => {
    const { result, success } = await findBanner(id)
    if (success) {
      const { data } = result
      let dataBanner = {
        id: data.id,
        name: data.name,
        status: data.status,
        type: data.type,
        action: data.action,
        action_url: data.action_url,
        image_url: data.image_url,
        start_date: data.start_date,
        end_date: data.end_date,
        priority: data.priority,
        show_date: {
          start: moment(data.start_date).startOf('day').format('YYYY-MM-DDTHH:mm:ss.000Z'),
          end: moment(data.end_date).endOf('day').format('YYYY-MM-DDTHH:mm:ss.000Z'),
        }
      }
      setActive(data.status)
      setAction(data.action)
      setInitialValues(dataBanner)
      setImageUrl(data.image_url)
    }
  }

  const handleStatus = (event: any) => {
    const checkStatus = isActive == 'active' ? 'inactive' : 'active'
    setActive(checkStatus)
  }

  const handleAction = (event: any) => {
    setAction(event.target.value)
  }

  const handleChangeImage = async (info: any) => {
    const isJPNG = info.type === 'image/jpeg';
    const isJPG = info.type === 'image/jpg';
    const isPNG = info.type === 'image/png';
    const fileSize = (info.size / 1024) / 1024

    if (!isJPNG && !isJPG && !isPNG) {
      warning({
        title: `กรุณาเลือกรูปภาพ`,
        afterClose() {
          setImageUrl('')
        }
      })
      return null
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
    console.log(values)
    if (values.show_date.start != '') {
      values.start_date = moment(values.show_date.start).format(dateFormat)
    }
    if (values.show_date.end != '') {
      values.end_date = moment(values.show_date.end).format(dateFormat)
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
    const { success } = await updateBanner(dataCreate)

    if (success) {
      notification.success({
        message: `ดำเนินการอัพเดตสถานะสำเร็จ`,
        description: '',
      })
      router.push('/content/banner');
    } else {
      notification.error({
        message: `ไม่สามารถทำการ อัพเดตได้`,
        description: '',
      })
    }
  }
  console.log('render')
  return (
    <MainLayout>
      <Formik enableReinitialize initialValues={initialValues} onSubmit={handleSubmit} validationSchema={Schema}>
        {({ values, resetForm, setFieldValue }) => (
          <Form>
            <Row justify="space-around" align="middle">
              <Col span={20}>
                <Title level={4}>Banner</Title>
                <Breadcrumb style={{ margin: '16px 0' }}>
                  <Breadcrumb.Item>Content</Breadcrumb.Item>
                  <Breadcrumb.Item>Banner Create</Breadcrumb.Item>
                </Breadcrumb>
              </Col>
              <Col span={4}>
                {isEdit ? (
                  <>
                    <Button1
                      style={{ float: 'right', backGroundColor: 'forestgreen !important' }}
                      size="middle"
                      type="primary"
                      className="confirm-button"
                      htmlType='submit'
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
                  <Button
                    style={{ float: 'right', backgroundColor: 'forestgreen !important' }}
                    type="primary"
                    onClick={() => {
                      setIsEdit(true)
                    }}
                  >
                    แก้ไข
                  </Button>
                )}
              </Col>
            </Row>

            <Card>
              <Row gutter={24}>
                <Col className="gutter-row" span={24}>
                  <Field
                    disabled={(isEdit) ? false : true}
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
                          disabled={(isEdit) ? false : true}
                          onClick={handleStatus}
                          checkedChildren="active"
                          unCheckedChildren="inactive"
                          checked={isActive == 'active' ? true : false}
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
                      <Radio.Group disabled={(isEdit) ? false : true} onChange={handleAction} value={isAction}>
                        <Radio value="external">External</Radio>
                        <Radio value="internal">Internal</Radio>
                      </Radio.Group>
                    </Col>
                  </Row>

                  <Row gutter={24} style={{ marginTop: "10px" }}>
                    <Col span={1} style={{ textAlign: "right" }}>
                      <LinkOutlined style={{ fontSize: "20px", marginTop: "7px", color: "#4dd2ff" }} />
                    </Col>
                    <Col span={23}>
                      <Field
                        disabled={(isEdit) ? false : true}
                        name="action_url"
                        type="text"
                        component={Input}
                        rows={2}
                        className="form-control round"
                        placeholder="ลิงค์"
                        id="action_url" />
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
                    disabled={(isEdit) ? false : true}
                    label={{ text: "Priority" }}
                    name="priority"
                    type="text"
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
                    disabled={(isEdit) ? false : true}
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
                  onRemove={e => { setImageUrl('') }}
                  beforeUpload={handleChangeImage}
                  maxCount={1}
                >

                  <Button disabled={(isEdit) ? false : true} style={{ marginLeft: 10 }} icon={<PlusOutlined />}>เพิ่มรูปภาพ</Button>
                </Upload>
                <label style={{ marginLeft: 10, color: 'red' }}>* หมายเหตุ ควรเลือกรูปภาพขนาดไม่เกิน 1MB</label>

                <Col className="gutter-row" span={24} style={{ marginTop: "35px", marginBottom: "20px", textAlign: "center" }}>
                  <img style={{ width: 'auto', height: 240 }} alt="example" src={imageUrl != '' ? imageUrl : noImage.src} />
                </Col>
              </Row>
            </Card>
          </Form>
        )}
      </Formik>
    </MainLayout>
  )
}

