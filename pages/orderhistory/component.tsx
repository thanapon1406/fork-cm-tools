import CustomBadge from '@/components/Badge'
import Table from '@/components/Table'
import { Pagination, ScrollTable } from '@/interface/dataTable'
import { OrderDetail } from '@/interface/order'
import { metaReportPagination } from '@/interface/pagination'
import { getOrderTransaction, requestReportInterface } from '@/services/report'
import { Card, TablePaginationConfig } from 'antd'
import { isEmpty, isNull, isUndefined } from 'lodash'
import Moment from 'moment'
import { useRouter } from 'next/router'
import { ReactElement, useEffect, useState } from 'react'
import { numberFormat } from 'utils/helpers'
interface Props {
  payload: requestReportInterface
  tableHeader?: ReactElement
  isPagination?: Pagination | false
}

const columns = [
  {
    title: 'เลขออเดอร์',
    dataIndex: 'order_no',
    align: 'center',
    key: 'order_no',
    width: '200px',
    wrap: true,
    center: true,
    render: (text: any, record: any) => {
      return record.order_no
    },
  },
  {
    title: 'ชื่อร้านค้า',
    dataIndex: 'outlet_name',
    align: 'center',
    key: 'outlet_name',
    width: '200px',
    wrap: true,
    center: true,
    render: (text: any, record: any) => {
      return record.outlet_name
    },
  },
  {
    title: 'ชื่อลูกค้า',
    dataIndex: 'buyer_info',
    align: 'center',
    key: 'buyer_info',
    width: '200px',
    wrap: true,
    center: true,
    render: (text: any, record: any) => {
      if (
        !isUndefined(record.buyer_info) &&
        !isNull(record.buyer_info?.first_name) &&
        !isEmpty(record.buyer_info?.first_name)
      ) {
        return record.buyer_info.first_name + ' ' + record.buyer_info.last_name
      } else {
        return '-'
      }
    },
  },
  {
    title: 'ชื่อไรเดอร์',
    dataIndex: 'rider_info',
    align: 'center',
    key: 'rider_info',
    width: '200px',
    wrap: true,
    center: true,
    render: (text: any, record: any) => {
      if (
        !isUndefined(record.rider_info) &&
        !isNull(record.rider_info?.first_name) &&
        !isEmpty(record.rider_info?.first_name)
      ) {
        return record.rider_info?.first_name + ' ' + record.rider_info?.last_name
      } else {
        return '-'
      }
    },
  },
  {
    title: 'ราคา',
    dataIndex: 'total',
    align: 'center',
    key: 'total',
    width: '100px',
    wrap: true,
    center: true,
    render: (text: any, record: any) => {
      return numberFormat(text)
    },
  },
  {
    title: 'เวลา',
    dataIndex: 'client_time',
    align: 'center',
    key: 'client_time',
    width: '200px',
    wrap: true,
    center: true,
    render: (text: any, record: any) => {
      return Moment(text).format('YYYY-MM-DD HH:mm:ss')
    },
  },
  {
    title: 'สถานะ order',
    dataIndex: 'status',
    align: 'center',
    key: 'status',
    width: '150px',
    wrap: true,
    center: true,
    render: (text: any, record: any) => {
      return <CustomBadge badgeStatus={text} badgeText={text}></CustomBadge>
    },
  },
  {
    title: 'สถานะ merchant',
    dataIndex: 'merchant_status',
    align: 'center',
    key: 'merchant_status',
    width: '150px',
    wrap: true,
    center: true,
    render: (text: any, record: any) => {
      return <CustomBadge badgeStatus={text} badgeText={text}></CustomBadge>
    },
  },
  {
    title: 'สถานะ rider',
    dataIndex: 'rider_status',
    align: 'center',
    key: 'rider_status',
    width: '150px',
    wrap: true,
    center: true,
    render: (text: any, record: any) => {
      return <CustomBadge badgeStatus={text} badgeText={text}></CustomBadge>
    },
  },
]

const OrderHistoryComponent = ({
  payload,
  tableHeader,
  isPagination = false,
}: Props): ReactElement => {
  let [dataTable, setDataTable] = useState([])
  let [_isLoading, setIsLoading] = useState(true)
  let [pagination, setPagination] = useState<false | TablePaginationConfig>(false)
  let [scrollTable, setScrollTable] = useState<ScrollTable>({ x: 0 })

  const router = useRouter()
  const ssoId = router.query.sso_id as string

  const handelDataTableLoad = (pagination: any) => {
    fetchOrderTransaction({ ...payload, page: pagination.current, per_page: pagination.pageSize })
  }

  const validatePagination = (meta: metaReportPagination) => {
    if (isPagination) {
      setPagination({
        pageSize: meta.per_page,
        current: meta.page,
        total: meta.total,
      })
    } else {
      setPagination(false)
    }
  }

  const fetchOrderTransaction = async (params: requestReportInterface) => {
    params.sso_id = !isEmpty(params.sso_id) ? params.sso_id : ssoId
    const { result, success } = await getOrderTransaction(params)
    setIsLoading(true)
    if (success) {
      const { meta, data } = result

      setDataTable(data)
      setIsLoading(false)

      validatePagination({
        per_page: parseInt(meta.per_page),
        page: parseInt(meta.page),
        total: parseInt(meta.total),
      })
    }
  }

  useEffect(() => {
    if (!isUndefined(payload)) {
      validatePagination({
        per_page: 0,
        page: 0,
        total: 0,
      })

      fetchOrderTransaction(payload)
    }
  }, [payload])

  const getMappingPath = (rowData: OrderDetail) => {
    return `${rowData.order_no}?brand_id=${rowData.brand_id}&outlet_id=${rowData.outlet_id}`
  }

  return (
    <Card>
      {tableHeader}

      <Table
        config={{
          dataTableTitle: 'รายการออเดอร์',
          loading: _isLoading,
          tableName: 'orderhistory',
          tableColumns: columns,
          action: ['view'],
          mappingPath: getMappingPath,
          dataSource: dataTable,
          handelDataTableLoad: handelDataTableLoad,
          pagination: pagination,
          scrollTable: scrollTable,
        }}
      />
    </Card>
  )
}

export default OrderHistoryComponent