import { isEmpty, join, map } from 'lodash'
const numberFormat = (x: string | number) => {
  return Number(x).toLocaleString()
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

export { numberFormat, uniqueId, convertJsonToParam, mapQueryParams }
