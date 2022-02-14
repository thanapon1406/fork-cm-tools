import { exportOrderTransactionExcel, getFileDetail } from '@/services/report'
import { humanFileSize } from '@/utils/helpers'
import { CloudDownloadOutlined, FrownOutlined } from '@ant-design/icons'
import { Col, Row } from 'antd'
import lodash from 'lodash'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
const Download = () => {
  const router = useRouter()

  let [fetchedData, setFetchedData] = useState(false)
  let [fileDetail, setFileDetail] = useState<any>(null)
  const filekey = router.query.id as string

  async function DownloadFile() {
    if (fileDetail?.signed_url) {
      const link = document.createElement('a')
      link.href = fileDetail?.signed_url
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else {
      await exportOrderTransactionExcel({ key: filekey })
    }
  }

  async function GetFileDetail() {
    await getFileDetail({ key: filekey })
      .then(async (response: any) => {
        const { result, success, status } = response
        setFetchedData(true)
        if (status === 200) {
          setFileDetail({
            name: lodash.get(result, 'data.file_name'),
            size: lodash.get(result, 'data.file_size'),
            created_at: lodash.get(result, 'data.created_at'),
            signed_url: lodash.get(result, 'data.signed_url'),
          })
          if (lodash.get(result, 'data.signed_url')) {
            const link = document.createElement('a')
            link.href = lodash.get(result, 'data.signed_url')
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          } else {
            await exportOrderTransactionExcel({ key: filekey })
          }
        }
      })
      .catch((err: any) => {
        setFetchedData(true)
      })
  }

  useEffect(() => {
    GetFileDetail()
  }, [filekey])

  return (
    <Row justify="center" align="middle">
      <Col className="center">
        {fetchedData && fileDetail != null && (
          <>
            <div>
              <span style={{ fontSize: '150px' }}>
                <CloudDownloadOutlined />
              </span>
            </div>
            <div style={{ fontSize: '1.2em' }}>
              {fileDetail?.name} ({humanFileSize(fileDetail?.size)})
            </div>
            <div style={{ fontSize: '0.8em' }}>
              Your download will start in a few seconds. If your download does not start, please{' '}
              <a href="#" onClick={DownloadFile}>
                click here
              </a>
            </div>
          </>
        )}

        {fetchedData && fileDetail === null && (
          <>
            <div>
              <span style={{ fontSize: '150px' }}>
                <FrownOutlined />
              </span>
            </div>
            <div style={{ fontSize: '1.2em' }}>Oops..., File not found.</div>
          </>
        )}
      </Col>
    </Row>
  )
}

export default Download
