import MainLayout from '@/layout/MainLayout'
import { Breadcrumb, Typography } from 'antd'
import { useRouter } from 'next/router'
import React, { ReactElement, useEffect, useState } from 'react'
const { Title } = Typography

interface Props { }

export default function RiderDetail({ }: Props): ReactElement {
  const router = useRouter()
  const { id } = router.query
  let [_isLoading, setIsLoading] = useState(true)


  useEffect(() => {
    if (id) {
      console.log("id", id)
      // fetchData()
    }
  }, [id])


  const handleSubmit = async (values: any) => { }

  return (
    <MainLayout>
      {!_isLoading && (
        <>
          <Title level={4}>อนุมัติผลการลงทะเบียนเข้าใช้ระบบ</Title>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>อนุมัติผลการลงทะเบียน</Breadcrumb.Item>
            <Breadcrumb.Item>ลงทะเบียนคนขับ</Breadcrumb.Item>
            <Breadcrumb.Item>ข้อมูลคนขับ</Breadcrumb.Item>
          </Breadcrumb>
        </>
      )}
    </MainLayout>
  )
}
