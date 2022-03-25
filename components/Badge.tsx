import { Badge } from 'antd'
import React from 'react'
import styled from 'styled-components'
interface Props {
  badgeStatus?: string
  badgeText?: string
  customMapping?: CustomMapping | undefined
  size?: 'small' | 'default'
}

const Badges = styled(Badge)`
  .ant-badge-status-dot {
    position: relative;
    top: -1px;
    display: inline-block;
    width: ${(props) => {
      return props.size === 'small' ? '9px' : '12px !important'
    }};
    height: ${(props) => {
      return props.size === 'small' ? '9px' : '12px !important'
    }};
    vertical-align: middle;
    border-radius: 50%;
  }
`

interface CustomMapping {
  status: 'success' | 'waiting' | 'error' | 'processing'
  text: string
}

const CustomBadge = ({
  badgeStatus = 'warning',
  badgeText = 'ดำเนินการ',
  customMapping = undefined,
  size = 'small',
}: Props): any => {
  const badgeStatusMapping: any = {
    waiting: 'warning',
    success: 'success',
    cancel: 'error',
    void: 'error',
    refund: 'error',
    failed: 'error',
    error: 'error',
    disable: 'default',
    uploading: 'cyan',
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

  return <Badges status={status} text={text} size={size}></Badges>
}

export default CustomBadge
