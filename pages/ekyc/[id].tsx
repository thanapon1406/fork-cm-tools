import Card from '@/components/Card'
import { statusMapping } from '@/components/ekyc/common'
import MainLayout from '@/layout/MainLayout'
import { Breadcrumb, Col, Row, Typography } from 'antd'
import { useRouter } from 'next/router'
import { ReactElement, useState } from 'react'
import EkycContainer from './container'
const { Title } = Typography

const EkycList = (): ReactElement => {
  const [status, setEkycStatus] = useState('')
  const router = useRouter()
  const { query } = router

  const { id } = query

  return (
    <MainLayout>
      <Title level={4}>อนุมัติการยืนยันตัวตนผ่านระบบ E-KYC</Title>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>อนุมัติการยืนยันตัวตนผ่านระบบ E-KYC</Breadcrumb.Item>
        <Breadcrumb.Item>ลงทะเบียนการยืนยันตัวตน</Breadcrumb.Item>
      </Breadcrumb>
      <Card>
        <Row style={{ padding: '16px' }} justify="end">
          <Col offset={2} span={6}>
            สถานะ {statusMapping[status]}
          </Col>
        </Row>
        <Row style={{ padding: '16px' }} justify="end">
          <Col offset={2} span={6}>
            การยืนยันตัวตน (E-KYC)
          </Col>
          <Col offset={2} span={6} />
          <Col offset={2} span={6}>
            สถานะการยืนยัน
          </Col>
        </Row>
        <EkycContainer id={id as string} setEkycStatus={setEkycStatus} />
      </Card>
    </MainLayout>
  )
}

export default EkycList
