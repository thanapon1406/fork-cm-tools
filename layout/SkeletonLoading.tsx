import Card from '@/components/Card'
import { LoadingOutlined } from '@ant-design/icons'
import { Col, Row, Skeleton, Spin } from 'antd'
import React, { ReactElement } from 'react'

interface Props {}

export default function SkeletonLoading({}: Props): ReactElement {
  const antIcon = <LoadingOutlined style={{ fontSize: 50 }} spin />

  return (
    <>
      <Row justify="space-around" align="middle">
        <Col span={12}>
          <Skeleton active paragraph={{ rows: 1 }} />
        </Col>
        <Col span={12}></Col>
      </Row>

      <Card minHeight={600}>
        {/* <Skeleton active paragraph={{ rows: 3 }} /> */}
        <div
          style={{
            width: '100%',
            height: '550px',
            padding: '200px',
            textAlign: 'center',
          }}
        >
          <Spin indicator={antIcon} size="large" />
        </div>
      </Card>
    </>
  )
}
