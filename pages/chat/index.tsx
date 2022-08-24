import Button from '@/components/Button'
import Card from '@/components/Card'
import DateTimeRangePicker from '@/components/Form/DateTimeRangePicker'
import Input from '@/components/Form/Input'
import Select from '@/components/Form/Select'
import Table from '@/components/Table'
import { SelectOption } from '@/interface/common'
import { CustomerDetail } from '@/interface/customer'
import { ScrollTable } from '@/interface/dataTable'
import { OutletDetail } from '@/interface/outlet'
import MainLayout from '@/layout/MainLayout'
import { findAllRoom } from '@/services/chat-history'
import { consumerList } from '@/services/consumer'
import { outletListById } from '@/services/merchant'
import { Breadcrumb, Col, Row, Typography } from 'antd'
import { Field, Form, Formik } from 'formik'
import { debounce, isEmpty, isEqual, map, uniqWith } from 'lodash'
import moment from 'moment'
import { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { RecoilRoot } from 'recoil'

const { Title } = Typography

interface filterObject {
  order_id?: string
  outlet_id?: string
  profile_id?: string
  tel?: string
  order_created_at?: any
  message_created_at?: any
}

interface Pagination {
  total: number
  current: number
  pageSize: number
}

const Chat: NextPage = () => {
  let [dataTable, setDataTable] = useState([])
  const [customerDropDown, setCustomerDropDown] = useState<Array<SelectOption>>([])
  const [merchantDropDown, setMerchantDropDown] = useState<Array<SelectOption>>([])
  let [_isLoading, setIsLoading] = useState(true)
  let [filter, setFilter] = useState<filterObject>({
    order_id: '',
    outlet_id: '',
    profile_id: '',
    tel: '',
    order_created_at: {
      order_created_at_start: null,
      order_created_at_end: null,
    },
    message_created_at: {
      message_created_at_start: null,
      message_created_at_end: null,
    },
  })
  let [pagination, setPagination] = useState<Pagination>({
    total: 0,
    current: 1,
    pageSize: 10,
  })
  let [scrollTable, setScrollTable] = useState<ScrollTable>({
    x: 1500,
    y: null,
  })

  const column = [
    {
      title: 'หมายเลขออเดอร์',
      dataIndex: 'room_key',
      align: 'center',
    },
    {
      title: 'ชื่อร้านค้า',
      dataIndex: 'outlet_name',
      align: 'center',
      width: 300,
    },
    {
      title: 'ชื่อลูกค้า',
      dataIndex: 'profile_name',
      align: 'center',
      width: 300,
    },
    {
      title: 'เบอร์โทรศัพท์',
      dataIndex: 'tel',
      align: 'center',
    },
    {
      title: 'วันเวลาที่ทำรายการ',
      dataIndex: 'order_created_at',
      align: 'center',
      render: (row: any) => {
        if (row) {
          return moment(row).format('YYYY-MM-DD HH:mm')
        } else {
          return '-'
        }
      },
    },
    {
      title: 'วันเวลาเริ่มการสนทนา',
      dataIndex: 'message_created_at',
      align: 'center',
      render: (row: any) => {
        if (row) {
          return moment(row).format('YYYY-MM-DD HH:mm')
        } else {
          return '-'
        }
      },
    },
  ]

  const getMappingPath = (rowData: any) => {
    return `${rowData.room_key}`
  }

  type FormInterface = {
    order_id: string
    outlet_id: string
    profile_id: string
    tel: string
    order_created_at: {
      start: string
      end: string
    }
    message_created_at: {
      start: string
      end: string
    }
  }

  const initialValues = {
    order_id: '',
    outlet_id: '',
    profile_id: '',
    tel: '',
    order_created_at: {
      start: null,
      end: null,
    },
    message_created_at: {
      start: null,
      end: null,
    },
  }

  const handelDataTableLoad = (pagination: any) => {
    fetchData({}, pagination)
  }

  const handleSubmit = async (values: any) => {
    console.log('values  ', values)
    let reqFilter: filterObject = {
      order_id: values.order_id,
      outlet_id: values.outlet_id,
      profile_id: values.profile_id,
      tel: values.tel,
      order_created_at: {
        start: values.order_created_at.start,
        end: values.order_created_at.end,
      },
      message_created_at: {
        start: values.message_created_at.start,
        end: values.message_created_at.end,
      },
    }
    fetchData(reqFilter, pagination)
  }

  const fetchData = async (filterObj: filterObject = filter, paging: Pagination = pagination) => {
    const reqBody = {
      page: paging.current,
      per_page: paging.pageSize,
      data: {
        ...filterObj,
      },
    }
    setIsLoading(true)
    console.log('req  ', reqBody)

    const { success, result } = await findAllRoom(reqBody)
    if (success) {
      console.log(result)
      setPagination({
        pageSize: paging.pageSize,
        current: result.meta.page,
        total: result.meta.total_count,
      })
      setDataTable(result.data)
      setIsLoading(false)
      setFilter(filterObj)
    }
  }
  const onSearchCustomerDebounce = debounce(async (message) => await fetchCustomer(message), 800)
  const onSearchMerchantDebounce = debounce(async (message) => await fetchMerchant(message), 800)

  const onClearCustomer = () => {
    setCustomerDropDown([])
  }

  const onClearMerchant = () => {
    setMerchantDropDown([])
  }

  const fetchCustomer = async (message: any) => {
    if (!isEmpty(message)) {
      const request = {
        keyword: message,
      }

      const { result, success } = await consumerList(request)
      if (success) {
        const { meta, data } = result
        let customerData = map<CustomerDetail, SelectOption>(data, function (item: CustomerDetail) {
          let lastName = ''
          if (item?.last_name) {
            lastName = item?.last_name
          }
          return { name: item.first_name + ' ' + lastName, value: item.sso_id }
        })

        setCustomerDropDown(customerData)
      }
    } else {
      setCustomerDropDown([])
    }
  }
  const fetchMerchant = async (message: string) => {
    if (!isEmpty(message)) {
      const request = {
        keyword: message,
        page: 1,
        per_page: 100,
      }

      const { result, success } = await outletListById(request)
      if (success) {
        const { meta, data } = result

        let uniqData = uniqWith(data, isEqual)

        let outletData = map<OutletDetail, SelectOption>(uniqData, function (item: OutletDetail) {
          return { name: item.name.th, value: String(item.id) }
        })

        setMerchantDropDown(outletData)
      }
    } else {
      setMerchantDropDown([])
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <RecoilRoot>
      <MainLayout>
        <Title level={4}>Chat</Title>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Chat</Breadcrumb.Item>
          <Breadcrumb.Item>ออเดอร์ทั้งหมด</Breadcrumb.Item>
        </Breadcrumb>
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {({ values, resetForm, setValues }) => (
            <Form>
              <Row gutter={16}>
                <Col className="gutter-row" xs={12} sm={6}>
                  <Field
                    label={{ text: 'หมายเลขออเดอร์' }}
                    name="order_id"
                    component={Input}
                    id="oider_id"
                    placeholder="หมายเลขออเดอร์"
                    //value="1234"
                  />
                  <Field
                    label={{ text: 'ชื่อร้านค้า' }}
                    name="outlet_id"
                    component={Select}
                    id="outlet_id"
                    placeholder="ชื่อร้านค้า"
                    showSearch
                    showArrow={false}
                    onSearch={onSearchMerchantDebounce}
                    selectOption={merchantDropDown}
                    filterOption={false}
                    allowClear={true}
                    onClear={onClearMerchant}
                  />
                </Col>
                <Col className="gutter-row" xs={12} sm={6}>
                  <Field
                    label={{ text: 'วันเวลาที่ทำรายการ' }}
                    name="order_created_at"
                    component={DateTimeRangePicker}
                    id="order_created_at"
                    placeholder="วันเวลาที่ทำรายการ"
                  />
                  <Field
                    label={{ text: 'ชื่อลูกค้า' }}
                    name="profile_id"
                    component={Select}
                    id="profile_id"
                    placeholder="ชื่อลูกค้า"
                    showSearch
                    showArrow={false}
                    onSearch={onSearchCustomerDebounce}
                    selectOption={customerDropDown}
                    filterOption={false}
                    allowClear={true}
                    onClear={onClearCustomer}
                  />
                </Col>
                <Col className="gutter-row" xs={12} sm={6}>
                  <Field
                    label={{ text: 'เบอร์โทรศัพท์' }}
                    name="tel"
                    component={Input}
                    id="tel"
                    placeholder="เบอร์โทรศัพท์"
                  />
                  <Field
                    label={{ text: 'วันเวลาเริ่มการสนทนา' }}
                    name="message_created_at"
                    component={DateTimeRangePicker}
                    id="message_created_at"
                    placeholder="วันเวลาเริ่มการสนทนา"
                  />
                </Col>
              </Row>

              <Button
                style={{ width: '120px', marginRight: '20px', marginTop: '20px' }}
                type="primary"
                size="middle"
                htmlType="submit"
              >
                ค้นหา
              </Button>

              <Button
                style={{ width: '120px', marginTop: '20px' }}
                type="default"
                size="middle"
                htmlType="submit"
                onClick={() => {
                  setValues({
                    order_id: '',
                    outlet_id: '',
                    profile_id: '',
                    tel: '',
                    order_created_at: {
                      start: null,
                      end: null,
                    },
                    message_created_at: {
                      start: null,
                      end: null,
                    },
                  })
                }}
              >
                เคลียร์
              </Button>
            </Form>
          )}
        </Formik>

        <br />
        <Card>
          <Table
            config={{
              dataTableTitle: 'ออเดอร์ทั้งหมด',
              loading: _isLoading,
              tableName: 'chat',
              tableColumns: column,
              action: ['view'],
              mappingPath: getMappingPath,
              dataSource: dataTable,
              handelDataTableLoad: handelDataTableLoad,
              pagination: pagination,
              scrollTable: scrollTable,
            }}
          />
        </Card>
      </MainLayout>
    </RecoilRoot>
  )
}

export default Chat
