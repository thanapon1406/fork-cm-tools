import Table from '@/components/Table'
import { Pagination } from '@/interface/dataTable'
import { lsSummaryInterface } from '@/services/ls'
import { Button, Card, Col, Row, Typography } from 'antd'
import { isUndefined } from 'lodash'
import { useRouter } from 'next/router'
import { ReactElement, useEffect, useState } from 'react'
import { numberFormat } from 'utils/helpers'
const { Title, Text } = Typography

interface Props {
  payload: lsSummaryInterface
  tableHeader?: ReactElement
  isPagination?: Pagination | false
}
const columns = [
  {
    title: 'ระยะทาง',
    dataIndex: 'distance',
    align: 'center',
    key: 'distance',
    width: '160px',
    wrap: true,
    center: true,
    render: (text: any, record: any) => {
      return <Row gutter={16}
        style={{ alignItems: "center" }}
        justify="center">
        <Col className="gutter-row" span={12}>
          {/* <Text>{'5 - 10'}</Text> */}
          <Text>{text}</Text>
        </Col>
        <Col className="gutter-row" span={12}>
          <Button type="primary"
            style={{
              background: '#ffdbc6',
              borderColor: '#fec4a2',
              color: '#ffa572',
              borderRadius: '8px',
              cursor: 'default',
              width: '100%'
            }}
          >
            Support Area
          </Button>
        </Col>
      </Row>
    },
  },
  {
    title: 'ค่าจัดส่ง (เดิม)',
    dataIndex: 'normal_price',
    align: 'center',
    key: 'normal_price',
    width: '100px',
    wrap: true,
    center: true,
    render: (text: any, record: any) => {
      return numberFormat(text)
    },
  },
  {
    title: 'ส่วนลดค่าส่งของลูกค้า',
    dataIndex: '',
    align: 'center',
    key: '',
    width: '100px',
    wrap: true,
    center: true,
    render: (text: any, record: any) => {
      return numberFormat(0)
    },
  },
  {
    title: 'ลูกค้าจ่าย',
    dataIndex: '',
    align: 'center',
    key: '',
    width: '100px',
    wrap: true,
    center: true,
    render: (text: any, record: any) => {
      return numberFormat(0)
    },
  },
  {
    title: 'Platform LS',
    dataIndex: '',
    align: 'center',
    key: '',
    width: '100px',
    wrap: true,
    center: true,
    render: (text: any, record: any) => {
      return numberFormat(0)
    },
  },
  {
    title: 'Merchant LS',
    dataIndex: '',
    align: 'center',
    key: '',
    width: '100px',
    wrap: true,
    center: true,
    render: (text: any, record: any) => {
      return numberFormat(0)

    },
  },
  {
    title: 'เข้า Platform',
    dataIndex: '',
    align: 'center',
    key: '',
    width: '100px',
    wrap: true,
    center: true,
    render: (text: any, record: any) => {
      return numberFormat(0)
    },
  },

]

const LsSummaryComponent = ({
  payload,
  tableHeader,
  isPagination = false,
}: Props): ReactElement => {
  let [dataTable, setDataTable] = useState([])
  let [_isLoading, setIsLoading] = useState(true)
  let [primeName, setPrimeName] = useState('')

  const router = useRouter()
  const ssoId = router.query.sso_id as string

  const handelDataTableLoad = (pagination: any) => {
    fetchData({ ...payload, page: pagination.current, per_page: pagination.pageSize })
  }


  const fetchData = async (params: lsSummaryInterface) => {
    // Tier
    setIsLoading(true)
    // call here
    const data: any = [{
      "name": "tier_price 7",
      "tier_prices": [
        {
          "min": 0,
          "max": 5,
          "price": 10
        },
        {
          "min": 5,
          "max": 10,
          "price": 20
        },
        {
          "min": 10,
          "max": 15,
          "price": 30
        },
        {
          "min": 15,
          "max": 20,
          "price": 40
        },
      ]
    }]
    if (true) {
      const array: any = []
      data?.map((d: any) => {
        d?.tier_prices?.map((value: any, key: number) => {
          if (key > 0) {
            value.min = ">" + " " + value.min
          }
          array.push({
            'distance': value.min + " - " + value.max,
            'normal_price': value.price
          })
        })
        setPrimeName(d.name)
      })
      console.log("array: ", array)
      setDataTable(array)
      setIsLoading(false)
    }
    // End Tier
  }

  useEffect(() => {
    if (!isUndefined(payload)) {
      fetchData(payload)
    }
  }, [payload])


  return (
    <Card>
      {tableHeader}
      <Title level={4}>LS Summary</Title>
      <Title level={5}>ยอดสุทธิได้ตั้งแต่ ... บาท ขึ้นไป</Title>
      <Title level={5}>ระยะทาง (กม.)</Title>
      <Title level={5}>Prime {primeName} <Text style={{ color: '#d9d9d9' }}>(... ร้านอาหาร)</Text></Title>
      <br />
      <Table
        config={{
          dataTableTitle: '',
          loading: _isLoading,
          tableName: 'lsSummary',
          tableColumns: columns,
          dataSource: dataTable,
          handelDataTableLoad: handelDataTableLoad,
          pagination: false,
        }}
      />
    </Card>
  )
}

export default LsSummaryComponent
