import { deeplinkRoute } from '@/utils/deeplink'
import axios from 'axios'
import { isEmpty } from 'lodash'
import Head from 'next/head'
import React, { ReactElement, useEffect } from 'react'
interface Props {
  data: any
}

export default function ServerSide({ data }: Props): ReactElement {
  const defalutPhoto = 'https://www.kitchenhub-th.com/assets/images/logo-kittchenhub.png'
  let { photo = defalutPhoto, title, id } = data
  if (title) {
    title = `${title} - Kitchen Hub ส่งอาหาร delivery ออนไลน์จากร้านอาหารดังใกล้บ้านคุณทั่วประเทศไทย`
  } else {
    title = `Kitchen Hub ส่งอาหาร delivery ออนไลน์จากร้านอาหารดังใกล้บ้านคุณทั่วประเทศไทย`
  }

  useEffect(() => {
    if (id) {
      if (typeof window !== 'undefined') {
        deeplinkRoute(id)
      }
    }
  }, [id])

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
        <meta property="og:title" content={title} />
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

  if (isEmpty(data) === false) {
    const { photo = defaultDeeplink.photo, name = { th: defaultDeeplink.title } } = data.data
    const deeplink = {
      photo: photo,
      title: name?.th,
      id: slug,
    }
    return { props: { data: deeplink } }
  }

  return { props: { data: {} } }
}
