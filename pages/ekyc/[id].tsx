import Button from '@/components/Button'
import Select from '@/components/Form/Select'
import { EkycApproveStatusInterface, EkycDetail, EkycDetailProps } from '@/interface/ekyc'
import { downloadImage, getEkycDetail, updateEkycDetail } from '@/services/ekyc'
import { DownOutlined, UpOutlined } from '@ant-design/icons'
import { Breadcrumb, Col, Collapse, Modal, Row, Skeleton, Typography } from 'antd'
import { Field, Form, Formik } from 'formik'
import { isUndefined } from 'lodash'
import { useRouter } from 'next/router'
import { ReactElement, useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import CustomPanel from './style'
import fetcher from '@/services/fetch/fetch'
import MainLayout from '@/layout/MainLayout'
import Card from '@/components/Card'
const { Title } = Typography

const statusMapping: any = {
  uploaded: 'รอการตรวจสอบ',
  approve: 'อนุมัติ',
  're-approve': 'ขอเอกสารเพิ่มเติม',
  reject: 'ไม่อนุมัติ',
}

const statusOptionCard = [
  { name: 'ผ่าน', value: 1, disabled: false },
  { name: 'ข้อมูลบัตรไม่ถูกต้อง', value: 2, disabled: false },
  { name: 'บัตรไม่ชัด', value: 3, disabled: false },
]

const statusOptionFace = [
  { name: 'ผ่าน', value: 1, disabled: false },
  { name: 'ใบหน้าไม่ชัด', value: 2, disabled: false },
  { name: 'ใบหน้าไม่ตรงกับบัตรประชาชน', value: 3, disabled: false },
]

const statusVideoOption = [
  { name: 'ผ่าน', value: 1, disabled: false },
  { name: 'เสียงหาย', value: 2, disabled: false },
  { name: 'ใบหน้าไม่ชัดเจน', value: 3, disabled: false },
]

const EkycList = ({ isComponent, sso_id }: EkycDetailProps): ReactElement => {
  const router = useRouter()
  const { query } = router

  const { id } = query
  const [ekycDetail, setEkycDetail] = useState<EkycDetail>()
  const [isLoading, setLoading] = useState(false)
  const [isLoadingSubmit, setLoadingSubmit] = useState(false)
  const [imgUrl, setImgUrl] = useState('')
  const [isShowMediaModal, setIsShowMediaModal] = useState(false)
  const [isLoadingMedia, setIsLoadingMedia] = useState(false)

  const fetchEkycDetail = useCallback(async () => {
    setLoading(true)
    const { result, success } = await getEkycDetail(id || sso_id)
    const { data } = result
    if (success) {
      setEkycDetail(data)
    }
    setLoading(false)
  }, [id, sso_id])

  const onSubmit = async (values: EkycApproveStatusInterface) => {
    setLoadingSubmit(true)
    console.log(values)

    const payload = {
      ...ekycDetail,
      ...values,
      status_face_text:
        values.status_face === 1
          ? 'ผ่าน'
          : values.status_card === 2
            ? 'ข้อมูลบัตรไม่ถูกต้อง'
            : 'บัตรไม่ชัด',
      status_card_text:
        values.status_card === 1
          ? 'ผ่าน'
          : values.status_card === 2
            ? 'ใบหน้าไม่ชัด'
            : 'ใบหน้าไม่ตรงกับบัตรประชาชน',
      status_video_text:
        values.status_video === 1
          ? 'ผ่าน'
          : values.status_card === 2
            ? 'เสียงหาย'
            : 'ใบหน้าไม่ชัดเจน',
    }
    console.log(payload)

    const { result, message, success } = await updateEkycDetail(payload)

    if (success) {
      Modal.success({
        content: <Title level={4}>อนุมัติการยืนยันตัวตนสำเร็จ</Title>,
      })
    } else {
      Modal.success({
        content: <Title level={4}>{message}</Title>,
      })
    }
    setLoadingSubmit(false)
  }

  const onClickViewMedia = async (type: string, pathUrl: string) => {
    setIsLoadingMedia(true)
    const payload = {
      type: type,
      pathUrl: pathUrl,
    }

    const res = await downloadImage(payload)
    const url = URL.createObjectURL(res)
    setImgUrl(url)
    setIsLoadingMedia(false)
    setIsShowMediaModal(true)
  }

  useEffect(() => {
    fetchEkycDetail()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const renderHeader = (): ReactElement => {
    return (
      <Row justify="space-between">
        <Col md={6} span={8}>
          <Title level={3} style={{ color: '#fffff' }}>
            {`การยืนยันตัวตน (E-KYC)`}
          </Title>
        </Col>
        <Col md={6} span={8} />
        <Col md={6} span={8}>
          <Title
            level={3}
            style={{
              color:
                ekycDetail?.status === 'approved '
                  ? '#52e04a'
                  : ekycDetail?.status === 'uploaded'
                    ? '#e0b34a'
                    : ekycDetail?.status === 'reject'
                      ? '#de3e3e'
                      : '',
            }}
          >
            {statusMapping[ekycDetail?.status || '']}
          </Title>
        </Col>
      </Row>
    )
  }

  const renderEkycDetail = (): ReactElement => {
    return (
      <>
        <Modal
          closable={false}
          onOk={() => {
            setIsShowMediaModal(false)
          }}
          visible={isShowMediaModal}
          footer={[
            <Button
              key="1"
              type="primary"
              onClick={() => {
                setIsShowMediaModal(false)
              }}
            >
              ปิด
            </Button>,
          ]}
        >
          <Image src={imgUrl} width={1920} height={1200} alt="media" />
        </Modal>
        <Formik
          initialValues={{
            video_url: ekycDetail?.video_url,
            face_photo_url: ekycDetail?.face_photo_url,
            citizen_card_photo_url: ekycDetail?.citizen_card_photo_url,
            status_face: ekycDetail?.status_face,
            status_card: ekycDetail?.status_card,
            status_video: ekycDetail?.status_video,
            status: ekycDetail?.status,
          }}
          onSubmit={onSubmit}
        >
          {({ values }) => (
            <Form style={{ justifyContent: 'center' }}>
              <Row style={{ padding: '16px' }} justify="space-between">
                <Col offset={2} span={4}>
                  <Title level={5}>สแกนบัตรประชาชน</Title>
                </Col>
                <Col offset={2} span={6}>
                  <Button
                    loading={isLoadingMedia}
                    disabled={isUndefined(values.citizen_card_photo_url)}
                    onClick={() => {
                      const { citizen_card_photo_url } = values
                      if (!isUndefined(citizen_card_photo_url)) {
                        onClickViewMedia('image', citizen_card_photo_url)
                      }
                    }}
                  >
                    ดูรูปภาพ
                  </Button>
                </Col>
                <Col offset={2} span={4} pull={2}>
                  <Field
                    name="status_card"
                    component={Select}
                    id="status_card"
                    placeholder="status"
                    selectOption={statusOptionCard}
                  />
                </Col>
              </Row>
              <Row style={{ padding: '16px' }} justify="space-between">
                <Col offset={2} span={4}>
                  <Title level={5}>สแกนใบหน้า</Title>
                </Col>
                <Col offset={2} span={6}>
                  <Button
                    loading={isLoadingMedia}
                    disabled={isUndefined(values.face_photo_url)}
                    onClick={() => {
                      const { face_photo_url } = values
                      if (!isUndefined(face_photo_url)) {
                        onClickViewMedia('image', face_photo_url)
                      }
                    }}
                  >
                    ดูรูปภาพ
                  </Button>
                </Col>
                <Col offset={2} span={4} pull={2}>
                  <Field
                    name="status_face"
                    component={Select}
                    id="status_face"
                    placeholder="status"
                    selectOption={statusOptionFace}
                  />
                </Col>
              </Row>
              <Row style={{ padding: '16px' }} justify="space-between">
                <Col offset={2} span={4}>
                  <Title level={5}>อัดคลิปเสียงพร้อมวิดีโอ</Title>
                </Col>
                <Col offset={2} span={6}>
                  <Button
                    loading={isLoadingMedia}
                    disabled={isUndefined(values.video_url)}
                    onClick={() => {
                      const { video_url } = values
                      if (!isUndefined(video_url)) {
                        onClickViewMedia('video', video_url)
                      }
                    }}
                  >
                    ดูวิดีโอ
                  </Button>
                </Col>
                <Col offset={2} span={4} pull={2}>
                  <Field
                    name="status_video"
                    component={Select}
                    id="status_video"
                    placeholder="status"
                    selectOption={statusVideoOption}
                  />
                </Col>
              </Row>
              <Row style={{ padding: '16px' }} justify="space-between">
                <Col offset={2} span={4} />
                <Col offset={2} span={6}>
                  <Title level={5}>การอนุมัติ</Title>
                </Col>
                <Col offset={2} span={4} pull={2}>
                  <Field
                    name="status"
                    component={Select}
                    id="status"
                    placeholder="status"
                    selectOption={[
                      { value: 'uploaded', name: 'รอการอนุมัติ' },
                      { value: 're-approve', name: 'ขอเอกสารเพิ่มเติม' },
                      { value: 'reject', name: 'ไม่อนุมัติ' },
                      {
                        value: 'approve',
                        name: 'อนุมัติ',
                        disabled:
                          values.status_card !== 1 ||
                          values.status_face !== 1 ||
                          values.status_video !== 1,
                      },
                    ]}
                  />
                </Col>
              </Row>
              <Row justify="end">
                {console.log(values)}
                <Button
                  disabled={
                    isUndefined(values.status) ||
                    isUndefined(values.status_card) ||
                    isUndefined(values.status_face) ||
                    isUndefined(values.status_video)
                  }
                  loading={isLoadingSubmit}
                  style={{ width: '120px', marginTop: '31px' }}
                  type="primary"
                  size="middle"
                  htmlType="submit"
                >
                  บันทึก
                </Button>
              </Row>
            </Form>
          )}
        </Formik>
      </>
    )
  }
  return isComponent ? (
    <Collapse
      expandIcon={({ isActive }) => {
        return isActive ? (
          <UpOutlined
            style={{
              margin: 'auto',
              textAlign: 'center',
              fontSize: 18,
              fontWeight: 'bold',
              color: '#ffff',
            }}
          />
        ) : (
          <DownOutlined
            style={{
              margin: 'auto',
              textAlign: 'center',
              fontSize: 18,
              fontWeight: 'bold',
              color: '#ffff',
            }}
          />
        )
      }}
      expandIconPosition="right"
      defaultActiveKey={['1']}
    >
      <CustomPanel status={ekycDetail?.status || ''} header={renderHeader()} key="1">
        <Title level={4}>
          {ekycDetail?.first_name} {ekycDetail?.last_name}
        </Title>
        <Row style={{ padding: '16px' }} justify="end">
          <Col offset={2} span={6}>
            สถานะการยืนยัน
          </Col>
        </Row>
        <Skeleton loading={isLoading}>{renderEkycDetail()}</Skeleton>
      </CustomPanel>
    </Collapse>
  ) : (
    <MainLayout>
      <Title level={4}>อนุมัติการยินยันตัวตนผ่านระบบ E-KYC</Title>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>อนุมัติการยินยันตัวตนผ่านระบบ E-KYC</Breadcrumb.Item>
        <Breadcrumb.Item>ลงทะเบียนการยินยันตัวตน</Breadcrumb.Item>
      </Breadcrumb>
      <Card>
        <Skeleton loading={isLoading}>
          {renderHeader()}
          {renderEkycDetail()}
        </Skeleton>
      </Card>
    </MainLayout>
  )
}

export default EkycList
