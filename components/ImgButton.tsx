import useViewImage from '@/hooks/useViewImage'
import { Image, Modal } from 'antd'
import React, { ReactElement } from 'react'
import Button from './Button'

interface Props {
  url: string | undefined
  type?: 'image' | 'video'
}

export default function ImgButton({ url, type = 'image', ...props }: Props): ReactElement {
  const {
    onClickViewMedia,
    isShowMediaModal,
    setIsShowMediaModal,
    mediaType,
    mediaUrl,
    isLoadingMedia,
  } = useViewImage()

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
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            height: '100%',
            width: '100%',
          }}
        >
          {mediaType === 'image' ? (
            <Image src={mediaUrl} alt="media" />
          ) : (
            <iframe src={mediaUrl} allow="autoplay; encrypted-media" title="video" />
          )}
        </div>
      </Modal>
      <Button
        loading={isLoadingMedia}
        disabled={url ? false : true}
        onClick={() => {
          if (url) {
            onClickViewMedia(type, url)
          }
        }}
      >
        ดูรูปภาพ
      </Button>
    </>
  )
}
