import axios from 'axios'
import Head from 'next/head'
import React, { ReactElement } from 'react'

interface Props {
  data: any
}

export default function ServerSide({ data }: Props): ReactElement {
  const { photo, title } = data
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
          content="Kitchen Hub ส่งอาหาร delivery ออนไลน์จากร้านอาหารดังใกล้บ้านคุณทั่วประเทศไทย"
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
          content="Kitchen Hub ส่งอาหาร delivery ออนไลน์จากร้านอาหารดังใกล้บ้านคุณทั่วประเทศไทย"
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
      <div>{title}</div>
    </div>
  )
}

export async function getServerSideProps(context: any) {
  const { params } = context
  const { slug = '' } = params
  const mockToken =
    'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiIxIiwiZXhwIjoxNjM1NTc3MDM4LCJqdGkiOiIwYmU0ZmZhYy1lYmZkLTQ2NzctYTk5Yy04Y2VkODI2YzcwYjEiLCJpYXQiOjE2MzU0OTA2MzgsImlzcyI6IkZ1bGwgVGVhbSBTbWFydCBQT1MiLCJuYmYiOjE2MzU0OTA2MzgsInN1YiI6IjMwMCIsImVtYWlsIjoiYWVzZEBhZXNkLmNvbSIsIm5hbWUiOiJBbnVrb29uIiwibGFzdF9uYW1lIjoiSml3Ym9vbiIsImltYWdlX3VybCI6InRlc3QiLCJ0eXBlIjoiY21zIiwicGVybWlzc2lvbnMiOm51bGwsImRhdGEiOnsiYnJhbmRfY29kZSI6IiIsImJyYW5kX2lkIjowLCJvdXRsZXRfY29kZSI6IiIsIm91dGxldF9pZCI6MCwidGVybWluYWxfY29kZSI6IiIsInRlcm1pbmFsX2lkIjowLCJ1c2VyX2ZpcnN0X25hbWUiOiJBbnVrb29uIiwidXNlcl9sYXN0X25hbWUiOiJKaXdib29uIiwidXNlcl90eXBlIjoic3VwZXJhZG1pbiJ9fQ.RLidhfwZ4sN0feBaXsl8Prq7fZMHH30a2mHratb_FwfdUtdI6zg_3MAj_vWZe_F-YNVpVUiV2uWmjN_xQtQbA5iHCMsgCSJ8wA0aLhLbuWHcXl2uJDSiH_Nw7EX1My-Eun8v_AFdPIW6pN9VpxXVShDAsfunezNmZttzLHlQ_PPx3S3vXUXafqL-0-IDngVOAToIaKlajHfLoTxz10iMiLlVx9ZaSBdSNq3uMwlBY3HgY4-sdTU6cYje2m0dHn8ZdpDnx_Er5tk4GiKo5y_lH4BR13RhtkqTh53-QZV9ZEB_7mFWyNsvwXm3lQSqhsU4yVVGnh8Xa_XooaNoycduUw'
  const request = {
    id: slug,
  }
  const option = {
    headers: {
      Authorization: `Bearer ${mockToken}`,
    },
  }
  const host = process.env.POS_GRPC_API
  console.log(`start`)
  const result = await axios.post(host + '/merchant-service/Outlet/findOutlet', request, option)
  const defaultDeeplink = {
    photo: 'https://www.kitchenhub-th.com/assets/images/logo-kittchenhub.png',
    title: 'Kitchen Hub ส่งอาหาร delivery ออนไลน์จากร้านอาหารดังใกล้บ้านคุณทั่วประเทศไทย',
  }

  if (result.data) {
    const { data } = result
    const { photo = defaultDeeplink.photo, name } = data.data
    const deeplink = {
      photo: photo,
      title: name?.th,
    }
    return { props: { data: deeplink } }
  }

  return { props: { data: defaultDeeplink } }
}
