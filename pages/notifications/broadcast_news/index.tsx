import Button from '@/components/Button'
import Card from '@/components/Card'
import MainLayout from '@/layout/MainLayout'
import { Breadcrumb, Col, Row, Typography } from 'antd'
import { useRouter } from 'next/router'
import { ReactElement } from 'react'

const { Title } = Typography


const NotificationsBroadcastNews = (): ReactElement => {
  const Router = useRouter()

  return (
    <MainLayout>
      <Row justify="space-around" align="middle">
        <Col span={8}>
          <Title level={4}>Notifications</Title>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Notifications</Breadcrumb.Item>
            <Breadcrumb.Item>List Broadcast News</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col span={8} offset={8} style={{ textAlign: 'end' }}>
          <Button
            style={{ width: '120px' }}
            type="primary"
            size="middle"
            onClick={() => {
              Router.push('/notifications/broadcast_news/create', `/notifications/broadcast_news/create`);
            }}
          >
            ตั้งค่า
          </Button>
        </Col>
      </Row>
      <Card>
        <h4>NotificationsBroadcastNews List</h4>
      </Card>
    </MainLayout >
  )
}


export default NotificationsBroadcastNews