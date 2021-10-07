import { ReactElement } from 'react'
export interface EkycDetail {
  id: string
  project_id: string
  app_id: string
  sso_id: string
  citizen_card_photo_url: string
  face_photo_url: string
  video_url: string
  status: string
  status_face: number
  status_card: number
  status_video: number
  first_name: string
  last_name: string
  wording: string
  remark: string
  createdAt: Date
  updatedAt: Date
}

export interface EkycDetailProps {
  sso_id: string
  isComponent: boolean
}

export interface EkycApproveStatusInterface {
  video_url?: string
  face_photo_url?: string
  citizen_card_photo_url?: string
  status_face?: number
  status_card?: number
  status_video?: number
  status?: string
}
