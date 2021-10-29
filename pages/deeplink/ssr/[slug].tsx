import axios from 'axios'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { ReactElement, useEffect } from 'react'
import { isMobile } from 'react-device-detect'
interface Props {
  data: any
}

export default function ServerSide({ data }: Props): ReactElement {
  const { photo, title, id } = data
  const Router = useRouter()
  const url: string = 'https://www.kitchenhub-th.com/'
  const fallbackToWeb = true
  console.log(`data`, data)
  console.log(`this 1`)
  useEffect(() => {
    console.log(`this 2`, id)
    if (id) {
      console.log(`this 3`)
      if (typeof window !== 'undefined') {
        deepRoute()
      }
    }
  }, [id])

  const deepRoute = () => {
    console.log(`window`, window)
    const deeplink = require('browser-deeplink')
    const URI = 'robinhoodth://merchantlanding/id/85804'
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
    if (isMobile) {
      if (id) {
        deeplink.open(URI)
      }
    } else if (url) {
      Router.replace(url)
    }
  }

  return (
    <div>
      <Head>
        <title>{title}</title>
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
          content={`${title} - Kitchen Hub ส่งอาหาร delivery ออนไลน์จากร้านอาหารดังใกล้บ้านคุณทั่วประเทศไทย`}
        />
        <meta
          property="og:description"
          content="ทางเลือกใหม่ในการสั่งอาหาร หรือ Food Delivery ที่จะพาร้านอาหาร ขึ้นชื่อ พร้อมเมนูแสนอร่อยที่มีคนกล่าวถึงในจังหวัดต่างๆ ทั่วประเทศมาส่งตรงถึงหน้าบ้านคุณ ในราคาที่จับต้องได้ สะดวก และรวดเร็ว"
        />

        <meta property="og:image" content={photo} />
        <meta property="og:image:width" content="2560" />
        <meta property="og:image:height" content="1138" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`${title} - Kitchen Hub ส่งอาหาร delivery ออนไลน์จากร้านอาหารดังใกล้บ้านคุณทั่วประเทศไทย`}
        />
        <meta
          name="twitter:description"
          content="ทางเลือกใหม่ในการสั่งอาหาร หรือ Food Delivery ที่จะพาร้านอาหาร ขึ้นชื่อ พร้อมเมนูแสนอร่อยที่มีคนกล่าวถึงในจังหวัดต่างๆ ทั่วประเทศมาส่งตรงถึงหน้าบ้านคุณ ในราคาที่จับต้องได้ สะดวก และรวดเร็ว"
        />
        <meta name="twitter:image" content={photo} />
        <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta
          name="viewport"
          content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1"
        />
      </Head>
    </div>
  )
}

export async function getServerSideProps(context: any) {
  const { params } = context
  const { slug = '' } = params
  const request = {
    id: slug,
  }

  const host = process.env.POS_GRPC_API
  const result = await axios.post(host + '/merchant-service/Outlet/OutletDeeplink', request)
  const { data = false } = result
  const defaultDeeplink = {
    photo: 'https://www.kitchenhub-th.com/assets/images/logo-kittchenhub.png',
    title: 'Kitchen Hub ส่งอาหาร delivery ออนไลน์จากร้านอาหารดังใกล้บ้านคุณทั่วประเทศไทย',
    id: 0,
  }

  if (data) {
    const { photo = defaultDeeplink.photo, name = { th: defaultDeeplink.title }, id } = data.data
    const deeplink = {
      photo: photo,
      title: name?.th,
      id: id,
    }
    return { props: { data: deeplink } }
  }

  return { props: { data: defaultDeeplink } }
}
