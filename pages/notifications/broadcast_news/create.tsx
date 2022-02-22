import Card from '@/components/Card'
import MainLayout from '@/layout/MainLayout'
import { Breadcrumb, Col, Row, Typography } from 'antd'
import { ReactElement } from 'react'

const { Title } = Typography


const NotificationsBroadcastNews = (): ReactElement => {


  return (
    <MainLayout>
      <Row justify="space-around" align="middle">
        <Col span={8}>
          <Title level={4}>Broadcast News</Title>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Notifications</Breadcrumb.Item>
            <Breadcrumb.Item>Create Broadcast News </Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col span={8} offset={8} style={{ textAlign: 'end' }}>
          {/* <Button
            style={{ width: '120px', marginLeft: '10px' }}
            type="primary"
            isDanger={true}
            size="middle"
          // orderStatusHistory
          // disabled={isCancelRider}
          // onClick={() => fetchcancelRider(id)}
          >
            ยกเลิกไรเดอร์
          </Button> */}
        </Col>
      </Row>
      <Card>
        <h4>NotificationsBroadcastNews List</h4>
      </Card>
    </MainLayout>
  )
}


export default NotificationsBroadcastNews