import Card from '@/components/Card'
import Input from '@/components/Form/Input'
import ReactQuill from "@/components/QuilNoSSR"
import MainLayout from '@/layout/MainLayout'
import { uploadImage } from '@/services/cdn'
import { createContentLs, findContentLs } from '@/services/ls-config'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import {
  Breadcrumb,
  Button,
  Col, Modal, notification, Row, Typography,
  Upload
} from 'antd'
import { Field, Form, Formik } from 'formik'
import _, { omit } from 'lodash'
import moment from 'moment'
import { useRouter } from 'next/router'
import { ReactElement, useEffect, useState } from 'react'
import 'react-quill/dist/quill.snow.css'
import * as Yup from 'yup'
import noImage from '../../../public/asset/images/no-image-available.svg'


const { Title } = Typography
const { warning } = Modal

interface Props { }

interface FormInterface {
  name: string
  description: string
  status: boolean
  image_url: string
  start_date?: string | null | undefined
  end_date?: string | null | undefined
  show_date: {
    start: any
    end: any
  }
  code?: string
  id?: number
  version?: string
}

const initialValuesDefault: FormInterface = {
  name: '',
  description: '',
  status: true,
  image_url: '',
  start_date: '',
  end_date: '',
  show_date: {
    start: moment().startOf('day').format('YYYY-MM-DDTHH:mm:ss.000Z'),
    end: moment().endOf('day').format('YYYY-MM-DDTHH:mm:ss.000Z'),
  },
  code: '',
  id: 0,
  version: 'v1.0.0'
}

const Schema = Yup.object().shape({
  name: Yup.string().trim().required('กรุณากรอกชื่อ'),
})

