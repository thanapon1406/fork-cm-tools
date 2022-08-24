import Button from '@/components/Button'
import Input from '@/components/Form/Input'
import MainLayout from '@/layout/MainLayout'
import { findAllRoom, findMessageHistory } from '@/services/chat-history'
import { Breadcrumb, Card, Col, Image, Row, Typography } from 'antd'
import { Field, Form, Formik } from 'formik'
import moment from 'moment'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { RecoilRoot } from 'recoil'
const { Title } = Typography

interface Pagination {
  total: number
  current: number
  pageSize: number
}
interface Detail {
  order_id: string
  outlet_name: string
  profile_name: string
  tel: string
}

const ChatDetail: NextPage = () => {
  const router = useRouter()
  const id = router.query.id

  const [items, setItems] = useState<any>([])
  const [detailInitialValues, setdetailInitialValues] = useState<Detail>({
    order_id: '',
    outlet_name: '',
    profile_name: '',
    tel: '',
  })
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
    const reqBodyFindRoom = {
      data: {
        order_id: String(id),
      },
      page: 1,
      per_page: 1,
    }
    const response = await findAllRoom(reqBodyFindRoom)
    if (response.success) {
      console.log('resultRoom ', response.result)
      const data = response.result.data[0]
      console.log('data:  ', data)
      setdetailInitialValues({
        order_id: data.room_key,
        outlet_name: data.outlet_name,
        profile_name: data.profile_name,
        tel: data.tel || '-',
      })
      setIsLoading(false)
    }

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
      // const reverseMessage = lodash.reverse(message)

      if (message.length > 0) {
        if (result.meta.page === result.meta.page_count) {
          setloadMsg(false)
        } else setloadMsg(true)

        setItems([...message, ...items])
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
  }, [id])

  return (
    <RecoilRoot>
      <MainLayout>
        <Title level={4}>ข้อมูลการสนทนา</Title>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Chat</Breadcrumb.Item>
          <Breadcrumb.Item>ออเดอร์ทั้งหมด</Breadcrumb.Item>
          <Breadcrumb.Item>ประวัติการสนทนา</Breadcrumb.Item>
        </Breadcrumb>
        <Button
          type="default"
          style={{ marginBottom: 10 }}
          onClick={() => {
            router.replace(`/chat`)
          }}
        >
          Back
        </Button>
        <Card style={{ marginBottom: 10 }}>
          <Title level={5}>ข้อมูลรายการออเดอร์</Title>
          <Formik initialValues={detailInitialValues} onSubmit={() => {}} enableReinitialize={true}>
            {({ values, resetForm, setValues }) => (
              <Form>
                <Row gutter={16}>
                  <Col className="gutter-row" xs={12} sm={6}>
                    <Field
                      label={{ text: 'หมายเลขออร์เดอร์' }}
                      name="order_id"
                      component={Input}
                      id="order_id"
                      placeholder="หมายเลขออร์เดอร์"
                      disabled={true}
                    />
                  </Col>

                  <Col className="gutter-row" xs={12} sm={6}>
                    <Field
                      label={{ text: 'ชื่อร้านค้า' }}
                      name="outlet_name"
                      component={Input}
                      id="outlet_name"
                      placeholder="ชื่อร้านค้า"
                      disabled={true}
                    />
                  </Col>
                  <Col className="gutter-row" xs={12} sm={6}>
                    <Field
                      label={{ text: 'ชื่อลูกค้า' }}
                      name="profile_name"
                      component={Input}
                      id="profile_name"
                      placeholder="ชื่อลูกค้า"
                      disabled={true}
                    />
                  </Col>
                  <Col className="gutter-row" xs={12} sm={6}>
                    <Field
                      label={{ text: 'เบอร์โทรศัพท์' }}
                      name="tel"
                      component={Input}
                      id="tel"
                      placeholder="เบอร์โทรศัพท์"
                      disabled={true}
                    />
                  </Col>
                </Row>
              </Form>
            )}
          </Formik>
        </Card>
        <Card>
          <Title level={5}>ประวัติการสนทนา</Title>
          <Row justify="center" align="middle" style={{ padding: 20 }}>
            <Col span={18}>
              <Row align="bottom" style={{ marginBottom: 10 }}>
                <Col span={8}>
                  {loadMsg ? (
                    <Button onClick={loadMessage} type="default" style={{ marginBottom: 10 }}>
                      โหลดข้อความ
                    </Button>
                  ) : (
                    <></>
                  )}
                </Col>
                <Col span={8} offset={8}>
                  <Row style={{ marginBottom: 10, justifyContent: 'flex-end' }}>
                    <Col span={4}>
                      <b style={{}}>ร้านค้า</b>
                    </Col>
                    <Col span={6}>
                      <div className="merchant"> </div>
                    </Col>
                  </Row>

                  <Row style={{ marginBottom: 10, justifyContent: 'flex-end' }}>
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
        </Card>
      </MainLayout>
    </RecoilRoot>
  )
}

export default ChatDetail
