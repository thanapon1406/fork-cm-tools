import Button from '@/components/Button'
import MainLayout from '@/layout/MainLayout'
import { Card, Col, Row } from 'antd'
import lodash from 'lodash'
import { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { RecoilRoot } from 'recoil'
import { findMessageHistory } from '@/services/chat-history'
import moment from 'moment'
import router, { useRouter } from 'next/router'
import { Image } from 'antd'

interface Pagination {
  total: number
  current: number
  pageSize: number
}

const ChatDetail: NextPage = () => {
  const router = useRouter()
  const id = router.query.id

  const [items, setItems] = useState<any>([])
  const [loadMsg, setloadMsg] = useState(false)
  let [_isLoading, setIsLoading] = useState(true)
  let [pagination, setPagination] = useState<Pagination>({
    total: 0,
    current: 1,
    pageSize: 10,
  })

  const fetchData = async (paging: Pagination = pagination) => {
    const reqBody = {
      data: {
        order_id: String(id),
      },
      page: paging.current,
      per_page: paging.pageSize,
    }
    setIsLoading(true)

    const { success, result } = await findMessageHistory(reqBody)
    if (success) {
      console.log(result)
      setPagination({
        pageSize: paging.pageSize,
        current: result.meta.page,
        total: result.meta.total_count,
      })
      const data = result.data
      const message = data.map((msg: any) => {
        msg = {
          sender_type: msg.sender_type,
          message_type: msg.message_type,
          message: msg.message,
          created_at: msg.created_at,
          is_read: msg.is_read,
        }
        return msg
      })
      const reverseMessage = lodash.reverse(message)

      if (message.length > 0) {
        if (result.meta.page === result.meta.page_count) {
          setloadMsg(false)
        } else setloadMsg(true)

        setItems([...reverseMessage, ...items])
      }

      setIsLoading(false)
    }
  }
  const loadMessage = () => {
    setPagination({
      pageSize: pagination.pageSize,
      current: (pagination.current += 1),
      total: 0,
    })
    console.log(pagination)
    window.scrollTo(0, document.body.scrollHeight)
    fetchData(pagination)
  }

  let dateTime = ''
  const DateTime = (index: any, item: any) => {
    let isShowDate = false
    console.log(item)
    let day = moment(item.created_at).format('DD MMM')
    if (day != dateTime) {
      dateTime = day
      isShowDate = true
    } else {
      isShowDate = false
    }
    return (
      <>
        {isShowDate ? (
          <li
            key={index}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <span className="day">{day}</span>
          </li>
        ) : (
          <></>
        )}
      </>
    )
  }
  useEffect(() => {
    if (id) {
      fetchData()
    }
  }, [])

  return (
    <RecoilRoot>
      <MainLayout>
        <Button style={{ marginTop: 10, marginBottom: 20 }} onClick={() => router.back()}>
          กลับ
        </Button>

        <Row justify="center" align="middle" style={{ padding: 20 }}>
          <Col span={18}>
        
            <Row align="bottom" style={{marginBottom:10}}>
              <Col span={8}>
                {loadMsg ? (
                  <Button onClick={loadMessage} type="default" style={{ marginBottom: 10 }}>
                    โหลดข้อความ
                  </Button>
                ) : (
                  <></>
                )}
              </Col>
              <Col span={8} offset={8} >
                <Row style={{marginBottom:10, justifyContent: 'flex-end'}}>
                  <Col span={4}>
                    <b style={{}}>ร้านค้า</b>
                  </Col>
                  <Col span={6}>
                    <div className="merchant"> </div>
                  </Col>
                </Row>

                <Row  style={{marginBottom:10, justifyContent: 'flex-end'}}>
                  <Col span={4}>
                    <b>ลูกค้า</b>
                  </Col>
                  <Col span={6}>
                    <div className="consumer"></div>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Card
              style={{
                height: 620,
                overflow: 'scroll',
              }}
            >
              <Row>
                <Col span={24}>
                  <div style={{ position: 'relative' }}>
                    <ul id="messages" style={{ paddingLeft: 0 }}>
                      {items.map((item: any, index: number) =>
                        //dateTime(index,item)
                        item.sender_type == 'merchant' ? (
                          <>
                            {DateTime(index, item)}

                            <li
                              className="message_items right"
                              key={index}
                              style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                flexDirection: 'column',
                                alignItems: 'flex-end',
                              }}
                            >
                              <p>{item.sender_type}</p>
                              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                                <div
                                  className="status"
                                  style={{ display: 'flex', flexDirection: 'column' }}
                                >
                                  {item.is_read ? <span>อ่านแล้ว</span> : <></>}
                                  <span style={{ marginRight: '10px' }}>
                                    {moment(item.created_at).format('h:mma')}
                                  </span>
                                </div>
                                {item.message_type == 'image' ? (
                                  <Image src={item.message} width={200} />
                                ) : (
                                  <p className="message_detail">{item.message}</p>
                                )}
                              </div>
                            </li>
                          </>
                        ) : (
                          <>
                            {DateTime(index, item)}
                            <li
                              className="message_items"
                              key={index}
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                              }}
                            >
                              <p>{item.sender_type}</p>
                              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                                {item.message_type == 'image' ? (
                                  <Image src={item.message} width={200} />
                                ) : (
                                  <p className="message_detail">{item.message}</p>
                                )}
                                <div
                                  className="status"
                                  style={{ display: 'flex', flexDirection: 'column' }}
                                >
                                  {item.is_read ? (
                                    <span style={{ marginLeft: '10px' }}>อ่านแล้ว</span>
                                  ) : (
                                    <></>
                                  )}
                                  <span style={{ marginLeft: '10px' }}>
                                    {moment(item.created_at).format('h:mma')}
                                  </span>
                                </div>
                              </div>
                            </li>
                          </>
                        )
                      )}
                    </ul>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </MainLayout>
    </RecoilRoot>
  )
}

export default ChatDetail
