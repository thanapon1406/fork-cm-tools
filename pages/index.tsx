import { statusMapping } from '@/components/ekyc/common'
import Table from '@/components/Table'
import useFetchTable from '@/hooks/useFetchTable'
import MainLayout from '@/layout/MainLayout'
import { outletList } from '@/services/merchant'
import { EyeOutlined } from '@ant-design/icons'
import { Card, Col, Row, Typography } from 'antd'
import moment from 'moment'
import { NextPage } from 'next'
import Link from 'next/link'
import React, { useState } from 'react'
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

const Home: NextPage = ({}: Props) => {
  const [recentPage, SetRecentPage] = useState([
    {
      id: 1,
      name: 'ลงทะเบียนร้านค้า',
      link: '/merchant',
    },
    {
      id: 2,
      name: 'ลงทะเบียน E-KYC',
      link: '/ekyc',
    },
    {
      id: 3,
      name: 'ออเดอร์ทั้งหมด',
      link: '/orderhistory',
    },
    {
      id: 4,
      name: 'เครดิตร้านค้าทั้งหมด',
      link: '/credit/merchant',
    },
  ])

  const recentRender = () => {
    return (
      <>
        {recentPage.map((value: any, index: any) => {
          return (
            <Col key={`recent-${value.id}`} span={6} xs={24} sm={24} lg={6}>
              <Card size="small">
                <div>
                  {/* <Image src={logoImg}></Image> */}
                  <EyeOutlined style={{ margin: '0px 12px' }} />
                  <Link href={value.link}>
                    <a>{value?.name}</a>
                  </Link>
                </div>
              </Card>
            </Col>
          )
        })}
      </>
    )
  }

  const filterRequest: filterObject = {
    keyword: '',
    verify_status: '',
    ekyc_status: '',
    start_date_create: '',
    end_date_create: '',
    start_date_verify: '',
    end_date_verify: '',
    approve_status: '',
    branch_type: '',
    id: '',
  }
  const requestApi: Function = outletList
  const { isLoading, dataTable, handelDataTableChange, handleFetchData, pagination } =
    useFetchTable(requestApi, filterRequest)
  const column = [
    {
      title: 'ชื่อร้านค้า',
      dataIndex: 'name',
      align: 'center',
      render: (row: any) => {
        return row['th']
      },
    },
    {
      title: 'ประเภทร้านค้า',
      dataIndex: 'branch_type',
      align: 'center',
      render: (row: any) => {
        const textMapping: any = {
          single: 'สาขาเดี่ยว',
          multiple: 'หลายสาขา',
        }
        return textMapping[row] || ''
      },
    },
    {
      title: 'ชื่อและนามสกุล',
      dataIndex: 'user',
      align: 'center',
      render: (row: any) => {
        if (row) {
          return `${row['first_name']} ${row['last_name']}`
        }
        return ''
      },
    },
    {
      title: 'เบอร์โทรศัพท์',
      dataIndex: 'tel',
      align: 'center',
    },
    {
      title: 'ข้อมูลร้านค้า',
      dataIndex: 'verify_status',
      align: 'center',
    },
    {
      title: 'E-KYC',
      dataIndex: 'ekyc_status',
      align: 'center',
      render: (row: any) => {
        return row === 'no-ekyc' ? '-' : row
      },
    },
    {
      title: 'สถานะการตรวจสอบ',
      dataIndex: 'approve_status',
      align: 'center',
      render: (row: string) => {
        return statusMapping[row]
      },
    },
    {
      title: 'วันที่ลงทะเบียน',
      dataIndex: 'created_at',
      align: 'center',
      render: (row: any) => {
        return moment(row).format('YYYY-MM-DD HH:mm')
      },
    },
    {
      title: 'วันที่อัพเดตข้อมูล',
      dataIndex: 'verify_date',
      align: 'center',
      render: (row: any) => {
        return row ? moment(row).format('YYYY-MM-DD HH:mm') : '-'
      },
    },
  ]
  return (
    <MainLayout>
      <Card>
        <Title level={4}>Recently View</Title>
        <Row gutter={16}>{recentPage && recentRender()}</Row>
        <br />
        <Row gutter={16}>
          <Col span={24} xs={24} sm={24} lg={24}>
            <Table
              config={{
                dataTableTitle: 'ลงทะเบียนร้านค้า',
                loading: isLoading,
                tableName: 'merchant',
                tableColumns: column,
                dataSource: dataTable.slice(0, 4),
                handelDataTableLoad: handelDataTableChange,
                pagination: false,
              }}
            />
          </Col>
        </Row>
      </Card>
    </MainLayout>
  )
}

export default Home
