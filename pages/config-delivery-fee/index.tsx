import Button from '@/components/Button'
import Card from '@/components/Card'
import Input from '@/components/Form/Input'
import Table from '@/components/Table'
import MainLayout from '@/layout/MainLayout'
import { tierPriceDelete, tierPriceList } from '@/services/tierPrices'
import {
  DeleteOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons'
import { Breadcrumb, Col, Modal, Row, Space, Typography } from 'antd'
import { Field, Form, Formik } from 'formik'
import moment from 'moment'
import { useRouter } from 'next/router'
import { ReactElement, useEffect, useState } from 'react'
import * as Yup from 'yup'

const { Title } = Typography
const { confirm } = Modal;


interface Props { }

interface Pagination {
  total: number
  current: number
  pageSize: number
}

interface filterObject {
  keyword?: string
  id?: string
}

export default function Merchant({ }: Props): ReactElement {
  const tableName = 'config-delivery-fee'
  const router = useRouter()
  const initialValues = {
    keyword: '',
  }

  let [dataTable, setDataTable] = useState([])
  let [_isLoading, setIsLoading] = useState(true)
  let [pagination, setPagination] = useState<Pagination>({
    total: 0,
    current: 1,
    pageSize: 10,
  })
  let [filter, setFilter] = useState<filterObject>({
    keyword: '',
    id: '',
  })

  useEffect(() => {
    fetchData()
  }, [])

  const Schema = Yup.object().shape({})

  const fetchData = async (filterObj: filterObject = filter, paging: Pagination = pagination) => {
    const reqBody = {
      page: paging.current,
      per_page: paging.pageSize,
      ...filterObj,
    }
    setIsLoading(true)
    const { result, success } = await tierPriceList(reqBody)
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

  const fetchDeleteTierPrice = async (filterObj: filterObject) => {
    const reqBody = {
      id: filterObj.id
    }
    const { result, success } = await tierPriceDelete(reqBody)
    if (success) {
      fetchData()
    }
  }

  const handleSubmit = (values: any) => {
    let reqFilter: filterObject = {
      keyword: values.keyword,
    }
    fetchData(reqFilter, { current: 1, total: 0, pageSize: 10 })
  }

  const handelDataTableLoad = (pagination: any) => {
    fetchData(filter, pagination)
  }

  const column = [
    {
      title: 'Tier Price',
      dataIndex: 'name',
      align: 'left',
    },
    {
      title: 'จำนวนจังหวัด',
      dataIndex: 'total_province',
      align: 'center',
    },
    {
      title: 'จำนวนเขต',
      dataIndex: 'total_district',
      align: 'center',
    },
    {
      title: 'จำนวนแขวง',
      dataIndex: 'total_sub_district',
      align: 'center',
    },
    {
      title: 'วันและเวลาที่สร้าง',
      dataIndex: 'created_at',
      align: 'center',
      render: (row: any) => {
        return moment(row).format('YYYY-MM-DD HH:mm')
      },
    },
    {
      title: '',
      key: 'action',
      render: (_: any, record: any) => (
        viewButtonRender(record)
      )
    },

  ]

  const viewButtonRender = (rowData: any) => {
    let path = rowData.id
    const viewUrl = `/${tableName}/${path}`
    return (
      <Space>
        <Button
          style={{ width: '40px' }}
          type="default"
          size="middle"
          htmlType="button"
          icon={<DeleteOutlined />}
          onClick={() => showDeleteConfirm(rowData)}
        >
        </Button>
      </Space>
    )
  }

  const handleOpenCreate = () => {
    router.push(`/${tableName}/create`)
  }

  const showDeleteConfirm = (rowData: any) => {
    confirm({
      title: 'ยืนยันการลบ Tier Price',
      icon: <ExclamationCircleOutlined />,
      content: `คุณต้องการลบ ${rowData.name} ใช่ไหม`,
      okText: 'ลบ',
      okType: 'danger',
      cancelText: 'ยกเลิก',
      onOk() {
        fetchDeleteTierPrice({ id: rowData?.id })
      }
    });
  };

  return (
    <MainLayout>

      <Title level={4}>Config Delivety Fee</Title>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>ค่าส่งตามระยะทาง</Breadcrumb.Item>
        <Breadcrumb.Item>ค่าส่งตามระยะทางทั้งหมด</Breadcrumb.Item>

        <Button
          style={{ float: 'right', backGroundColor: 'forestgreen !important' }}
          // type="dashed"
          size="middle"
          className="confirm-button"
          onClick={handleOpenCreate}
        >
          สร้างราคาค่าโดยสาร
        </Button>
      </Breadcrumb>

      <Card>
        <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={Schema}>
          {(values) => (
            <Form>
              <Row gutter={16}>
                <Col className="gutter-row" span={24}>
                  <Field
                    label={{ text: 'คำค้นหา' }}
                    name="keyword"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="keyword"
                    placeholder="คำค้นหา"
                  />
                  <div className="ant-form ant-form-vertical" style={{ textAlign: 'right' }}>
                    <Space >
                      <Button
                        style={{ width: '120px', marginTop: '31px' }}
                        type="default"
                        size="middle"
                        htmlType="reset"
                      >
                        เคลียร์
                      </Button>
                      <Button
                        style={{ width: '120px', marginTop: '31px' }}
                        type="primary"
                        size="middle"
                        htmlType="submit"
                      >
                        ค้นหา
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
            dataTableTitle: 'รายการกำหนดค่าโดยสาร',
            loading: _isLoading,
            tableName: tableName,
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
