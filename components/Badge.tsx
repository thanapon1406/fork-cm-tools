import { Badge } from 'antd'
import React, { ReactElement } from 'react'

interface Props {
  badgeStatus: string
  badgeText: string
}

export default function CustomBadge({ badgeStatus, badgeText }: Props): ReactElement {
  const badgeStatusMapping: any = {
    waiting: 'warning',
    success: 'success',
    cancel: 'error',
    void: 'error',
    refund: 'error',
  }
  const orderStatusMapping: any = {
    waiting: 'ดำเนินการ',
    success: 'สำเร็จ',
    cancel: 'ยกเลิก',
    void: 'ยกเลิก',
    refund: 'ยกเลิก',
  }

  const status = badgeStatusMapping[badgeStatus] || 'warning'
  const text = orderStatusMapping[badgeText] || 'ดำเนินการ'

  return <Badge status={status} text={text}></Badge>
}
