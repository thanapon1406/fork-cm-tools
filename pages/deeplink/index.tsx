import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { ReactElement, useEffect } from 'react'
import { isMobile } from 'react-device-detect'
interface Props {}

export default function Deeplink({}: Props): ReactElement {
  const Router = useRouter()
  const { query } = Router
  const { URI } = query
  const url: string = 'https://www.kitchenhub-th.com/'
  const fallbackToWeb = true
  console.log(`this 1`)
  useEffect(() => {
    console.log(`this 2`, URI)
    if (URI) {
      console.log(`this 3`)
      if (typeof window !== 'undefined') {
        deepRoute()
      }
    }
  }, [URI])

  const deepRoute = () => {
    console.log(`window`, window)
    const deeplink = require('browser-deeplink')

    deeplink.setup({
      iOS: {
        storeUrl: 'itms-apps://itunes.apple.com/app/id1526791835?mt=8',
        fallbackWebUrl: url,
      },
      android: {
        appId: 'th.in.robinhood',
        storeUrl: null,
        fallbackWebUrl: url,
      },
      fallback: true,
      fallbackToWeb: fallbackToWeb,
    })
    console.log(`deeplink`, deeplink)
    console.log(`isMobile`, isMobile)
    if (isMobile) {
      if (URI) {
        deeplink.open(URI)
      }
    } else if (url) {
      Router.replace(url)
    }
  }

  return (
    <div>
      <Head>
        <title>Kitchen Hub ส่งอาหาร delivery ออนไลน์จากร้านอาหารดังใกล้บ้านคุณทั่วประเทศไทย</title>
        <meta
          name="description"
          content="ทางเลือกใหม่ในการสั่งอาหาร หรือ Food Delivery ที่จะพาร้านอาหาร ขึ้นชื่อ พร้อมเมนูแสนอร่อยที่มีคนกล่าวถึงในจังหวัดต่างๆ ทั่วประเทศมาส่งตรงถึงหน้าบ้านคุณ ในราคาที่จับต้องได้ สะดวก และรวดเร็ว"
        />
        <meta
          name="robots"
          content="noindex, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
        <meta property="og:locale" content="th_TH" />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Kitchen Hub ส่งอาหาร delivery ออนไลน์จากร้านอาหารดังใกล้บ้านคุณทั่วประเทศไทย"
        />
        <meta
          property="og:description"
          content="ทางเลือกใหม่ในการสั่งอาหาร หรือ Food Delivery ที่จะพาร้านอาหาร ขึ้นชื่อ พร้อมเมนูแสนอร่อยที่มีคนกล่าวถึงในจังหวัดต่างๆ ทั่วประเทศมาส่งตรงถึงหน้าบ้านคุณ ในราคาที่จับต้องได้ สะดวก และรวดเร็ว"
        />
        <meta property="og:url" content="http://150.95.80.232/" />
        <meta property="og:site_name" content="Robinhood" />
        <meta property="article:modified_time" content="2020-12-01T12:31:13+00:00" />
        <meta
          property="og:image"
          content="https://www.kitchenhub-th.com/assets/images/logo-kittchenhub.png"
        />
        <meta property="og:image:width" content="2560" />
        <meta property="og:image:height" content="1138" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Kitchen Hub ส่งอาหาร delivery ออนไลน์จากร้านอาหารดังใกล้บ้านคุณทั่วประเทศไทย"
        />
        <meta
          name="twitter:description"
          content="ทางเลือกใหม่ในการสั่งอาหาร หรือ Food Delivery ที่จะพาร้านอาหาร ขึ้นชื่อ พร้อมเมนูแสนอร่อยที่มีคนกล่าวถึงในจังหวัดต่างๆ ทั่วประเทศมาส่งตรงถึงหน้าบ้านคุณ ในราคาที่จับต้องได้ สะดวก และรวดเร็ว"
        />
        <meta
          name="twitter:image"
          content="https://www.kitchenhub-th.com/assets/images/logo-kittchenhub.png"
        />
        <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta
          name="viewport"
          content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1"
        />
      </Head>
    </div>
  )
}
