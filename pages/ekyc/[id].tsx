import Card from '@/components/Card'
import MainLayout from '@/layout/MainLayout'
import { Breadcrumb, Col, Row, Typography } from 'antd'
import { useRouter } from 'next/router'
import { ReactElement } from 'react'
import EkycContainer from './container'
const { Title } = Typography

const EkycList = (): ReactElement => {
  const router = useRouter()
  const { query } = router

  const { id } = query

  return (
    <MainLayout>
      <Title level={4}>อนุมัติการยินยันตัวตนผ่านระบบ E-KYC</Title>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>อนุมัติการยินยันตัวตนผ่านระบบ E-KYC</Breadcrumb.Item>
        <Breadcrumb.Item>ลงทะเบียนการยินยันตัวตน</Breadcrumb.Item>
      </Breadcrumb>
      <Card>
        <Row style={{ padding: '16px' }} justify="end">
          <Col offset={2} span={6}>
            การยืนยันตัวตน (E-KYC)
          </Col>
          <Col offset={2} span={6} />
          <Col offset={2} span={6}>
            สถานะการยืนยัน
          </Col>
        </Row>
        <EkycContainer sso_id={id as string} />
      </Card>
    </MainLayout>
  )
}

export default EkycList
