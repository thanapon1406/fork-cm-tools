import { deeplinkRoute } from '@/utils/deeplink'
import axios from 'axios'
import { isEmpty } from 'lodash'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { ReactElement, useEffect } from 'react'
interface Props {
  data: any
}

export default function ProductDeeplink({ data }: Props): ReactElement {
  const defalutPhoto = 'https://www.kitchenhub-th.com/assets/images/logo-kittchenhub.png'
  let { photo, title, id, description } = data
  if (title) {
    title = `${title} - Kitchen Hub ส่งอาหาร delivery ออนไลน์จากร้านอาหารดังใกล้บ้านคุณทั่วประเทศไทย`
  } else {
    title = `Kitchen Hub ส่งอาหาร delivery ออนไลน์จากร้านอาหารดังใกล้บ้านคุณทั่วประเทศไทย`
  }

  const Router = useRouter()
  const url: string = 'https://www.kitchenhub-th.com/'
  const fallbackToWeb = true

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
        <meta name="description" content={description} />
        <meta
          name="robots"
          content="noindex, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
        <meta property="og:locale" content="th_TH" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />

        <meta property="og:image" content={photo} />
        <meta property="og:image:width" content="2560" />
        <meta property="og:image:height" content="1138" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`${title} - Kitchen Hub ส่งอาหาร delivery ออนไลน์จากร้านอาหารดังใกล้บ้านคุณทั่วประเทศไทย`}
        />
        <meta name="twitter:description" content={description} />
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
  const { params, query } = context
  const { slug = '' } = params
  const { outlet = '' } = query
  const request = {
    id: slug,
    outlet_id: outlet,
  }

  const defaultDeeplink = {
    photo: 'https://www.kitchenhub-th.com/assets/images/logo-kittchenhub.png',
    title: 'Kitchen Hub ส่งอาหาร delivery ออนไลน์จากร้านอาหารดังใกล้บ้านคุณทั่วประเทศไทย',
    description: 'delivery ออนไลน์จากร้านอาหารดังใกล้บ้านคุณทั่วประเทศไทย',
    id: 0,
  }

  try {
    const host = process.env.POS_GRPC_API
    const result = await axios.post(host + '/product-service/product/FindProductsDeeplink', request)
    const { data = false } = result

    if (isEmpty(data) === false) {
      const {
        photo = defaultDeeplink.photo,
        name = { th: defaultDeeplink.title },
        description = { th: defaultDeeplink.description },
      } = data.data[0]
      const deeplink = {
        photo: photo,
        title: name?.th,
        description: description?.th,
        id: slug,
      }
      return { props: { data: deeplink } }
    }
    return { props: { data: defaultDeeplink } }
  } catch (error) {
    return { props: { data: defaultDeeplink } }
  }
}
