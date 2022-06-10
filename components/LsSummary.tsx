import Table from '@/components/Table'
import { Pagination } from '@/interface/dataTable'
import { lsSummaryInterface } from '@/services/ls'
import { getDeliveryTiers } from '@/services/rider'
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
          <Text>{text}</Text>
        </Col>
        <Col className="gutter-row" span={12}>
          {record?.is_support &&
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
          }
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
    dataIndex: 'discount',
    align: 'center',
    key: 'discount',
    width: '100px',
    wrap: true,
    center: true,
    render: (text: any, record: any) => {
      return numberFormat(text)
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
      return numberFormat(record?.is_support ? (record?.normal_price - record?.discount) : record?.normal_price)
    },
  },
  {
    title: 'Platform LS',
    dataIndex: 'ls_platform_amount',
    align: 'center',
    key: 'ls_platform_amount',
    width: '100px',
    wrap: true,
    center: true,
    render: (text: any, record: any) => {
      return numberFormat(text)
    },
  },
  {
    title: 'Merchant LS',
    dataIndex: 'ls_merchant_amount',
    align: 'center',
    key: 'ls_merchant_amount',
    width: '100px',
    wrap: true,
    center: true,
    render: (text: any, record: any) => {
      return numberFormat(text)

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
      return numberFormat((record?.ls_platform_amount + record?.ls_merchant_amount) - record?.discount)
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
  let [primeNameList, setPrimeNameList] = useState([])
  let [orderAmount, setOrderAmount] = useState('')
  let [distance, setDistance] = useState('')


  const router = useRouter()
  const ssoId = router.query.sso_id as string

  const betweenArray = (x: any, y: any, min: any, max: any) => {
    for (let i = x; i < y; i++) {
      if (i >= min && x <= max) {
        return true
      }
    }
    return false
  }
  const handelDataTableLoad = (pagination: any) => {
    fetchData({ ...payload, page: pagination.current, per_page: pagination.pageSize })
  }


  const fetchData = async (params: lsSummaryInterface) => {
    // Tier
    setIsLoading(true)

    // p boss data
    params = {
      "name": "Boss Test#1",
      "type": "customer_discount",
      "type_name": "กำหนดจากส่วนลดที่ลูกค้าจะได้รับ",
      "order_amount": "0",
      "discount_type": "baht",
      "discount_amount": "5",
      "min_distance": "0",
      "max_distance": "5",
      "ls_type": "baht",
      "ls_platform_amount": "10",
      "ls_merchant_amount": "2",
      "start_date": "",
      "end_date": "",
      "province_ids": [1],
      "district_ids": [],
      "sub_district_ids": [],
    }
    //

    // call here
    const { result, success } = await getDeliveryTiers({
      "province_id": params.province_ids,
      "page": 1,
      "per_page": 100
    })
    if (success) {
      const { data } = result
      const array: any = []
      const nameArray: any = []
      let min = parseInt(params.min_distance!)
      let max = parseInt(params.max_distance!)
      setOrderAmount(params.order_amount!)
      setDistance(min + ' - ' + max)
      data?.map((value: any, key: number) => {
        array[key] = []
        value?.tier_prices?.map((tierPricesValue: any, tierPricesKey: number) => {
          let is_support = betweenArray(tierPricesValue.min, tierPricesValue.max, min, max)
          if (tierPricesKey > 0) {
            tierPricesValue.min = ">" + " " + tierPricesValue.min
          }
          // find discount type percent
          let discount = parseInt(params.discount_amount!)
          if (params.discount_type !== "baht") {
            discount = (parseInt(params.discount_amount!) * parseInt(tierPricesValue.price!)) / 100
          }
          // end find discount type percent

          // find ls type percent
          let lsPlatformAmount = parseInt(params.ls_platform_amount!)
          let lsMerchantAmount = parseInt(params.ls_merchant_amount!)
          if (params.ls_type !== "baht") {
            lsPlatformAmount = (parseInt(params.ls_platform_amount!) * discount) / 100
            lsMerchantAmount = (parseInt(params.ls_merchant_amount!) * discount) / 100
          }
          // end find ls type percent

          array[key]?.push({
            'distance': tierPricesValue.min + " - " + tierPricesValue.max,
            'normal_price': parseInt(tierPricesValue.price!),
            'is_support': is_support,
            'discount': discount,
            'ls_platform_amount': lsPlatformAmount,
            'ls_merchant_amount': lsMerchantAmount
          })
        })
        nameArray?.push(value.name)
      })

      setPrimeNameList(nameArray)
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
      <Title level={5}>ยอดสุทธิได้ตั้งแต่ {orderAmount} บาท ขึ้นไป</Title>
      <Title level={5}>ระยะทาง ({distance} กม.)</Title>

      {
        primeNameList.length > 0 &&
        primeNameList?.map((primeName: any, primeKet: number) => {
          return <>
            <Title level={5}>Prime {primeName}
              {/* <Text style={{ color: '#d9d9d9' }}>(... ร้านอาหาร)</Text> */}
            </Title>
            <br />
            <Table
              config={{
                dataTableTitle: '',
                loading: _isLoading,
                tableName: 'lsSummary',
                tableColumns: columns,
                dataSource: dataTable[primeKet],
                handelDataTableLoad: handelDataTableLoad,
                pagination: false,
              }}
            />
            <br />
          </>
        })
      }
    </Card>
  )
}

export default LsSummaryComponent
