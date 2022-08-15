export const merchantTestOption = [
  {
    name: 'ร้านทดสอบ',
    value: true,
  },
  {
    name: 'ร้านทั่วไป',
    value: false,
  },
]

export const autoCallRiderOption = [
  {
    name: 'ทั้งหมด',
    value: '',
  },
  {
    name: 'เปิด',
    value: 'true',
  },
  {
    name: 'ปิด',
    value: 'false',
  },
]


export const orderStatus = [
  {
    name: 'ทุกสถานะ',
    value: '',
  },
  {
    name: 'รอรับออเดอร์',
    value: 'waiting',
  },
  {
    name: 'รอการจ่ายเงิน',
    value: 'waiting_payment',
  },
  {
    name: 'ยืนยันการจ่ายเงิน',
    value: 'confirm_payment',
  },
  {
    name: 'กำลังปรุง',
    value: 'cooking',
  },
  {
    name: 'ปรุงสำเร็จ',
    value: 'cooked',
  },
  {
    name: 'กำลังจัดส่ง',
    value: 'picked_up',
  },
  {
    name: 'จัดส่งแล้ว',
    value: 'arrived',
  },
  {
    name: 'กำลังค้นหาคนขับ',
    value: 'assigning',
  },
  {
    name: 'คนขับกำลังไปที่ร้าน',
    value: 'assigned',
  },
  {
    name: 'สำเร็จ',
    value: 'success',
  },
  {
    name: 'ยกเลิก',
    value: 'cancel',
  },
]

export const merchantStatus = [
  {
    name: 'ทุกสถานะ',
    value: '',
  },
  {
    name: 'รอรับออเดอร์',
    value: 'waiting',
  },
  {
    name: 'เตรียมรับออเดอร์',
    value: 'prepare_order',
  },
  {
    name: 'รับออเดอร์',
    value: 'accept_order',
  },
  {
    name: 'ยืนยันการชำระเงิน',
    value: 'confirm_payment',
  },
  {
    name: 'กำลังปรุง',
    value: 'cooking',
  },
  {
    name: 'ปรุงสำเร็จ',
    value: 'cooked',
  },
  {
    name: 'สำเร็จ',
    value: 'success',
  },
  {
    name: 'ยกเลิก',
    value: 'cancel',
  },
  {
    name: 'ยกเลิก (ไรเดอร์ไม่รับงาน)',
    value: 'rider_reject',
  },
  {
    name: 'ยกเลิกโดยลูกค้า',
    value: 'consumer_reject',
  },
]

export const riderStatus = [
  {
    name: 'ทุกสถานะ',
    value: '',
  },
  {
    name: 'รอเรียกไรเดอร์',
    value: 'waiting',
  },
  {
    name: 'กำลังเรียกไรเดอร์',
    value: 'assigning',
  },
  {
    name: 'ไรเดอร์รับงาน',
    value: 'assigned',
  },
  {
    name: 'กำลังไปที่ร้านอาหาร',
    value: 'going_merchant',
  },
  {
    name: 'รอรับอาหาร',
    value: 'picking_up',
  },
  {
    name: 'กำลังจัดส่ง',
    value: 'picked_up',
  },
  {
    name: 'จัดส่งแล้ว',
    value: 'arrived',
  },
  {
    name: 'สำเร็จ',
    value: 'success',
  },
  {
    name: 'ยกเลิก',
    value: 'cancel',
  },
]

export const riderPartnerTypeOption = [
  {
    name: 'ทุกประเภท',
    value: '',
  },
  {
    name: 'Lalamove',
    value: 'LALAMOVE',
  },
  {
    name: 'PandaGo',
    value: 'PANDAGO',
  },
]

export const riderTypeOption = [
  {
    name: 'ทุกประเภท',
    value: '',
  },
  {
    name: 'Default Rider',
    value: 'outlet',
  },
  {
    name: 'Partner',
    value: 'partner',
  },
]

export const paymentChannelOption = [
  {
    name: 'ทุกช่องทาง',
    value: '',
  },
  {
    name: 'เงินสด',
    value: 'PAYMENT_CASH',
  },
  {
    name: 'พร้อมเพย์',
    value: 'PAYMENT_PROMTPAY',
  },
  {
    name: 'บัตรเครดิต',
    value: 'PAYMENT_CREDIT',
  },
  {
    name: 'ชำระผ่านบัญชีธนาคาร',
    value: 'PAYMENT_BANK_TRANSFER',
  },
]
