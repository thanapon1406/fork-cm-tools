import Tag from '@/components/Tag'

export const statusMapping: any = {
  uploaded: <Tag type="warning">รอการตรวจสอบ</Tag>,
  approved: <Tag type="success">อนุมัติ</Tag>,
  're-approved': <Tag type="default">ขอเอกสารเพิ่มเติม</Tag>,
  rejected: <Tag type="error">ไม่อนุมัติ</Tag>,
}
