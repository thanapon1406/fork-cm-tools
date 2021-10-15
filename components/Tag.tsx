import { Tag as Tags } from 'antd'
import React, { ReactElement } from 'react'

interface Props {
  type?: string
  children: string | ReactElement
}

export default function Tag({ children, type = 'primary' }: Props): ReactElement {
  const mapping: any = {
    primary: '#17c2d7',
    success: 'success',
    error: 'error',
    warning: 'warning',
  }
  const color = mapping[type] || type
  return <Tags color={color}>{children}</Tags>
}
