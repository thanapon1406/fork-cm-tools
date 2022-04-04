import Card from '@/components/Card'
import ExportButton from '@/components/credit/ExportButton'
import DatePicker from '@/components/Form/DatePicker'
import useFetchTable from '@/hooks/useFetchTable'
import MainLayout from '@/layout/MainLayout'
import { calculateTopup, creditTransaction } from '@/services/credit'
import { Breadcrumb, Col, Row, Typography } from 'antd'
import { Field, Form, Formik } from 'formik'
import { get } from 'lodash'
import moment from 'moment'
import { useRouter } from 'next/router'
import React, { ReactElement, useEffect, useState } from 'react'
import * as Yup from 'yup'

const { Title } = Typography

interface Props { }

interface filterObject {
  id?: string
  keyword?: string
  type?: string
  start_date?: string
  end_date?: string
  status?: string
  reference_id?: string
  is_all_status?: boolean
}

export default function MerchantAccount({ }: Props): ReactElement {
  const Router = useRouter()

  const initialValues = {
    refId: '',
    outlet_name: '',
    type: '',
    date: {
      start: '',
      end: '',
    },
    status: '',
  }

  const [filterSearch, setFilterSearch] = useState<filterObject>({
    reference_id: '',
    keyword: '',
    type: '',
    start_date: '',
    end_date: '',
    status: '',
    is_all_status: true
  })

  const [filterDate, setFilterDate] = useState({
    start: '',
    end: '',
  })
  const [summaryTopup, setSummaryTopup] = useState({
    amount: 0,
    credit: 0,
  })

  const formatter = new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
  })

  const formatterNotSymbol = new Intl.NumberFormat('th-TH')

  useEffect(() => {
    initFilterDate()
  }, [])

  const initFilterDate = async (
    start: string = moment().startOf('month').format(),
    end: string = moment().format()
  ) => {
    setFilterDate({
      start: start,
      end: end,
    })
    const reqData = {
      start_date: start,
      end_date: end,
    }

    const { result, success } = await calculateTopup(reqData)
    if (success) {
      const { data } = result
      const credit = get(data, 'credit')
      const amount = get(data, 'amount')
      setSummaryTopup({
        amount: amount,
        credit: credit,
      })
    }
  }

  const filterRequest: filterObject = {}
  const requestApi: Function = creditTransaction
  const { isLoading, dataTable, handelDataTableChange, handleFetchData, pagination } =
    useFetchTable(requestApi, filterRequest)

  const Schema = Yup.object().shape({})

  return (
    <MainLayout>
      <Title level={4}>ข้อมูลบัญชีร้านค้า</Title>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>ข้อมูลบัญชีร้านค้า</Breadcrumb.Item>
        <Breadcrumb.Item>เลขบัญชีธนาคารทั้งหมด</Breadcrumb.Item>
      </Breadcrumb>
      <Card>
        <Formik initialValues={initialValues} onSubmit={() => { }} validationSchema={Schema}>
          {() => (
            <Form>
              <Row gutter={16}>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'วันเวลาที่ทำรายการ' }}
                    name="date"
                    component={DatePicker}
                    id="date"
                    placeholder="วันเวลาที่ทำรายการ"
                    disabled={true}
                  />
                </Col>
                <Col className="gutter-row" span={4} offset={14}>
                  <div className="ant-form ant-form-vertical" style={{ display: "flex", justifyContent: "end" }}>
                    <ExportButton propsSubmit={(value: any) => { console.log(value) }} />
                  </div>
                </Col>
              </Row>

            </Form>
          )}
        </Formik>
      </Card>

    </MainLayout>
  )
}
