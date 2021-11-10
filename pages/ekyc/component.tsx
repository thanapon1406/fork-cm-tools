import { EkycDetailProps } from '@/interface/ekyc'
import { DownOutlined, UpOutlined } from '@ant-design/icons'
import { Col, Collapse, Row, Typography } from 'antd'
import { ReactElement, useState } from 'react'
import EkycContainer from './container'
import CustomPanel from './style'

const { Title } = Typography

const statusMapping: any = {
  uploaded: 'รอการอนุมัติ',
  approved: 'อนุมัติ',
  're-approved': 'ขอเอกสารเพิ่มเติม',
  rejected: 'ไม่อนุมัติ',
}

const EkycComponent = ({ sso_id }: EkycDetailProps): ReactElement => {
  const [ekycStatus, setEkycStatus] = useState<string>('')

  return (
    <Collapse
      expandIcon={({ isActive }) => {
        return isActive ? (
          <UpOutlined
            style={{
              margin: 'auto',
              textAlign: 'center',
              fontSize: 18,
              fontWeight: 'bold',
              color: '#ffff',
            }}
          />
        ) : (
          <DownOutlined
            style={{
              margin: 'auto',
              textAlign: 'center',
              fontSize: 18,
              fontWeight: 'bold',
              color: '#ffff',
            }}
          />
        )
      }}
      expandIconPosition="right"
      defaultActiveKey={['1']}
    >
      <CustomPanel
        status={ekycStatus}
        header={
          <Row justify="space-between">
            <Col md={6} span={8}>
              <Title level={3} style={{ color: '#fffff' }}>
                {`การยืนยันตัวตน (E-KYC)`}
              </Title>
            </Col>
            <Col md={6} span={8} />
            <Col md={6} span={8}>
              <Title level={3} style={{ color: '#fffff' }}>
                {statusMapping[ekycStatus]}
              </Title>
            </Col>
          </Row>
        }
        key="1"
      >
        <Row style={{ padding: '16px' }} justify="end">
          <Col offset={2} span={6}>
            การยืนยันตัวตน (E-KYC)
          </Col>
          <Col offset={2} span={6} />
          <Col offset={2} span={6}>
            สถานะการยืนยัน
          </Col>
        </Row>
        <EkycContainer sso_id={sso_id} setEkycStatus={setEkycStatus} />
      </CustomPanel>
    </Collapse>
  )
}

export default EkycComponent
