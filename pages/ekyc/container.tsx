import Button from '@/components/Button'
import Select from '@/components/Form/Select'
import { EkycApproveStatusInterface, EkycDetail, EkycDetailProps } from '@/interface/ekyc'
import {
  downloadImage,
  getEkycDetail,
  requestEkycInterface,
  updateEkycDetail,
} from '@/services/ekyc'
import { Col, Empty, Modal, Row, Skeleton, Typography } from 'antd'
import { Field, Form, Formik } from 'formik'
import { isEmpty, isUndefined } from 'lodash'
import Image from 'next/image'
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

  const onClickViewMedia = async (type: string, pathUrl: string) => {
    setIsLoadingMedia(true)
    setMediaType(type)
    const payload = {
      type: type,
      pathUrl: pathUrl,
    }

    const res = await downloadImage(payload)
    const url = URL.createObjectURL(res)
    setMediaUrl(url)
    setIsLoadingMedia(false)
    setIsShowMediaModal(true)
  }

  useEffect(() => {
    if ((!isEmpty(sso_id) && !isUndefined(sso_id)) || (!isEmpty(id) && !isUndefined(id))) {
      fetchEkycDetail(sso_id, id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sso_id, id])

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
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                height: '100%',
                width: '100%',
              }}
            >
              {mediaType === 'image' ? (
                <Image src={mediaUrl} width={1920} height={1200} alt="media" />
              ) : (
                <iframe src={mediaUrl} allow="autoplay; encrypted-media" title="video" />
              )}
            </div>
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
            enableReinitialize
            // onSubmit={onSubmit}
            onSubmit={() => {}}
          >
            {({ values }) => (
              <Form name="ekyc" style={{ justifyContent: 'center' }}>
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
                      placeholder="กรุณาเลือกสถานะ"
                      selectOption={[
                        { value: 'uploaded', name: 'รอการอนุมัติ' },
                        { value: 're-approved', name: 'ขอเอกสารเพิ่มเติม' },
                        { value: 'rejected', name: 'ไม่อนุมัติ' },
                        {
                          value: 'approved',
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
                    htmlType="button"
                    onClick={() => {
                      onSubmit(values)
                    }}
                    // htmlType="submit"
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
