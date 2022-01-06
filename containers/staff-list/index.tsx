import CustomBadge from '@/components/Badge'
import Button from '@/components/Button'
import Input from '@/components/Form/Input'
import Table from '@/components/Table'
import { isBanText, userStatus } from '@/constants/textMapping'
import useFetchTable from '@/hooks/useFetchTable'
import { getStaffs } from '@/services/merchant'
import { Col, Row, Space, Typography } from 'antd'
import { Field, Form, Formik } from 'formik'
import moment from 'moment'
import React, { ReactElement, useEffect, useState } from 'react'

const { Title } = Typography

interface Props {
  outletId: any
  page: 'merchant_approve' | 'merchant_profile'
}

export default function StaffList({ outletId, page }: Props): ReactElement {
  let tableName = 'merchant'
  if (page === 'merchant_profile') {
    tableName = 'userprofile/merchant'
  }
  // Staffs list
  const requestTopupApi: Function = getStaffs
  const staff = useFetchTable(
    requestTopupApi,
    {
      outlet_id: outletId,
    },
    { isAutoFetch: false }
  )
  let [staffFilter, setStaffFilter] = useState({
    keyword: '',
  })

  useEffect(() => {
    staff.handleFetchData({
      outlet_id: outletId,
    })
  }, [outletId])

  const columnStaff = [
    {
      title: 'ชื่อ นามสกุล',
      dataIndex: '',
      align: 'center',
      render: (row: any) => {
        if (row) {
          return `${row['firstname']} ${row['lastname']}`
        }
      },
    },
    {
      title: 'เบอร์โทรศัพท์',
      dataIndex: 'tel',
      align: 'center',
    },
    {
      title: 'อีเมล์ที่ลงทะเบียน',
      dataIndex: 'email',
      align: 'center',
    },
    {
      title: 'สถานะพนักงาน',
      dataIndex: 'is_ban',
      align: 'center',
      render: (row: any) => {
        const isBan = row ? 'ban' : 'normal'
        const ban = isBanText[isBan]
        return <CustomBadge customMapping={{ status: ban.status, text: ban.text }}></CustomBadge>
      },
    },
    {
      title: 'สถานะCMS',
      dataIndex: 'user_status',
      align: 'center',
      render: (row: any) => {
        const status = userStatus[row]
        return (
          <CustomBadge customMapping={{ status: status.status, text: status.text }}></CustomBadge>
        )
      },
    },
    {
      title: 'วันที่สร้างพนักงาน',
      dataIndex: 'created_at',
      align: 'center',
      render: (row: any) => {
        return row ? moment(row).format('YYYY-MM-DD HH:mm') : '-'
      },
    },
    {
      title: 'วันที่ลงเบียน Merchant App',
      dataIndex: 'created_at',
      align: 'center',
      render: (row: any) => {
        return row ? moment(row).format('YYYY-MM-DD HH:mm') : '-'
      },
    },
  ]

  const handleStaffFilterSubmit = (values: any) => {
    let reqFilter: any = {
      outlet_id: outletId,
      keyword: values.keyword,
    }
    staff.handleFetchData(reqFilter)
  }

  const getMappingPath = (rowData: any) => {
    if (page === 'merchant_approve') {
      return `${outletId}/staff?user_id=${rowData.id}`
    }
    if (page === 'merchant_profile') {
      return `${outletId}/staff?user_id=${rowData.id}`
    }
    return `${outletId}/staff?user_id=${rowData.id}`
  }

  return (
    <>
      <Title level={5}>รายชื่อพนักงาน (จำนวนพนักงาน {staff.pagination.total} คน)</Title>
      <Formik initialValues={staffFilter} onSubmit={handleStaffFilterSubmit}>
        {({ values, resetForm, submitForm }) => (
          <Form>
            <Row gutter={16}>
              <Col className="gutter-row" span={8}>
                <Field
                  label={{ text: 'ชื่อ-นามสกุล' }}
                  name="keyword"
                  type="text"
                  component={Input}
                  className="form-control round"
                  id="keyword"
                  placeholder="ชื่อ นามสกุล"
                />
              </Col>
              <Col className="gutter-row" span={6}>
                <Space>
                  <Button
                    style={{ width: '120px', marginTop: '28px' }}
                    type="primary"
                    size="middle"
                    // htmlType="submit"
                    onClick={() => {
                      submitForm()
                    }}
                  >
                    ค้นหา
                  </Button>
                  <Button
                    style={{ width: '120px', marginTop: '28px', marginLeft: '10px' }}
                    type="default"
                    size="middle"
                    htmlType="reset"
                    onClick={() => resetForm()}
                  >
                    เคลียร์
                  </Button>
                </Space>
              </Col>
            </Row>
          </Form>
        )}
      </Formik>
      <Table
        config={{
          loading: staff.isLoading,
          tableName: tableName,
          tableColumns: columnStaff,
          dataSource: staff.dataTable,
          handelDataTableLoad: staff.handelDataTableChange,
          pagination: staff.pagination,
          isShowRowNumber: true,
          action: ['view'],
          scrollTable: { y: 700 },
          mappingPath: getMappingPath,
        }}
      />
    </>
  )
}
