import { Tag as Tags } from 'antd'
import React, { ReactElement } from 'react'

interface Props {
  type?: string
  icon?: ReactElement
  children: string | ReactElement
}

export default function Tag({ children, icon, type = 'primary' }: Props): ReactElement {
  const mapping: any = {
    primary: '#17c2d7',
    success: 'success',
    error: 'error',
    warning: 'warning',
    waiting: 'warning',
    failed: 'error',
  }
  const color = mapping[type] || type
  return (
    <Tags icon={icon} color={color}>
      {children}
    </Tags>
  )
}
