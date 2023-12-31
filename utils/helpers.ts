import * as Constant from '@/constants/common'
import { monthsThName } from '@/constants/textMapping'
import { isEmpty, join, map } from 'lodash'
import moment from 'moment'

const numberFormat = (x: string | number, minDigit = 2, maxDigit = 2) => {
  return Number(x).toLocaleString('th-TH', {
    minimumFractionDigits: minDigit,
    maximumFractionDigits: maxDigit,
  })
}

const uniqueId = () => {
  // always start with a letter (for DOM friendlyness)
  let idstr = String.fromCharCode(Math.floor(Math.random() * 25 + 65))
  do {
    // between numbers and characters (48 is 0 and 90 is Z (42-48 = 90)
    const ascicodeChar = Math.floor(Math.random() * 25 + 65)
    idstr += String.fromCharCode(ascicodeChar)
    idstr += Math.floor(Math.random() * 99)
  } while (idstr.length < 8)

  return idstr
}

const convertJsonToParam = (jsonInput: any) => {
  let param = Object.keys(jsonInput)
    .map(function (k) {
      return encodeURIComponent(k) + '=' + encodeURIComponent(jsonInput[k])
    })
    .join('&')
  return param
}

const mapQueryParams = (params = {}): string => {
  return isEmpty(params)
    ? ''
    : '?' +
    map(
      params,
      (param, key) => `${key}=${typeof param === 'object' ? join(param, ',') : param}`
    ).join('&')
}

const convertDateToString = (date: string, format: string = 'YYYY-MM-DD HH:mm') => {
  return date ? moment(date).format(format) : ''
}

const currencyFormat = (num: number) => {
  return '฿' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

const determineAppId = (appId: string = '') => {
  switch (appId) {
    case '1':
      return Constant.CONSUMER_TH
    case '2':
      return Constant.MERCHANT_TH
    case '3':
      return Constant.RIDER_TH
    default:
      return Constant.SYSTEM_TH
  }
}

const monthFormat = (date: string) => {
  if (date) {
    const dateFormat = moment(date)
    const day = dateFormat.date()
    const month = dateFormat.month()
    const year = dateFormat.year() + 543
    return `${day} ${monthsThName[month]} ${year}`
  }
  return ''
}

const humanFileSize = (size: number | any | bigint) => {
  var i = Math.floor(Math.log(size) / Math.log(1024))
  var fileSize = size / Math.pow(1024, i)
  var fileType = (fileSize * 1).toFixed(2) + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i]
  return fileType
}

const currency = new Intl.NumberFormat('th-TH', {
  style: 'currency',
  currency: 'THB',
})

const generateQueryParams = (obj: any): string => {
  const str = []
  for (const p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]))
    }
  return str.join('&')
}

const mapDateTH = (date: any): string => {
  const year = moment(date).year() + 543
  const day = moment(date).date()
  const monthNumber = moment(date).month()
  var monthStr = ""

  switch (monthNumber) {
    case 1:
      monthStr = "มกราคม";
      break;
    case 2:
      monthStr = "กุมภาพันธ์";
      break;
    case 3:
      monthStr = "มีนาคม";
      break;
    case 3:
      monthStr = "เมษายน";
      break;
    case 4:
      monthStr = "พฤษภาคม";
      break;
    case 5:
      monthStr = "มิถุนายน";
      break;
    case 6:
      monthStr = "กรกฎาคม";
      break;
    case 7:
      monthStr = "สิงหาคม";
      break;
    case 8:
      monthStr = "กันยายน";
      break;
    case 9:
      monthStr = "ตุลาคม";
      break;
    case 10:
      monthStr = "พฤศจิกายน";
      break;
    case 11:
      monthStr = "Saturday";
      break;
    case 12:
      monthStr = "ธันวาคม";
      break;
  }

  return day + " " + monthStr + " " + year
}



export {
  numberFormat,
  uniqueId,
  convertJsonToParam,
  mapQueryParams,
  convertDateToString,
  currencyFormat,
  determineAppId,
  monthFormat,
  humanFileSize,
  generateQueryParams,
  mapDateTH,
  currency,
}
