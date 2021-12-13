import Card from '@/components/Card'
import MainLayout from '@/layout/MainLayout'
import { Row, Typography } from 'antd'
import { NextPage } from 'next'
import React from 'react'
const { Title } = Typography

interface Props {}

interface filterObject {
  keyword?: string
  verify_status?: string
  ekyc_status?: string
  start_date_create?: string
  end_date_create?: string
  start_date_verify?: string
  end_date_verify?: string
  approve_status?: string
  branch_type?: string
  id?: string
}

const Home: NextPage = () => {
  return (
    <MainLayout>
      <Card>
        <Title level={4}>Recently View</Title>
        <br />
        <Row gutter={16}></Row>
      </Card>
    </MainLayout>
  )
}

export default Home
