import { useState } from 'react'

export default function useViewImage() {
  const [isLoadingMedia, setIsLoadingMedia] = useState(false)
  const [mediaType, setMediaType] = useState('')
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

  return {
    onClickViewMedia,
    isShowMediaModal,
    setIsShowMediaModal,
    mediaType,
    mediaUrl,
    isLoadingMedia,
  }
}
