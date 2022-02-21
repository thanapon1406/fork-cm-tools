import CustomBadge from '@/components/Badge'
import Table from '@/components/Table'
import { Pagination, ScrollTable } from '@/interface/dataTable'
import { metaReportPagination } from '@/interface/pagination'
import {
  promotionTrackingInterface,
  promotionTrackingList,
  promotionTrackingQueryList,
} from '@/services/promotion'
import { Card, TablePaginationConfig } from 'antd'
import { isUndefined } from 'lodash'
import Moment from 'moment'
import { useRouter } from 'next/router'
import { ReactElement, useEffect, useState } from 'react'
import { numberFormat } from 'utils/helpers'
interface Props {
  payload: promotionTrackingInterface
  tableHeader?: ReactElement
  isPagination?: Pagination | false
}

const columns = [
  {
    title: 'แบรนด์',
    dataIndex: 'brand_name',
    align: 'center',
    key: 'brand_name',
    width: '200px',
    wrap: true,
    center: true,
    render: (text: any, record: any) => {
      return record.brand_name || '-'
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
      return record.outlet_name || '-'
    },
  },

  {
    title: 'วันที่/เวลา',
    dataIndex: 'created_at',
    align: 'center',
    key: 'created_at',
    width: '200px',
    wrap: true,
    center: true,
    render: (text: any, record: any) => {
      return Moment(text).format('YYYY-MM-DD HH:mm:ss')
    },
  },
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
    title: 'ชื่อแคมเปญ',
    dataIndex: 'campaign_name',
    align: 'center',
    key: 'campaign_name',
    width: '200px',
    wrap: true,
    center: true,
    render: (text: any, record: any) => {
      return record.campaign_name || '-'
    },
  },
  {
    title: 'โปรโมโค้ด',
    dataIndex: 'code',
    align: 'center',
    key: 'code',
    width: '100px',
    wrap: true,
    center: true,
    render: (text: any, record: any) => {
      return record.code || '-'
    },
  },
  {
    title: 'ราคา',
    dataIndex: 'sub_total',
    align: 'center',
    key: 'sub_total',
    width: '100px',
    wrap: true,
    center: true,
    render: (text: any, record: any) => {
      return numberFormat(text)
    },
  },
  {
    title: 'ส่วนลดแคมเปญ',
    dataIndex: 'discount_amount',
    align: 'center',
    key: 'discount_amount',
    width: '100px',
    wrap: true,
    center: true,
    render: (text: any, record: any) => {
      return numberFormat(text)
    },
  },
  {
    title: 'ชื่อส่วนลดร้านค้า',
    dataIndex: 'promotion_name',
    align: 'center',
    key: 'promotion_name',
    width: '100px',
    wrap: true,
    center: true,
    render: (text: any, record: any) => {
      return record.promotion_name || '-'
    },
  },
  {
    title: 'ส่วนลดร้านค้า',
    dataIndex: 'product_discount',
    align: 'center',
    key: 'product_discount',
    width: '100px',
    wrap: true,
    center: true,
    render: (text: any, record: any) => {
      return numberFormat(text)
    },
  },
  {
    title: 'ค่าจัดส่ง',
    dataIndex: 'delivery_fee',
    align: 'center',
    key: 'delivery_fee',
    width: '100px',
    wrap: true,
    center: true,
    render: (text: any, record: any) => {
      return numberFormat(text)
    },
  },
  {
    title: 'ราคาสุทธิ',
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
    title: 'สถานะคูปอง',
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
]

const PromotionTrackingComponent = ({
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
    fetchTransaction({ ...payload, page: pagination.current, per_page: pagination.pageSize })
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

  const fetchTransaction = async (params: promotionTrackingQueryList) => {
    const { result, success } = await promotionTrackingList(params)
    setIsLoading(true)
    if (success) {
      const { meta, data } = result

      setDataTable(data)
      setIsLoading(false)

      validatePagination({
        per_page: parseInt(meta.per_page),
        page: parseInt(meta.page),
        total: meta.total_count,
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

      fetchTransaction(payload)
    }
  }, [payload])

  return (
    <Card>
      {tableHeader}

      <Table
        config={{
          dataTableTitle: 'รายงานแคมเปญทั้งหมด',
          loading: _isLoading,
          tableName: 'promotion_tracking',
          tableColumns: columns,
          dataSource: dataTable,
          handelDataTableLoad: handelDataTableLoad,
          pagination: pagination,
          scrollTable: scrollTable,
        }}
      />
    </Card>
  )
}

export default PromotionTrackingComponent
