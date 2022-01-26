import Button from '@/components/Button'
import Card from '@/components/Card'
import Input from '@/components/Form/Input'
import Table from '@/components/Table'
import { userServiceType } from '@/constants/textMapping'
import useFetchTable from '@/hooks/useFetchTable'
import MainLayout from '@/layout/MainLayout'
import { getUsers } from '@/services/staff'
import { Breadcrumb, Col, Row, Space, Typography } from 'antd'
import { Field, Form, Formik } from 'formik'
import _ from 'lodash'
import moment from 'moment'
import { useRouter } from 'next/router'
import React, { ReactElement, useEffect } from 'react'
import * as Yup from 'yup'


const { Title } = Typography

interface Props { }

interface filterObject {
  keyword?: string
  user_type_list?: string[]
}

export default function StaffProfileList({ }: Props): ReactElement {
  const Router = useRouter()
  const initialValues = {
    keyword: '',
  }

  useEffect(() => {
  }, [])

  const filterRequest: filterObject = {
    keyword: '',
    user_type_list: ['brandadmin', 'supervisor']
  }
  const requestApi: Function = getUsers
  const { isLoading, dataTable, handelDataTableChange, handleFetchData, pagination } =
    useFetchTable(requestApi, filterRequest)

  const Schema = Yup.object().shape({})

  const handleSubmit = (values: any) => {
    let reqFilter: filterObject = {
      keyword: values.keyword,
      user_type_list: ['brandadmin', 'supervisor']
    }
    handleFetchData(reqFilter)
  }

  const column = [
    {
      title: 'รหัสพนักงาน',
      dataIndex: 'id',
      align: 'center',
    },
    {
      title: 'ชื่อ-นามสกุล',
      dataIndex: '',
      align: 'center',
      render: (row: any) => {
        return row.firstname + " " + row.lastname
      },
    },
    {
      title: 'เบอร์โทรศัพท์',
      dataIndex: 'tel',
      align: 'center',
    },
    {
      title: 'อีเมล',
      dataIndex: 'email',
      align: 'center',
    },
    {
      title: 'สิทธิ์การใช้งาน',
      dataIndex: 'user_type',
      align: 'center',
    },
    {
      title: 'ช่องทางการสร้างพนักงาน',
      dataIndex: '',
      align: 'center',
      render: (row: any) => {
        const chanel = _.get(row, 'user_service_type', false)
        return chanel ? userServiceType[chanel] : '-'
      },
    },
    {
      title: 'จำนวนแบรนด์',
      dataIndex: 'permissions_brand',
      align: 'center',
      render: (row: any) => {
        return row ? row : 0
      },
    },
    {
      title: 'จำนวนสาขา',
      dataIndex: 'permissions_outlet',
      align: 'center',
      render: (row: any) => {
        return row ? row : 0
      },
    },
    {
      title: 'สถานะพนักงาน',
      dataIndex: 'is_ban',
      align: 'center',
      render: (row: any) => {
        return row ? `Inactive` : `Active`
      },
    },
    {
      title: 'สถานะ CMS',
      dataIndex: 'user_status',
      align: 'center',
      render: (row: any) => {
        return row === `active` ? `Active` : `Inactive`
      },
    },
    {
      title: 'วันที่สร้างพนักงาน CMS',
      dataIndex: 'created_at',
      align: 'center',
      render: (row: any) => {
        return row ? moment(row).format('YYYY-MM-DD HH:mm') : '-'
      },
    },
    // {
    //   title: 'Delivery Info',
    //   dataIndex: 'delivery_setting',
    //   align: 'center',
    //   render: (row: any) => {
    //     const delivery = _.get(row, 'deliver_by', false)
    //     return delivery ? deliveryInfo[delivery] : '-'
    //   },
    // },
    // {
    //   title: 'ช่องทางลงทะเบียน',
    //   dataIndex: 'user',
    //   align: 'center',
    //   render: (row: any) => {
    //     const chanel = _.get(row, 'user_service_type', false)
    //     return chanel ? userServiceType[chanel] : '-'
    //   },
    // },

  ]

  return (
    <MainLayout>
      <Title level={4}>ข้อมูลบัญชีพนักงาน</Title>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>ข้อมูลบัญชีพนักงาน</Breadcrumb.Item>
      </Breadcrumb>
      <Card>
        <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={Schema}>
          {({ values, resetForm }) => (
            <Form>
              <Row gutter={16}>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'ค้นหา' }}
                    name="keyword"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="keyword"
                    placeholder="ค้นหา"
                  />
                  <div className="ant-form ant-form-vertical">
                    <Space>
                      <Button
                        style={{ width: '120px', marginTop: '31px' }}
                        type="primary"
                        size="middle"
                        htmlType="submit"
                      >
                        ค้นหา
                      </Button>
                      <Button
                        style={{ width: '120px', marginTop: '31px', marginLeft: '10px' }}
                        type="default"
                        size="middle"
                        htmlType="reset"
                        onClick={() => resetForm()}
                      >
                        เคลียร์
                      </Button>
                    </Space>
                  </div>
                </Col>

              </Row>
            </Form>
          )}
        </Formik>
      </Card>
      <Card>
        <Table
          config={{
            dataTableTitle: 'บัญชีพนักงาน',
            loading: isLoading,
            tableName: 'userprofile/staff',
            tableColumns: column,
            action: ['view'],
            dataSource: dataTable,
            handelDataTableLoad: handelDataTableChange,
            pagination: pagination,
          }}
        />
      </Card>
    </MainLayout>
  )
}
