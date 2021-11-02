import { isLogin } from '@/services/login'
import { Layout } from 'antd'
import Head from 'next/head'
import Router, { useRouter } from 'next/router'
import React from 'react'
import HeaderContent from './HeaderContent'
import Sidebar from './Sidebar'
import SkeletonLoading from './SkeletonLoading'

const { Header, Content, Footer, Sider } = Layout

interface Props {
  children: any
  isLoading?: boolean
}

export default function MainLayout({ children, isLoading = false }: Props) {
  const router = useRouter()
  let authToken: any = false
  if (typeof window !== 'undefined') {
    authToken = isLogin()
    if (!authToken) {
      Router.replace('/login')
      return <></>
    }
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Head>
        <title>CM Tool</title>
      </Head>
      <Sidebar />
      <Layout className="site-layout" style={{ marginLeft: 220 }}>
        <HeaderContent />
        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
          {isLoading ? <SkeletonLoading /> : <>{children}</>}
        </Content>

        {/* <Footer style={{ textAlign: 'center' }}>Footer Layout</Footer> */}
      </Layout>
    </Layout>
  )
}
