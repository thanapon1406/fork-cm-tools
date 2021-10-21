import CustomBadge from '@/components/Badge'
import Table from '@/components/Table'
import { Pagination } from '@/interface/dataTable'
import { metaReportPagination } from '@/interface/pagination'
import { getOrderTransaction, requestReportInterface } from '@/services/report'
import { Card, TablePaginationConfig } from 'antd'
import { isUndefined } from 'lodash'
import Moment from 'moment'
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
    render: (text: any, record: any) => {
      return record.order_no
    },
  },
  {
    title: 'ร้านอาหาร',
    dataIndex: 'outlet_name',
    align: 'center',
    key: 'outlet_name',
    render: (text: any, record: any) => {
      return record.outlet_name
    },
  },
  {
    title: 'ปลายทาง',
    dataIndex: 'address',
    align: 'center',
    key: 'address',
    render: (text: any, record: any) => {
      return record.outlet_info.address
    },
  },
  {
    title: 'รายการอาหาร',
    dataIndex: 'total_products',
    align: 'center',
    key: 'total_products',
  },
  {
    title: 'ราคา',
    dataIndex: 'total',
    align: 'center',
    key: 'total',
    render: (text: any, record: any) => {
      return numberFormat(text)
      // return text
    },
  },
  {
    title: 'เวลา',
    dataIndex: 'client_time',
    align: 'center',
    key: 'client_time',
    render: (text: any, record: any) => {
      return Moment(text).format('YYYY-MM-DD HH:mm:ss')
    },
  },
  {
    title: 'สถานะ order',
    dataIndex: 'status',
    align: 'center',
    key: 'status',
    render: (text: any, record: any) => {
      return <CustomBadge badgeStatus={text} badgeText={text}></CustomBadge>
    },
  },
  ,
  {
    title: 'สถานะ merchant',
    dataIndex: 'merchant_status',
    align: 'center',
    key: 'merchant_status',
    render: (text: any, record: any) => {
      return <CustomBadge badgeStatus={text} badgeText={text}></CustomBadge>
    },
  },
  ,
  {
    title: 'สถานะ rider',
    dataIndex: 'rider_status',
    align: 'center',
    key: 'rider_status',
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

  return (
    <Card>
      {tableHeader}

      <Table
        config={{
          dataTableTitle: 'รายการออเดอร์',
          loading: _isLoading,
          tableName: 'orderhistory',
          tableColumns: columns,
          // action: ['view'],
          dataSource: dataTable,
          handelDataTableLoad: handelDataTableLoad,
          pagination: pagination,
        }}
      />
    </Card>
  )
}

export default OrderHistoryComponent
