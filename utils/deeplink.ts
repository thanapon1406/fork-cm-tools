import Router from 'next/router'
import { isMobile } from 'react-device-detect'

const url: string = 'https://www.kitchenhub-th.com/'
const fallbackToWeb = true
const IOS_STORE_URL = 'itms-apps://itunes.apple.com/app/id1526791835?mt=8'
const ANDROID_APP_ID = 'th.in.robinhood'
let URI = 'robinhoodth://merchantlanding/id/85804'

export const deeplinkRoute = (param: any) => {
  const deeplink = require('browser-deeplink')
  deeplink.setup({
    iOS: {
      storeUrl: IOS_STORE_URL,
      fallbackWebUrl: url,
    },
    android: {
      appId: ANDROID_APP_ID,
      storeUrl: null,
      fallbackWebUrl: url,
    },
    fallback: true,
    fallbackToWeb: fallbackToWeb,
  })
  if (isMobile) {
    if (param) {
      deeplink.open(URI)
    }
  } else if (url) {
    Router.replace(url)
  }
}
