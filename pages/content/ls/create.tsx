import Card from '@/components/Card'
import DateTimeRangePicker from '@/components/Form/DateTimeRangePicker'
import Input from '@/components/Form/Input'
import MainLayout from '@/layout/MainLayout'
import { uploadImage } from '@/services/cdn'
import { PlusOutlined } from '@ant-design/icons'
import {
  Breadcrumb,
  Button,
  Col, Modal, Row,
  Switch,
  Typography,
  Upload
} from 'antd'
import { Field, Form, Formik } from 'formik'
import { omit } from 'lodash'
import moment from 'moment'
import { useRouter } from 'next/router'
import { ReactElement, useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import * as Yup from 'yup'
import noImage from '../../../public/asset/images/no-image-available.svg'


const { Title } = Typography
const { warning } = Modal

interface Props { }

interface FormInterface {
  name: string
  description: string
  status: string
  type: string
  image_url: string
  start_date?: string | null | undefined
  end_date?: string | null | undefined
  show_date: {
    start: any
    end: any
  }
}

const initialValues: FormInterface = {
  name: '',
  description: '',
  status: '',
  type: 'type',
  image_url: '',
  start_date: '',
  end_date: '',
  show_date: {
    start: moment().startOf('day').format('YYYY-MM-DDTHH:mm:ss.000Z'),
    end: moment().endOf('day').format('YYYY-MM-DDTHH:mm:ss.000Z'),
  },
}

const Schema = Yup.object().shape({
  name: Yup.string().trim().required('กรุณากรอกชื่อ'),
})

export default function BannerCreate({ }: Props): ReactElement {
  const router = useRouter()
  const [isActive, setActive] = useState('active')
  const [loadingImage, setloadingImage] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [isAction, setAction] = useState('external_url')
  const [exampleLink, setExampleLink] = useState('')

  const handleStatus = (event: any) => {
    const checkStatus = isActive == 'active' ? 'inactive' : 'active'
    setActive(checkStatus)
  }

  const handleAction = (event: any) => {
    setAction(event.target.value)

    if (event.target.value == 'external_url') {
      setExampleLink('* ตัวอย่าง https://www.google.com/')
    } else if (event.target.value == 'internal_url') {
      setExampleLink('* ตัวอย่าง khconsumer://host?outletId=xxx&productId=xxxx&app=consumer')
    }
  }

  const handleChangeImage = async (info: any) => {
    const fileSize = info.size / 1024 / 1024
    const isJPNG = info.type === 'image/jpeg'
    const isJPG = info.type === 'image/jpg'
    const isPNG = info.type === 'image/png'

    if (!isJPNG && !isJPG && !isPNG) {
      warning({
        title: `กรุณาเลือกรูปภาพ`,
        afterClose() {
          setImageUrl('')
        },
      })
      return false
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

  const dateFormat = 'YYYY-MM-DDTHH:mm:ss.000Z'

  const handleSubmit = async (values: typeof initialValues) => {
    if (imageUrl == '') {
      warning({
        title: `กรุณาเลือกรูปภาพ`,
        afterClose() { },
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

    const dataCreate = { data: omit(values, ['show_date']) }
    console.log(dataCreate)
    // const { success } = await createBanner(dataCreate)

    // if (success) {
    //   router.push('/content/ls/create')
    // }
  }

  return (
    <MainLayout>
      <Row justify="space-around" align="middle">
        <Col span={8}>
          <Title level={4}>Logistic Subsidize</Title>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Content</Breadcrumb.Item>
            <Breadcrumb.Item>Create Logistic Subsidize</Breadcrumb.Item>
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
                    label={{ text: 'ชื่อ' }}
                    name="name"
                    type="text"
                    component={Input}
                    rows={2}
                    className="form-control round"
                    id="name"
                  />
                </Col>
                <Col className="gutter-row" span={24}>
                  <label style={{ display: 'block', marginBottom: '10px' }}>รายละเอียด</label>
                  <ReactQuill
                    value={values.description}
                    onChange={(content, delta, source, editor) => {
                      setFieldValue('description', editor.getHTML())
                    }}
                    modules={{
                      toolbar: [
                        [{ header: [1, 2, false] }],
                        ['bold', 'italic', 'underline', 'strike', 'link'],
                        [{ color: [] }, { background: [] }, { align: [] }],
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
                <Col
                  className="gutter-row"
                  span={24}
                  style={{
                    borderTop: '2px solid #f2f2f2',
                    paddingTop: '15px',
                    paddingBottom: '15px',
                  }}
                >
                  <label style={{ display: 'block', marginBottom: '10px' }}>อัพโหลดรูปภาพ</label>
                </Col>
                <Upload
                  name="file"
                  id="file"
                  onRemove={(e) => {
                    setImageUrl('')
                  }}
                  beforeUpload={handleChangeImage}
                  maxCount={1}
                >
                  <Button style={{ marginLeft: 10 }} icon={<PlusOutlined />}>
                    เพิ่มรูปภาพ
                  </Button>
                </Upload>
                <label style={{ marginLeft: 10, color: 'red' }}>
                  * หมายเหตุ แนะนำ รูปภาพ ขนาด 3:1 หรือขนาดไม่เกิน 1 MB และไฟล์ jpeg,jpg,png
                </label>
                <Col
                  className="gutter-row"
                  span={24}
                  style={{ marginTop: '35px', marginBottom: '20px' }}
                >
                  <label style={{ display: 'block', marginBottom: '10px' }}>ตัวอย่างหน้า</label>
                </Col>
                <Col
                  className="gutter-row"
                  span={24}
                  style={{ marginTop: '35px', marginBottom: '20px', textAlign: 'center' }}
                >
                  <img
                    style={{ width: 'auto', height: 240 }}
                    alt="example"
                    src={imageUrl != '' ? imageUrl : noImage.src}
                  />
                </Col>
                <Col
                  className="gutter-row"
                  span={24}
                  style={{
                    borderTop: '2px solid #f2f2f2',
                    paddingTop: '15px',
                    paddingBottom: '15px',
                  }}
                >
                  <Field
                    label={{ text: 'วันที่และเวลาเริ่ม-สิ้นสุด' }}
                    name="show_date"
                    component={DateTimeRangePicker}
                    id="show_date"
                    placeholder="show_date"
                  />
                </Col>
                <Col
                  className="gutter-row"
                  span={24}
                  style={{
                    borderTop: '2px solid #f2f2f2',
                    paddingTop: '15px',
                    paddingBottom: '15px',
                  }}
                >
                  <b>สถานะ</b>
                  <Row gutter={24}>
                    <Col className="gutter-row" span={24} style={{ marginTop: '10px' }}>
                      <span>
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
      </Card>
    </MainLayout>
  )
}
