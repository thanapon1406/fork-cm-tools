import { Pagination } from '@/interface/dataTable'
import { useEffect, useState } from 'react'

interface option {
  isAutoFetch: boolean
}

export default function useFetchTable(
  FetchFunc: Function,
  FilterObj: any,
  option: option = { isAutoFetch: true }
) {
  const [isLoading, setIsLoading] = useState(false)
  const [dataTable, setDataTable] = useState([])
  let [pagination, setPagination] = useState<Pagination>({
    total: 0,
    current: 1,
    pageSize: 10,
  })
  type FilterType = Parameters<typeof FilterObj>
  let [filter, setFilter] = useState<FilterType>(FilterObj)

  useEffect(() => {
    if (option.isAutoFetch) {
      fetchData()
    }
  }, [])

  const fetchData = async (filterObj: any = filter, paging: Pagination = pagination) => {
    const reqBody = {
      page: paging.current,
      per_page: paging.pageSize,
      ...filterObj,
    }
    setIsLoading(true)
    const { result, success } = await FetchFunc(reqBody)
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

  const handelDataTableChange = (pagination: any) => {
    fetchData(filter, pagination)
  }

  const handleFetchData = (filterReq: any) => {
    fetchData(filterReq, { current: 1, total: 0, pageSize: 10 })
  }

  return { isLoading, dataTable, handelDataTableChange, handleFetchData, pagination }
}
