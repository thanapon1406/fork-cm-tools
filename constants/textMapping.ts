export const days: any = {
  sun: 'วันอาทิตย์',
  mon: 'วันจันทร์',
  tue: 'วันอังคาร',
  wed: 'วันพุธ',
  thu: 'วันพฤหัสบดี',
  fri: 'วันศุกร์',
  sat: 'วันเสาร์',
}

export const outletStatus: any = {
  active: 'Active',
  inactive: 'In-active',
  closed: 'Closed',
  temporarily_closed: 'Temporarily closed',
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
    text: 'Refund',
    status: 'waiting',
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
