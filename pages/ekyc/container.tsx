import Button from '@/components/Button'
import Select from '@/components/Form/Select'
import { EkycApproveStatusInterface, EkycDetail, EkycDetailProps } from '@/interface/ekyc'
import {
  getEkycDetail,
  getPresignUrl,
  requestEkycInterface,
  updateEkycDetail,
} from '@/services/ekyc'
import { Col, Empty, Image, message, Modal, Row, Skeleton, Typography } from 'antd'
import { Field, Form, Formik } from 'formik'
import { isEmpty, isUndefined } from 'lodash'
import { ReactElement, useEffect, useState } from 'react'
const { Title } = Typography

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

const EkycContainer = ({ sso_id, id, setEkycStatus }: EkycDetailProps): ReactElement => {
  const [ekycDetail, setEkycDetail] = useState<EkycDetail>()
  const [isLoading, setLoading] = useState(false)
  const [isLoadingSubmit, setLoadingSubmit] = useState(false)
  const [mediaUrl, setMediaUrl] = useState('')
  const [isShowMediaModal, setIsShowMediaModal] = useState(false)
  const [isLoadingMedia, setIsLoadingMedia] = useState(false)
  const [mediaType, setMediaType] = useState('')

  const fetchEkycDetail = async (sso_id?: string, id?: string) => {
    const payload: requestEkycInterface = {
      sso_id: sso_id || '',
      id: id || '',
    }

    setLoading(true)
    const { result, success } = await getEkycDetail(payload)
    if (success) {
      const { data } = result
      setEkycDetail(data)
      if (setEkycStatus) {
        setEkycStatus(data.status)
      }
    }
    setLoading(false)
  }

  const onSubmit = async (values: EkycApproveStatusInterface) => {
    setLoadingSubmit(true)

    const payload = {
      ...ekycDetail,
      ...values,
      status_card_text:
        values.status_card === 1
          ? 'ผ่าน'
          : values.status_card === 2
          ? 'ข้อมูลบัตรไม่ถูกต้อง'
          : 'บัตรไม่ชัด',
      status_face_text:
        values.status_face === 1
          ? 'ผ่าน'
          : values.status_face === 2
          ? 'ใบหน้าไม่ชัด'
          : 'ใบหน้าไม่ตรงกับบัตรประชาชน',
      status_video_text:
        values.status_video === 1
          ? 'ผ่าน'
          : values.status_video === 2
          ? 'เสียงหาย'
          : 'ใบหน้าไม่ชัดเจน',
    }

    const { message, success, result } = await updateEkycDetail(payload)

    if (success) {
      const { data } = result
      Modal.success({
        content: <Title level={4}>อนุมัติการยืนยันตัวตนสำเร็จ</Title>,
      })
      setEkycDetail(data)
      if (setEkycStatus) {
        setEkycStatus(data.status)
      }
    } else {
      Modal.success({
        content: <Title level={4}>{message}</Title>,
      })
    }
    setLoadingSubmit(false)
  }

  const onClickViewMedia = async (type: string) => {
    setIsLoadingMedia(true)
    setMediaType(type)
    const payload = {
      id: id || '',
      sso_id: sso_id || '',
      media_type: type,
    }
    const { result, success } = await getPresignUrl(payload)
    if (success) {
      const { url } = result
      setMediaUrl(url)
      setIsShowMediaModal(true)
    } else {
      message.error('ไม่สามารถดึงค่าข้อมูลได้')
    }
    setIsLoadingMedia(false)
  }

  useEffect(() => {
    if ((!isEmpty(sso_id) && !isUndefined(sso_id)) || (!isEmpty(id) && !isUndefined(id))) {
      fetchEkycDetail(sso_id, id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sso_id, id])

  const disableApprove = (data: EkycDetail) => {
    return (
      isUndefined(data.status) ||
      isUndefined(data.status_card) ||
      isUndefined(data.status_face) ||
      isUndefined(data.status_video)
    )
  }

  return (
    <Skeleton loading={isLoading}>
      {isUndefined(ekycDetail) ? (
        <Empty />
      ) : (
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
            {mediaType === 'video' ? (
              <>
                <iframe src={mediaUrl} width="100%" height={400} title="video" />
                <Title style={{ textAlign: 'center', padding: '0.5rem' }} level={4}>
                  {ekycDetail.wording}
                </Title>
              </>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Image preview={false} src={mediaUrl} alt="media" />
              </div>
            )}
          </Modal>

          <Formik initialValues={ekycDetail} enableReinitialize onSubmit={() => {}}>
            {({ values }) => (
              <Form name="ekyc" style={{ justifyContent: 'center' }}>
                <Row style={{ padding: '16px' }} justify="space-between">
                  <Col offset={2} span={4}>
                    <Title level={5}>สแกนบัตรประชาชน</Title>
                  </Col>
                  <Col offset={2} span={6}>
                    <Button
                      loading={isLoadingMedia}
                      onClick={() => {
                        onClickViewMedia('card')
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
                      placeholder="กรุณาเลือกสถานะ"
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
                      onClick={() => {
                        onClickViewMedia('face')
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
                      placeholder="กรุณาเลือกสถานะ"
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
                      onClick={() => {
                        onClickViewMedia('video')
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
                      placeholder="กรุณาเลือกสถานะ"
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
                      disabled={disableApprove(values)}
                      placeholder="กรุณาเลือกสถานะ"
                      selectOption={[
                        { value: 'uploaded', name: 'รอการอนุมัติ' },
                        { value: 're-approved', name: 'ขอเอกสารเพิ่มเติม' },
                        { value: 'rejected', name: 'ไม่อนุมัติ' },
                        {
                          value: 'approved',
                          name: 'อนุมัติ',
                        },
                      ]}
                    />
                  </Col>
                </Row>
                <Row justify="end">
                  <Button
                    disabled={disableApprove(values)}
                    loading={isLoadingSubmit}
                    style={{ width: '120px', marginTop: '31px' }}
                    type="primary"
                    size="middle"
                    htmlType="button"
                    onClick={() => {
                      onSubmit(values)
                    }}
                  >
                    บันทึก
                  </Button>
                </Row>
              </Form>
            )}
          </Formik>
        </>
      )}
    </Skeleton>
  )
}

export default EkycContainer
