import { ScrollTable } from '@/interface/dataTable'
import { uniqueId } from '@/utils/helpers'
import {
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  EllipsisOutlined,
  EyeOutlined,
} from '@ant-design/icons'
import {
  Button,
  Col,
  Dropdown,
  Menu,
  PageHeader,
  Row,
  Table as Tables,
  TablePaginationConfig,
} from 'antd'
import lodash, { get } from 'lodash'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { ReactElement } from 'react'
interface Props {
  config: Config
}

interface Config {
  dataTableTitle?: string
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
  isExport?: boolean
  isTableTitle?: boolean
  handelDataExport?: any
  isShowRowNumber?: boolean
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
    isExport,
    handelDataExport,
    isShowRowNumber = false,
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
      // Router.push()
      return `/${tableName}/${path}`
    }
    const Edit = () => {}
    const Delete = () => {}
    const actionElement = (rowData: any) => (
      <Menu style={{ border: 'none' }}>
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

    const singleRender = (rowData: any) => {
      if (action[0] === 'view') {
        const viewUrl = View(rowData)
        return (
          <>
            <Link href={viewUrl}>
              <a>
                <Menu style={{ border: 'none' }}>
                  <Menu.Item icon={<EyeOutlined />}>View</Menu.Item>
                </Menu>
              </a>
            </Link>
          </>
        )
      }
    }

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
              return singleRender(rowData)
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

  if (isShowRowNumber) {
    tableColumns = [
      {
        title: 'No.',
        key: 'index',
        align: 'center',
        render: (row: any, data: any, index: any) => {
          const current = get(pagination, 'current', 1)
          return (current - 1) * 10 + (index + 1)
        },
      },
      ...tableColumns,
    ]
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
      {isExport ? (
        <Row gutter={16}>
          <Col span={8}>
            {dataTableTitle && <PageHeader title={dataTableTitle} ghost={false}></PageHeader>}
          </Col>
          <Col span={16} style={{ textAlign: 'right' }}>
            <Button
              style={{ width: '120px' }}
              type="primary"
              size="middle"
              icon={<DownloadOutlined />}
              onClick={handelDataExport}
            >
              ดาวน์โหลด
            </Button>
          </Col>
        </Row>
      ) : (
        dataTableTitle && <PageHeader title={dataTableTitle} ghost={false}></PageHeader>
      )}

      <Tables
        scroll={scrollTable}
        columns={tableColumns}
        rowKey={determineRowKey}
        dataSource={dataSource}
        pagination={pagination}
        loading={loading}
        bordered
        onChange={handelDataTableLoad}
      />
    </>
  )
}
