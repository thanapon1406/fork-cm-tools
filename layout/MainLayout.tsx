import { isLogin } from '@/services/login'
import { LoadingOutlined } from '@ant-design/icons'
import { Layout, Spin } from 'antd'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useLoadingContext } from '../contexts/LoadingContext'
import HeaderContent from './HeaderContent'
import Sidebar from './Sidebar'
import SkeletonLoading from './SkeletonLoading'
const antIcon = <LoadingOutlined style={{ fontSize: 60 }} spin />

const { Header, Content, Footer, Sider } = Layout

interface Props {
  children: any
  isLoading?: boolean
}

export default function MainLayout({ children, isLoading = false }: Props) {
  const router = useRouter()
  let authToken: any = false
  useEffect(() => {
    if (typeof window !== 'undefined') {
      authToken = isLogin()
      console.log(`authToken`, authToken)
      if (!authToken) {
        router.replace('/login')
      }
    }
  }, [])
  const Loading = useLoadingContext()

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Head>
        <title>CM Tool</title>
      </Head>
      <Sidebar />
      <Layout className="site-layout" style={{ marginLeft: 220 }}>
        <HeaderContent />
        <Spin indicator={antIcon} spinning={Loading.isShow}>
          <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
            {isLoading ? <SkeletonLoading /> : <>{children}</>}
          </Content>
        </Spin>
        {/* <Footer style={{ textAlign: 'center' }}>Footer Layout</Footer> */}
      </Layout>
    </Layout>
  )
}
