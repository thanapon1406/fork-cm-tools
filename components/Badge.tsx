import { Badge } from 'antd'
import React from 'react'
import styled from 'styled-components'
interface Props {
  badgeStatus?: string
  badgeText?: string
  customMapping?: CustomMapping | undefined
  size?: 'small' | 'large'
}

interface CustomMapping {
  status: 'success' | 'waiting' | 'error' | 'processing'
  text: string
}

function CustomBadge({
  badgeStatus = 'warning',
  badgeText = 'ดำเนินการ',
  customMapping = undefined,
}: Props): any {
  const badgeStatusMapping: any = {
    waiting: 'warning',
    success: 'success',
    cancel: 'error',
    void: 'error',
    refund: 'error',
    failed: 'error',
    error: 'error',
  }
  const orderStatusMapping: any = {
    waiting: 'ดำเนินการ',
    success: 'สำเร็จ',
    cancel: 'ยกเลิก',
    void: 'ยกเลิก',
    refund: 'ยกเลิก',
    error: 'ไม่สำเร็จ',
  }

  let status = badgeStatusMapping[badgeStatus] || 'warning'
  let text = orderStatusMapping[badgeText] || 'ดำเนินการ'

  if (customMapping) {
    status = badgeStatusMapping[customMapping.status]
    text = customMapping.text
  }

  return <Badge status={status} text={text}></Badge>
}

export default styled(CustomBadge)`
  .ant-badge-status-dot {
    position: relative;
    top: -1px;
    display: inline-block;
    width: ${(props) => (props.size === 'small' ? '12px' : '20px')};
    height: ${(props) => {
      return props.size === 'small' ? '12px' : '20px'
    }};
    vertical-align: middle;
    border-radius: 50%;
  }
`
