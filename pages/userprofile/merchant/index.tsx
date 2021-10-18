import Button from '@/components/Button'
import Card from '@/components/Card'
import Input from '@/components/Form/Input'
import Select from '@/components/Form/Select'
import Table from '@/components/Table'
import Tag from '@/components/Tag'
import { Pagination } from '@/interface/dataTable'
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
  outlet_type?: string
  status?: string
  id?: string
  approve_status?: string
}

export default function MerchantProfileList({}: Props): ReactElement {
  const Router = useRouter()
  const initialValues = {
    keyword: '',
    outlet_type: '',
    status: '',
  }
  let [outletType, setOutletType] = useState([
    {
      name: 'ทุกประเภท',
      value: '',
    },
  ])
  let [dataTable, setDataTable] = useState([])
  let [_isLoading, setIsLoading] = useState(true)
  let [pagination, setPagination] = useState<Pagination>({
    total: 0,
    current: 1,
    pageSize: 10,
  })
  let [filter, setFilter] = useState<filterObject>({
    keyword: '',
    outlet_type: '',
    status: '',
    approve_status: '',
  })

  useEffect(() => {
    fetchOutletType()
    fetchData()
  }, [])

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

  const fetchData = async (filterObj: filterObject = filter, paging: Pagination = pagination) => {
    const reqBody = {
      page: paging.current,
      per_page: paging.pageSize,
      ...filterObj,
    }
    setIsLoading(true)
    const { result, success } = await outletList(reqBody)
    if (success) {
      const { meta, data } = result
      setPagination({
        pageSize: paging.pageSize,
        current: meta.page,
        total: meta.total_count,
      })
      setDataTable(data)
      setIsLoading(false)
      setFilter(filterObj)
    }
  }

  const handleSubmit = (values: any) => {
    console.log(`values`, values)
    let reqFilter: filterObject = {
      keyword: '',
      outlet_type: '',
      status: '',
    }
    fetchData(reqFilter, { current: 1, total: 0, pageSize: 10 })
  }

  const handelDataTableLoad = (pagination: any) => {
    fetchData(filter, pagination)
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
                  <Tag key={d.id} type="success">
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
      dataIndex: 'credit',
      align: 'center',
    },
    {
      title: 'สถานะร้านค้า',
      dataIndex: 'status',
      align: 'center',
    },
    {
      title: 'ร้านเปิด-ปิด',
      dataIndex: 'status',
      align: 'center',
      className: 'column-typeverifyr',
      render: (row: string) => {
        return statusMapping[row]
      },
    },
    {
      title: 'Delivery Info',
      dataIndex: 'delivery_setting',
      align: 'center',
      render: (row: any) => {
        return _.get(row, 'deliver_by', '-')
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
      <Title level={4}>อนุมัติผลการละทะเบียนเข้าใช้ระบบ</Title>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>อนุมัติผลการละทะเบียน</Breadcrumb.Item>
        <Breadcrumb.Item>ลงทะเบียนร้านค้า</Breadcrumb.Item>
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
                    placeholder="outlet_type"
                    defaultValue={{ value: 'all' }}
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
            dataTableTitle: 'รายการรอตรวจสอบ',
            loading: _isLoading,
            tableName: 'userprofile/merchant',
            tableColumns: column,
            action: ['view'],
            dataSource: dataTable,
            handelDataTableLoad: handelDataTableLoad,
            pagination: pagination,
          }}
        />
      </Card>
    </MainLayout>
  )
}
