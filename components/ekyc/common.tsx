import Tag from '@/components/Tag'
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons'

export const statusMapping: any = {
  uploaded: (
    <Tag icon={<ClockCircleOutlined />} type="warning">
      รอการตรวจสอบ
    </Tag>
  ),
  approved: (
    <Tag icon={<CheckCircleOutlined />} type="success">
      อนุมัติ
    </Tag>
  ),
  're-approved': (
    <Tag icon={<SyncOutlined />} type="default">
      ขอเอกสารเพิ่มเติม
    </Tag>
  ),
  rejected: (
    <Tag icon={<CloseCircleOutlined />} type="error">
      ไม่อนุมัติ
    </Tag>
  ),
}
