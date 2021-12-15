import { downloadImage } from '@/services/cdn'
import { useState } from 'react'

export default function useViewImage() {
  const [isLoadingMedia, setIsLoadingMedia] = useState(false)
  const [mediaType, setMediaType] = useState('image')
  const [mediaUrl, setMediaUrl] = useState('')
  const [isShowMediaModal, setIsShowMediaModal] = useState(false)
  const onClickViewMedia = async (type: string, pathUrl: string) => {
    setIsLoadingMedia(true)
    setMediaType(type)
    const payload = {
      type: type,
      pathUrl: pathUrl,
    }
    const url = pathUrl
    setMediaUrl(url)
    setIsLoadingMedia(false)
    setIsShowMediaModal(true)
  }

  const onClickViewMediaPrivateBucket = async (type: string, pathUrl: string) => {
    setIsLoadingMedia(true)
    const payload = {
      filepath: pathUrl,
    }
    setMediaType(type)
    const res = await downloadImage(payload)
    const url = URL.createObjectURL(res)
    setMediaUrl(url)
    setIsLoadingMedia(false)
    setIsShowMediaModal(true)
  }

  return {
    onClickViewMedia,
    onClickViewMediaPrivateBucket,
    isShowMediaModal,
    setIsShowMediaModal,
    mediaType,
    mediaUrl,
    isLoadingMedia,
  }
}
