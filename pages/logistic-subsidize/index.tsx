import Button from '@/components/Button'
import MainLayout from '@/layout/MainLayout'
import { Breadcrumb, Col, Row, Typography } from 'antd'
import { useRouter } from 'next/router'
import React, { ReactElement, useEffect } from 'react'

const { Title } = Typography

interface Props { }

export default function LogisticSubsidize({ }: Props): ReactElement {
  const Router = useRouter()

  useEffect(() => {
  }, [])

  return (
    <MainLayout>
      <Row>
        <Col span={8}>
          <Title level={4}>LS Logic</Title>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>LS Logic</Breadcrumb.Item>
            <Breadcrumb.Item>สร้าง LS Logic</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col span={8} offset={8} style={{ textAlign: 'end' }}>
          <Button
            style={{ width: '150px' }}
            type="primary"
            size="middle"
            onClick={() => {
              Router.push('/logistic-subsidize/create', `/logistic-subsidize/create`);
            }}
          >
            สร้าง LS Logic +
          </Button>
        </Col>
      </Row>
    </MainLayout>
  )
}