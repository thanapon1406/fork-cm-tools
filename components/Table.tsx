import { ScrollTable } from '@/interface/dataTable'
import { uniqueId } from '@/utils/helpers'
import { DeleteOutlined, EditOutlined, EllipsisOutlined, EyeOutlined } from '@ant-design/icons'
import { Dropdown, Menu, PageHeader, Table as Tables, TablePaginationConfig } from 'antd'
import lodash from 'lodash'
import { useRouter } from 'next/router'
import React, { ReactElement } from 'react'
interface Props {
  config: Config
}

interface Config {
  dataTableTitle: string
  tableColumns: Array<any>
  dataSource: Array<any>
  tableName: string
  action?: Array<'view' | 'edit' | 'delete'>
  loading: boolean
  handelDataTableLoad: any
  pagination: TablePaginationConfig | false
  customAction?: any
  scrollTable?: ScrollTable
  mappingPath?: (rowData: any) => string
}

export default function Table({ config }: Props): ReactElement {
  const {
    dataTableTitle,
    action,
    dataSource,
    loading,
    tableName,
    handelDataTableLoad,
    scrollTable,
    mappingPath,
  } = config
  let { tableColumns, pagination } = config
  if (pagination) {
    pagination = {
      ...pagination,
      pageSizeOptions: ['10', '20', '50', '100'],
      showSizeChanger: true,
      showTotal: (total: any, range: any) => `${range[0]}-${range[1]} of ${total} items`,
    }
  }

  const Router = useRouter()
  if (action) {
    let View = (rowData: any) => {
      let path = rowData.id
      if (mappingPath) {
        path = mappingPath(rowData)
      }
      Router.push(`/${tableName}/${path}`)
    }
    const Edit = () => {}
    const Delete = () => {}
    const actionElement = (rowData: any) => (
      <Menu style={{ width: 130 }}>
        {action.map((action) => {
          if (action === 'view') {
            return (
              <Menu.Item key={`${uniqueId()}`} icon={<EyeOutlined />} onClick={() => View(rowData)}>
                View
              </Menu.Item>
            )
          }

          if (action === 'edit') {
            return (
              <Menu.Item key={`${uniqueId()}`} icon={<EditOutlined />} onClick={Edit}>
                Edit
              </Menu.Item>
            )
          }

          if (action === 'delete') {
            return (
              <Menu.Item key={`${uniqueId()}`} icon={<DeleteOutlined />} onClick={Delete}>
                Delete
              </Menu.Item>
            )
          }
          return
        })}
      </Menu>
    )
    const isCustomAction = lodash.find(tableColumns, { dataIndex: 'action' })
    if (!isCustomAction) {
      tableColumns = [
        ...tableColumns,
        {
          title: '',
          dataIndex: 'action',
          render: (rows: any, rowData: any) => {
            const { id } = rowData
            if (action.length === 1) {
              return actionElement(rowData)
            } else {
              return (
                <Dropdown overlay={actionElement(id)} trigger={['click']}>
                  <EllipsisOutlined style={{ cursor: 'pointer', fontSize: '24px' }} />
                </Dropdown>
              )
            }
          },
        },
      ]
    }
  }

  const determineRowKey = (item: any) => {
    if (mappingPath) {
      return mappingPath(item)
    } else {
      return item.id
    }
  }

  return (
    <>
      <PageHeader title={dataTableTitle} ghost={false}></PageHeader>
      <Tables
        scroll={scrollTable}
        columns={tableColumns}
        rowKey={determineRowKey}
        dataSource={dataSource}
        pagination={pagination}
        loading={loading}
        onChange={handelDataTableLoad}
      />
    </>
  )
}
