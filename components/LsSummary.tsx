import Table from '@/components/Table'
import { Pagination } from '@/interface/dataTable'
import { lsSummaryInterface } from '@/services/ls-config'
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
    dataIndex: 'customer',
    align: 'center',
    key: 'customer',
    width: '100px',
    wrap: true,
    center: true,
    render: (text: any, record: any) => {
      return numberFormat(text)
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
    dataIndex: 'income',
    align: 'center',
    key: 'income',
    width: '100px',
    wrap: true,
    center: true,
    render: (text: any, record: any) => {
      return numberFormat(text)
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
  let [tierNameList, setTierNameList] = useState([])
  let [orderAmount, setOrderAmount] = useState('')
  let [distance, setDistance] = useState('')


  const router = useRouter()
  const ssoId = router.query.sso_id as string

  const betweenArray = (x: any, y: any, min: any, max: any) => {
    if (x === 0 && min % 1 !== 0) {
      x = min
    } else {
      x += 0.1
    }
    for (let i = x; i <= y; i++) {
      if (i >= min && i <= max) {
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
    // call here
    const { result, success } = await getDeliveryTiers({
      "province_ids": params.province_ids,
      "page": 1,
      "per_page": 100
    })
    if (success) {
      const { data } = result
      const array: any = []
      const nameArray: any = []
      let min = parseFloat(params.min_distance!)
      let max = parseFloat(params.max_distance!)
      setOrderAmount(params.order_amount!)
      setDistance((isNaN(min) ? 0 : min) + ' - ' + (isNaN(max) ? 0 : max))
      data?.map((value: any, key: number) => {
        array[key] = []
        value?.tier_prices?.map((tierPricesValue: any, tierPricesKey: number) => {
          let isSupport = betweenArray(tierPricesValue.min, tierPricesValue.max, min, max)
          if (tierPricesKey > 0) {
            tierPricesValue.min = ">" + " " + tierPricesValue.min
          }

          // TYPE 
          // customer_discount
          // customer_pay
          // subsidize

          // find discount
          let discount = 0
          let normalPrice = parseFloat(tierPricesValue.price!)
          let customer = normalPrice
          let lsPlatformAmount = 0
          let lsMerchantAmount = 0
          let discountAmount = parseFloat(params.discount_amount!)
          if (isSupport) {
            lsPlatformAmount = parseFloat(params.ls_platform_amount!)
            lsMerchantAmount = parseFloat(params.ls_merchant_amount!)
            switch (params.type) {
              case "subsidize":
                if (params.ls_type !== "baht") {
                  lsPlatformAmount = (lsPlatformAmount * normalPrice) / 100
                  lsMerchantAmount = (lsMerchantAmount * normalPrice) / 100
                }
                discount = lsPlatformAmount + lsMerchantAmount
                customer = normalPrice - discount
                break;
              case "customer_pay":
                customer = discountAmount
                discount = normalPrice - customer
                break;
              default:
                discount = params.discount_type !== "baht" ? ((discountAmount * normalPrice) / 100) : discountAmount
                customer = normalPrice - discount
            }
            if (params.ls_type !== "baht" && params.type !== "subsidize") {
              lsPlatformAmount = (lsPlatformAmount * discount) / 100
              lsMerchantAmount = (lsMerchantAmount * discount) / 100
            }
            // end find discount
          }

          let income = 0
          if (discount >= 0) {
            if (params.ls_type === "baht" && params.type === "customer_discount") {
              income = (lsMerchantAmount + lsPlatformAmount) - discount
            } else {
              if ((discount - normalPrice) >= 0) {
                income = (discount - normalPrice)
              }
            }
          } else {
            income = (discount * -1)
          }

          array[key]?.push({
            'distance': tierPricesValue.min + " - " + tierPricesValue.max,
            'normal_price': normalPrice,
            'is_support': isSupport,
            'discount': discount,
            'ls_platform_amount': lsPlatformAmount < 0 ? 0 : lsPlatformAmount,
            'ls_merchant_amount': lsMerchantAmount < 0 ? 0 : lsMerchantAmount,
            'customer': customer < 0 ? 0 : customer,
            'income': income
          })
        })
        nameArray?.push(value.name)
      })

      setTierNameList(nameArray)
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
    <Card
      bordered={false}
      bodyStyle={{
        padding: "0px"
      }}
    >
      {tableHeader}
      <Title level={5}>ยอดสุทธิได้ตั้งแต่ {orderAmount} บาท ขึ้นไป</Title>
      <Title level={5}>ระยะทาง ({distance} กม.)</Title>

      {
        tierNameList.length > 0 &&
        tierNameList?.map((tierName: any, tierKey: number) => {
          return <>
            <Title level={5}>Tier {tierName}
              {/* <Text style={{ color: '#d9d9d9' }}>(... ร้านอาหาร)</Text> */}
            </Title>
            <br />
            <Table
              config={{
                dataTableTitle: '',
                loading: _isLoading,
                tableName: 'lsSummary',
                tableColumns: columns,
                dataSource: dataTable[tierKey],
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
