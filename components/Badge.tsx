import { Badge } from 'antd'
import React, { ReactElement } from 'react'
interface Props {
  badgeStatus?: string
  badgeText?: string
  customMapping?: CustomMapping | undefined
}

interface CustomMapping {
  status: 'success' | 'waiting' | 'error' | 'processing'
  text: string
}

export default function CustomBadge({
  badgeStatus = 'warning',
  badgeText = 'ดำเนินการ',
  customMapping = undefined,
}: Props): ReactElement {
  const badgeStatusMapping: any = {
    waiting: 'warning',
    success: 'success',
    cancel: 'error',
    void: 'error',
    refund: 'error',
    failed: 'error',
  }
  const orderStatusMapping: any = {
    waiting: 'ดำเนินการ',
    success: 'สำเร็จ',
    cancel: 'ยกเลิก',
    void: 'ยกเลิก',
    refund: 'ยกเลิก',
  }

  let status = badgeStatusMapping[badgeStatus] || 'warning'
  let text = orderStatusMapping[badgeText] || 'ดำเนินการ'

  if (customMapping) {
    status = badgeStatusMapping[customMapping.status]
    text = customMapping.text
  }

  return <Badge status={status} text={text}></Badge>
}
