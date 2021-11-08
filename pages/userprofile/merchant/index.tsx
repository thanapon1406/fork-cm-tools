import Button from '@/components/Button'
import Card from '@/components/Card'
import Input from '@/components/Form/Input'
import Select from '@/components/Form/Select'
import { StatusMapping } from '@/components/outlet/Status'
import Table from '@/components/Table'
import Tag from '@/components/Tag'
import { deliveryInfo } from '@/constants/textMapping'
import useFetchTable from '@/hooks/useFetchTable'
import MainLayout from '@/layout/MainLayout'
import { getOutletType, outletList } from '@/services/merchant'
import { Breadcrumb, Col, Row, Space, Typography } from 'antd'
import { Field, Form, Formik } from 'formik'
import _ from 'lodash'
import moment from 'moment'
import { useRouter } from 'next/router'
import React, { ReactElement, useEffect, useState } from 'react'
import * as Yup from 'yup'

const { Title } = Typography

interface Props {}

interface filterObject {
  keyword?: string
  outlet_types?: string
  status?: string
  id?: string
  approve_status?: string
}

export default function MerchantProfileList({}: Props): ReactElement {
  const Router = useRouter()
  const initialValues = {
    keyword: '',
    outlet_types: '',
    status: '',
  }
  let [outletType, setOutletType] = useState<Array<any>>([
    {
      name: 'ทุกประเภท',
      value: '',
    },
  ])

  useEffect(() => {
    fetchOutletType()
  }, [])

  const filterRequest: filterObject = {
    keyword: '',
    outlet_types: '',
    status: '',
    approve_status: 'approved',
  }
  const requestApi: Function = outletList
  const { isLoading, dataTable, handelDataTableChange, handleFetchData, pagination } =
    useFetchTable(requestApi, filterRequest)

  const Schema = Yup.object().shape({})

  const fetchOutletType = async () => {
    const { result, success } = await getOutletType()
    if (success) {
      const { data } = result
      const outletTypeFormat = data.map((d: any) => {
        return {
          name: d.name.th,
          value: d.id,
        }
      })
      setOutletType([...outletType, ...outletTypeFormat])
    }
  }

  const handleSubmit = (values: any) => {
    let reqFilter: filterObject = {
      keyword: values.keyword,
      outlet_types: values.outlet_type ? `${values.outlet_type}` : '',
      status: values.status,
      approve_status: 'approved',
    }
    handleFetchData(reqFilter)
  }

  const statusMapping: any = {
    uploaded: 'รอการตรวจสอบ',
    approved: 'อนุมัติ',
    're-approved': 'ขอเอกสารเพิ่มเติม',
    rejected: 'ไม่อนุมัติ',
  }

  const column = [
    {
      title: 'Merchant ID',
      dataIndex: 'id',
      align: 'center',
    },
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
      dataIndex: 'types',
      align: 'center',
      render: (row: string) => {
        if (row) {
          // const outletType =
          // console.log(`outletType`, outletType)
          return (
            <>
              {_.map(row, (d: any) => {
                return (
                  <Tag key={d.id} type="warning">
                    {d.name['th']}
                  </Tag>
                )
              })}
            </>
          )
        }
      },
    },
    {
      title: 'เบอร์ติดต่อร้าน',
      dataIndex: 'tel',
      align: 'center',
    },
    {
      title: 'เครดิต',
      dataIndex: 'available_credit',
      align: 'center',
    },
    {
      title: 'สถานะร้านค้า',
      dataIndex: 'status',
      align: 'center',
      render: (row: any) => {
        return StatusMapping[row]
      },
    },
    {
      title: 'ร้านเปิด-ปิด',
      dataIndex: 'status',
      align: 'center',
      render: (row: string) => {
        return statusMapping[row]
      },
    },
    {
      title: 'Delivery Info',
      dataIndex: 'delivery_setting',
      align: 'center',
      render: (row: any) => {
        const delivery = _.get(row, 'deliver_by', false)
        return delivery ? deliveryInfo[delivery] : '-'
      },
    },
    {
      title: 'Approve Date',
      dataIndex: 'verify_date',
      align: 'center',
      render: (row: any) => {
        return row ? moment(row).format('YYYY-MM-DD HH:mm') : '-'
      },
    },
  ]

  return (
    <MainLayout>
      <Title level={4}>บัญชีผู้ใช้งาน</Title>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>บัญชีผู้ใช้งาน</Breadcrumb.Item>
        <Breadcrumb.Item>บัญชีร้านค้า</Breadcrumb.Item>
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
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'ประเภทร้านค้า' }}
                    name="outlet_type"
                    component={Select}
                    id="outlet_type"
                    placeholder="ประเภทร้านค้า"
                    defaultValue=""
                    selectOption={outletType}
                  />
                </Col>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'สถานะร้านค้า' }}
                    name="status"
                    component={Select}
                    id="status"
                    placeholder="status"
                    selectOption={[
                      {
                        name: 'ทุกสถานะ',
                        value: '',
                      },
                      {
                        name: 'Active',
                        value: 'active',
                      },
                      {
                        name: 'In-Active',
                        value: 'inactive',
                      },
                    ]}
                  />
                </Col>
                <Col className="gutter-row" span={6}></Col>
              </Row>
            </Form>
          )}
        </Formik>
      </Card>
      <Card>
        <Table
          config={{
            dataTableTitle: 'บัญชีร้านค้า',
            loading: isLoading,
            tableName: 'userprofile/merchant',
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
