import { Button as Buttons } from 'antd'
import React, { ReactElement } from 'react'
type sizeType = Parameters<typeof Buttons>[0]['size']
type ButtonType = Parameters<typeof Buttons>[0]['type']

interface Props {
  htmlType?: 'button' | 'submit' | 'reset' | undefined
  type?: ButtonType
  children: string | ReactElement
  icon?: ReactElement
  size?: sizeType
  block?: any
  style?: any
  onClick?: any
  loading?: boolean
  disabled?: boolean
  className?: string
  isDanger?: boolean
}

function Button({
  children,
  type = 'primary',
  htmlType,
  icon,
  size = 'middle',
  loading,
  disabled,
  className,
  isDanger = false,
  ...Props
}: Props): ReactElement {
  return (
    <Buttons
      disabled={disabled}
      loading={loading}
      {...Props}
      type={type}
      htmlType={htmlType}
      icon={icon}
      size={size}
      className={className}
      danger={isDanger}
    >
      {children}
    </Buttons>
  )
}

export default Button
