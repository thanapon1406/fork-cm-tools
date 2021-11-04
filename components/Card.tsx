import React, { ReactElement } from 'react'

interface Props {
  children: any
  minHeight?: number
  marginBottom?: number
}

export default function Card({ children, minHeight, marginBottom }: Props): ReactElement {
  return (
    <div
      className="site-layout-background"
      style={{
        padding: 24,
        minHeight: minHeight || 160,
        marginBottom: marginBottom || 36,
        overflow: 'scroll',
      }}
    >
      {children}
    </div>
  )
}