export default function Ls({ }: Props): ReactElement {
  const [isActive, setActive] = useState('active')
  const [loadingImage, setloadingImage] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [initialValues, setInitialValues] = useState(initialValuesDefault)
  const dateFormat = 'YYYY-MM-DDTHH:mm:ss.000Z'
  const router = useRouter()
  const [isSubmit, setIsSubmit] = useState(false)
  const { code } = router.query

  const addVersion = (version: any) => {
    let versionSplit = version.split('.');
    if (versionSplit.length == 3) {
      let splitOne = _.get(versionSplit, "[1]")
      let splitTwo = _.get(versionSplit, "[2]")

      if (+splitTwo >= 30) {
        splitOne = +splitOne + 1
        splitTwo = 0
      } else {
        splitTwo = +splitTwo + 1
      }

      version = versionSplit[0] + '.' + splitOne + '.' + splitTwo
    }
    return version
  }

  const handleStatus = (event: any) => {
    const checkStatus = isActive == 'active' ? 'inactive' : 'active'
    setActive(checkStatus)
  }

  const fetchDataContentLs = async () => {
    const { result, success } = await findContentLs(code)
    if (success) {
      const { data } = result
      let image = data.image_url === undefined ? '' : data.image_url
      let dataContentLs: FormInterface = {
        name: data.name,
        description: data.description,
        status: data.status,
        image_url: image,
        start_date: data.start_date,
        end_date: data.end_date,
        show_date: {
          start: moment(data.start_date).startOf('day').format('YYYY-MM-DDTHH:mm:ss.000Z'),
          end: moment(data.end_date).endOf('day').format('YYYY-MM-DDTHH:mm:ss.000Z'),
        },
        code: typeof code === 'string' ? code : '',
        id: data.id,
        version: data.version
      }

      setActive(data.status ? 'active' : 'inactive')
      setInitialValues(dataContentLs)
      setImageUrl(image)
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
        afterClose() {

        },
      })
      return false
    }

    setloadingImage(true)
    const res = await uploadImage(info)
    setloadingImage(false)
    setImageUrl(res.upload_success.modal_pop_up)
  }

  const handleSubmit = async (values: typeof initialValues) => {
    setIsSubmit(true)
    values.image_url = imageUrl
    values.status = isActive == 'active' ? true : false
    values.code = typeof code === 'string' ? code : ''

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
    if (values.description != '') {
      values.description = values.description.replaceAll('<br>', '<br/>')
    }

    const dataCreate = { data: omit(values, ['show_date']) }

    if (values.id != 0) {
      dataCreate.data.version = addVersion(dataCreate.data.version)
      dataCreate.data.id = 0
      setInitialValues({ ...values, version: dataCreate.data.version })
    }

    const { success } = await createContentLs(dataCreate)
    if (success) {
      notification.success({
        message: `ดำเนินการสร้าง Content LS สำเร็จ`,
        description: '',
        duration: 3,
      })
    } else {
      notification.warning({
        message: `ไม่สามารถดำเนินการสร้าง Content LS ได้`,
        description: 'กรุณาระบุ Content LS ให้ครบถ้วน',
        duration: 3,
      })
    }

    setTimeout(() => {
      router.reload()
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      setIsSubmit(false)
    }, 2000);
  }


  useEffect(() => {
    if (code != undefined) {
      fetchDataContentLs()
    }
  }, [code])
  return (
    <MainLayout>
      <Row justify="space-around" align="middle">
        <Col span={8}>
          <Title level={4}>{code}</Title>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Content</Breadcrumb.Item>
            <Breadcrumb.Item>Create {code}</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col span={8} offset={8} style={{ textAlign: 'end' }}></Col>
      </Row>

      <Card>
        <Formik
          enableReinitialize
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={Schema}>
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
                    value={values.name}
                  />
                </Col>
              </Row>
              <Row gutter={24}>
                <Col className="gutter-row" span={24}
                  style={{
                    paddingBottom: '80px',
                  }}>
                  <label style={{ display: 'block', marginBottom: '10px' }}>รายละเอียด</label>
                  <ReactQuill
                    theme="snow"
                    value={values.description}
                      onChange={(content, delta, source, editor) => {
                        setFieldValue('description', editor.getHTML())
                      }}
                      style={{ height: '220px' }}
                      modules={{
                        toolbar: [
                          // [{ header: [1, 2, false] }],
                          [{ font: [] }, { size: [] }],
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
              </Row>
              <Row gutter={24}>

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
                <Button onClick={() => { setImageUrl('') }} style={{ marginLeft: 10 }} icon={<DeleteOutlined />} />
                <label style={{ marginLeft: 10, color: 'red' }}>
                  * แนะนำ รูปภาพ ขนาด 2:1 360x200px หรือขนาดไม่เกิน 1 MB และไฟล์ jpeg,jpg,png
                </label>
                <Col
                  className="gutter-row"
                  span={24}
                  style={{ marginTop: '35px', marginBottom: '20px' }}
                >
                  <label style={{ display: 'block', marginBottom: '10px' }}>ตัวอย่างหน้า</label>
                </Col>
              </Row>
              {/* start layout */}
              <Row gutter={24} align={'middle'}>
                <Col
                  span={12} offset={6}
                >
                  <div style={{
                    borderTop: "2px solid #f2f2f2",
                    borderLeft: "2px solid #f2f2f2",
                    borderRight: "2px solid #f2f2f2",
                    borderBottom: "2px solid #f2f2f2",
                    minHeight: '680px',
                    width: '400px',
                    padding: "40px 25px",
                    wordBreak: 'break-all'
                  }}>
                    <Row gutter={24}
                      style={{ marginTop: '0px', textAlign: 'center' }}
                    >
                      <Col
                        className="gutter-row"
                        span={24}
                        style={{ textAlign: 'center' }}
                      >
                        <img
                          style={{ maxWidth: '100%', height: 180 }}
                          alt="example"
                          src={imageUrl != '' ? imageUrl : noImage.src}
                        />
                      </Col>
                    </Row>
                    {/* <Row gutter={24}>
                      <Col
                        className="gutter-row"
                        span={24}
                        style={{ marginBottom: '20px' }}
                      >
                        <strong><label style={{ display: 'block', paddingTop: '20px' }}>{values.name}</label></strong>
                      </Col>
                    </Row> */}
                    <Row gutter={24}>
                      <Col
                        className="gutter-row"
                        span={24}
                      >
                        <div style={{ display: 'block', marginBottom: '10px', paddingTop: '20px' }} dangerouslySetInnerHTML={{ __html: values.description }} />
                      </Col>
                    </Row>
                  </div>
                </Col>
              </Row>
              {/* end */}
              {/* <Row gutter={24} style={{ paddingTop: '40px' }}>
                <Col
                  className="gutter-row"
                  span={12}
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
                  span={12}
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
              </Row> */}
              <Row>
                <Col className="gutter-row" span={8}>
                  <Button
                    style={{ width: '120px', marginTop: '31px' }}
                    type="primary"
                    size="middle"
                    htmlType="submit"
                    disabled={isSubmit}
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
