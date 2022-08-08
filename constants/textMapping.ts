export const days: any = {
  sun: 'วันอาทิตย์',
  mon: 'วันจันทร์',
  tue: 'วันอังคาร',
  wed: 'วันพุธ',
  thu: 'วันพฤหัสบดี',
  fri: 'วันศุกร์',
  sat: 'วันเสาร์',
}

export const monthsThName = [
  'มกราคม',
  'กุมภาพันธ์',
  'มีนาคม',
  'เมษายน',
  'พฤษภาคม',
  'มิถุนายน',
  'กรกฎาคม',
  'สิงหาคม',
  'กันยายน',
  'ตุลาคม',
  'พฤศจิกายน',
  'ธันวาคม',
]

export const outletStatus: any = {
  active: 'ดำเนินกิจการ',
  inactive: 'In-active',
  closed: 'ปิดกิจการ',
  temporarily_closed: 'ปิดปรับปรุง',
}

export const outletStatusTH: any = {
  active: {
    text: 'ดำเนินกิจการ',
    status: 'success',
  },
  inactive: {
    text: 'inactive',
    status: 'error',
  },
  closed: {
    text: 'ปิดกิจการ',
    status: 'error',
  },
  temporarily_closed: {
    text: 'ปิดปรับปรุง',
    status: 'waiting',
  },
}

export const creditPaymentChanel: any = {
  qr_payment: 'QR Code',
  bank_transfer: 'บัญชีธนาคาร',
  credit_card: 'บัตรเครดิต',
  free_credit: 'Welcome Credit',
}

export const creditStatus: any = {
  processing: {
    text: 'รอการยืนยัน',
    status: 'waiting',
  },
  success: {
    text: 'สำเร็จ',
    status: 'success',
  },
  failed: {
    text: 'ไม่สำเร็จ',
    status: 'failed',
  },
  refund: {
    text: 'คืนเงิน',
    status: 'waiting',
  },
  cancel: {
    text: 'ยกเลิก',
    status: 'failed',
  },
  uploaded_slip: {
    text: 'อัพโหลดสลิป',
    status: 'uploading',
  },
}

export const verifyStatusMapping: any = {
  approved: 'อนุมัติ',
  rejected: 'ไม่อนุมัติ',
}

export const deliveryInfo: any = {
  outlet: 'Default rider',
  partner: 'Partner',
}

export const onlineStatus: any = {
  online: 'ร้านเปิด',
  offline: 'ร้านปิด',
}

export const onlineStatusTag: any = {
  online: {
    text: 'ร้านเปิด',
    status: 'success',
  },
  offline: {
    text: 'ร้านปิด',
    status: 'error',
  },
}

export const userServiceType: any = {
  pos: 'CMS',
  delivery: 'Merchant App',
}

export const outletType: any = {
  single: 'สาขาเดี่ยว',
  multiple: 'หลายสาขา',
}

export const riderType: any = {
  outlet: 'จัดส่งโดยร้านค้า',
  partner: 'จัดส่งโดยพาร์ทเนอร์',
}

export const isBanText: any = {
  ban: {
    text: 'ถูกแบน',
    status: 'error',
  },
  normal: {
    text: 'ปกติ',
    status: 'success',
  },
}

export const userStatus: any = {
  active: {
    text: 'Active',
    status: 'success',
  },
  inactive: {
    text: 'Inactive',
    status: 'disable',
  },
}

export const creditUsed: any = {
  gross_profit: 'ค่าดำเนินการ',
  delivery_fee: 'ค่าจัดส่ง',
}

export const paymentChannel: any = {
  PAYMENT_CASH: 'เงินสด',
  PAYMENT_PROMTPAY: 'พร้อมเพย์',
  PAYMENT_CREDIT: 'บัตรเครดิต',
  PAYMENT_BANK_TRANSFER: 'ชำระผ่านบัญชีธนาคาร',
}

export const orderStatusMapping: any = {
  waiting: 'รอรับออเดอร์',
  waiting_payment: 'รอการจ่ายเงิน',
  confirm_payment: 'ยืนยันการจ่ายเงิน',
  cooking: 'กำลังปรุง',
  cooked: 'ปรุงสำเร็จ',
  picked_up: 'กำลังจัดส่ง',
  arrived: 'จัดส่งแล้ว',
  success: 'สำเร็จ',
  cancel: 'ยกเลิก',
}

export const riderStatusMapping: any = {
  waiting: 'รอเรียกไรเดอร์',
  assigning: 'กำลังเรียกไรเดอร์',
  assigned: 'ไรเดอร์รับงาน',
  going_merchant: 'กำลังไปที่ร้านอาหาร',
  picking_up: 'รอรับอาหาร',
  picked_up: 'กำลังจัดส่ง',
  arrived: 'จัดส่งแล้ว',
  success: 'สำเร็จ',
  cancel: 'ยกเลิก',
}

export const merchantStatusMappingAutoCash: any = {
  prepare_order: 'รอรับออเดอร์',
  rider_reject: 'ยกเลิก',
  consumer_reject: 'ยกเลิกโดยลูกค้า',
  waiting: 'รอรับออเดอร์',
  accept_order: 'รับออเดอร์',
  cancel: 'ยกเลิก',
  cooking: 'กำลังปรุง',
  cooked: 'ปรุงสำเร็จ',
  success: 'สำเร็จ'
}

export const merchantStatusMappingAutoTransfer: any = {
  prepare_order: 'รอรับออเดอร์',
  rider_reject: 'ยกเลิก',
  consumer_reject: 'ยกเลิกโดยลูกค้า',
  waiting: 'รอยืนยันการชำระเงิน',
  accept_order: 'รับออเดอร์',
  cancel: 'ยกเลิก',
  confirm_payment: 'ยืนยันการชำระเงิน',
  cooking: 'กำลังปรุง',
  cooked: 'ปรุงสำเร็จ',
  success: 'สำเร็จ',
}

export const merchantStatusMappingCloseCash: any = {
  waiting: 'รอรับออเดอร์',
  accept_order: 'รับออเดอร์',
  cancel: 'ยกเลิก',
  cooking: 'กำลังปรุง',
  cooked: 'ปรุงสำเร็จ',
  success: 'สำเร็จ',
}

export const merchantStatusMappingCloseTransfer: any = {
  waiting: 'รอรับออเดอร์',
  accept_order: 'รับออเดอร์',
  cancel: 'ยกเลิก',
  confirm_payment: 'ยืนยันการชำระเงิน',
  cooking: 'กำลังปรุง',
  cooked: 'ปรุงสำเร็จ',
  success: 'สำเร็จ',
}
