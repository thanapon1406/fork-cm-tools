import Button from '@/components/Button'
import Card from '@/components/Card'
import Input from '@/components/Form/Input'
import ImgButton from '@/components/ImgButton'
import * as Constant from '@/constants/common'
import { OrderDetail } from '@/interface/order'
import { OrderStatusHistoryDetail } from '@/interface/orderStatusHistory'
import MainLayout from '@/layout/MainLayout'
import { consumerList, queryList } from '@/services/consumer'
import { findOrdersStatusHistory, orderStatusInterface } from '@/services/order'
import { findOrder, requestReportInterface } from '@/services/report'
import { cancelRider, getRiderDetail } from '@/services/rider'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Breadcrumb, Col, Divider, Image, Modal, Row, Steps, Typography } from 'antd'
import { Field, Form, Formik } from 'formik'
import { forEach, isEmpty, isUndefined } from 'lodash'
import Moment from 'moment'
import { useRouter } from 'next/router'
import { ReactElement, useEffect, useState } from 'react'
import { determineAppId, numberFormat } from 'utils/helpers'
import * as Yup from 'yup'

const { confirm } = Modal
const { Title, Text } = Typography
const { Step } = Steps
interface Props {
  payload: any
  tableHeader?: any
  isPagination?: any
}

const OrderDetails = ({ payload, tableHeader, isPagination = false }: Props): ReactElement => {
  const Schema = Yup.object().shape({})
  const router = useRouter()
  const { id, brand_id, outlet_id } = router.query

  let [orderData, setOrderData] = useState<OrderDetail>()
  let [orderStatusHistory, setOrderStatusHistory] = useState<Array<OrderStatusHistoryDetail>>([])

  let [riderInitialValues, setRiderInitialValues] = useState({
    rider_name: '-',
    rider_id: '-',
    rider_phone: '-',
    rider_partner: '-',
    rider_remark: '-',
  })

  let [riderImages, setRiderImages] = useState('')

  let [outletInitialValues, setOutletInitialValues] = useState({
    outlet_name: '',
    outlet_full_address: '',
    outlet_latitude: '',
    outlet_longitude: '',
    outlet_phone: '',
  })

  let [customerInitialValues, setCustomerInitialValues] = useState({
    consumer_id: '',
    consumer_full_name: '',
    consumer_social_name: '',
    consumer_full_address: '',
    consumer_address_name: '',
    consumer_latitude: '',
    consumer_longitude: '',
    consumer_phone: '',
  })

  let [orderInitialValues, setOrderInitialValues] = useState({
    order_no: '',
    payment_channel: '',
  })

  let [imagesInitialValues, setImagesInitialValues] = useState({
    imagePath_1: '',
    imagePath_2: '',
    imagePath_3: '',
    imagePath_4: '',
  })

  let [merchantImagesInitialValues, setMerchantImagesInitialValues] = useState({
    merchant_image_1: '',
    merchant_image_2: '',
    merchant_image_3: '',
    merchant_image_4: '',
  })

  let [isCancelRider, setIsCancelRider] = useState(true)
  let [isOrderStatus, setIsOrderStatus] = useState(true)
  let [isLoading, setIsLoading] = useState(true)

  const fetchOrderTransaction = async (params: requestReportInterface) => {
    const { result, success } = await findOrder(params)

    if (success) {
      setIsLoading(false)
      const { meta, data } = result

      setOrderData(data)

      const {
        buyer_info = '',
        outlet_info = '',
        rider_info = '',
        images = '',
        rider_images = '',
        rider_remark = '',
        status,
        merchant_images,
      } = data

      if (!isUndefined(data) && !isEmpty(data)) {
        setOrderInitialValues({
          order_no: data.order_no,
          payment_channel: data.payment_channel_detail?.name || '-',
        })

        if (!isUndefined(outlet_info)) {
          setOutletInitialValues({
            outlet_name: outlet_info.first_name || '-',
            outlet_full_address: outlet_info.address || '-',
            outlet_latitude: outlet_info.location?.latitude || '-',
            outlet_longitude: outlet_info.location?.longitude || '-',
            outlet_phone: outlet_info.phone || '-',
          })
        }

        if (!isUndefined(rider_info) && !isEmpty(rider_info)) {
          var riderId = '-'
          if (isEmpty(rider_info.partner_name)) {
            const request = {
              id: rider_info.id,
            }

            const { result, success } = await getRiderDetail(request)
            if (success) {
              const { meta, data } = result
              riderId = data.code
            }
          } else {
            riderId = rider_info.id
          }

          var riderName = ''
          if (!isUndefined(rider_info.first_name)) {
            riderName += rider_info.first_name + ' '
          }
          if (!isUndefined(rider_info.last_name)) {
            riderName += rider_info.last_name
          }
          var riderRemark = ''
          if (!isUndefined(rider_remark)) {
            riderRemark = rider_remark
          }
          setRiderInitialValues({
            rider_name: riderName || '-',
            rider_id: riderId || '-',
            rider_partner: rider_info.partner_name || '-',
            rider_phone: rider_info.phone || '-',
            rider_remark: riderRemark || '-',
          })
        }
        if (!isUndefined(rider_images) && rider_images.length > 0) {
          let rider_image = rider_images.pop().path
          setRiderImages(rider_image)
        }

        if (!isUndefined(buyer_info)) {
          let consumerData = await getConsumerList(data.sso_id)
          let socialName = '-'
          if (!isUndefined(consumerData) && !isEmpty(consumerData)) {
            if (!isUndefined(consumerData.social_login_first_name)) {
              socialName =
                consumerData.social_login_first_name + ' ' + consumerData.social_login_last_name
            }
          }

          setCustomerInitialValues({
            consumer_full_name: buyer_info.first_name + buyer_info.last_name || '-',
            consumer_id: data.sso_id || '',
            consumer_social_name: socialName,
            consumer_full_address: buyer_info.address || '-',
            consumer_address_name: buyer_info.address_name || '-',
            consumer_latitude: buyer_info.location?.latitude || '-',
            consumer_longitude: buyer_info.location?.longitude || '-',
            consumer_phone: buyer_info.phone || '-',
          })
        }

        if (!isUndefined(images)) {
          let image1 = '',
            image2 = '',
            image3 = '',
            image4 = ''

          forEach(images, (item, index: number) => {
            switch (index) {
              case 0:
                return (image1 = item.path)
              case 1:
                return (image2 = item.path)
              case 2:
                return (image3 = item.path)
              case 3:
                return (image4 = item.path)
            }
          })

          setImagesInitialValues({
            imagePath_1: image1,
            imagePath_2: image2,
            imagePath_3: image3,
            imagePath_4: image4,
          })
        }

        if (!isUndefined(merchant_images)) {
          let image1 = '',
            image2 = '',
            image3 = '',
            image4 = ''

          forEach(merchant_images, (item, index: number) => {
            switch (index) {
              case 0:
                return (image1 = item.path)
              case 1:
                return (image2 = item.path)
              case 2:
                return (image3 = item.path)
              case 3:
                return (image4 = item.path)
            }
          })

          setMerchantImagesInitialValues({
            merchant_image_1: image1,
            merchant_image_2: image2,
            merchant_image_3: image3,
            merchant_image_4: image4,
          })
        }

        if (!isUndefined(rider_info) && data.rider_type == 'outlet') {
          if (
            data.rider_status != 'waiting' &&
            data.rider_status != 'assigning' &&
            data.rider_status != 'arrived' &&
            data.rider_status != 'success' &&
            data.rider_status != 'cancel'
          ) {
            setIsCancelRider(false)
          }
        }

        if (!isUndefined(status)) {
          if (status != 'cancel' && status != 'success') {
            setIsOrderStatus(false)
          }
        }
      }
    }
  }

  const getConsumerList = async (sso_id: string) => {
    const request: queryList = {
      sso_id: sso_id,
    }

    const { result, success } = await consumerList(request)
    const { data } = result

    if (!isEmpty(data)) {
      return data[0]
    } else {
      return ''
    }
  }

  const fetchOrdersStatusHistory = async (params: requestReportInterface) => {
    const query: orderStatusInterface = {
      order_no: String(id),
      page: 1,
      per_page: 100,
      sort_by: 'created_at',
      sort_type: 'asc',
    }

    const { result, success } = await findOrdersStatusHistory(query)

    if (success) {
      const { meta, data } = result

      setOrderStatusHistory(data)
    }
  }

  const determineDescription = (orderStatusHistoryData: OrderStatusHistoryDetail) => {
    if (orderStatusHistoryData.current_status_info.order_status === Constant.CANCEL) {
      return (
        <>
          <div>
            ยกเลิกโดย{' '}
            {orderData?.cancelled_by?.app_name || determineAppId(orderData?.cancelled_by?.app_id)}
            <div>
              - {orderData?.cancellation_reason}
              {orderData?.cancellation_remark ? ': ' + orderData?.cancellation_remark : ''}
            </div>
            <div>{Moment(orderData?.cancelled_at).format(Constant.DATE_FORMAT)}</div>
          </div>
        </>
      )
    } else if (orderStatusHistoryData.current_status_info.rider_status === Constant.ASSIGNED) {
      let data = orderStatusHistoryData
      if (!isUndefined(data.current_rider_info) && !isUndefined(data.previous_rider_info)) {
        if (
          !isEmpty(data.current_rider_info.first_name) &&
          !isEmpty(data.previous_rider_info.first_name)
        ) {
          return (
            <>
              <div>
                Rider 1:{' '}
                {data.previous_rider_info.first_name + ' ' + data.previous_rider_info.last_name}
                <div>
                  Rider 2:{' '}
                  {data.current_rider_info.first_name + ' ' + data.current_rider_info.last_name}
                </div>
                <div>
                  {Moment(data.current_rider_info?.assigned_time).format(Constant.DATE_FORMAT)}
                </div>
              </div>
            </>
          )
        } else {
          return (
            <>
              <div>
                <div>
                  {data.current_rider_info.first_name + ' ' + data.current_rider_info.last_name}
                </div>
                <div>
                  {Moment(data.current_rider_info?.assigned_time).format(Constant.DATE_FORMAT)}
                </div>
              </div>
            </>
          )
        }
      }
    } else {
      return Moment(orderStatusHistoryData.created_at).format(Constant.DATE_FORMAT)
    }
  }

  const determineTrackingOrderStatus = (
    order_status = '',
    merchant_status = '',
    rider_status = '',
    orderHistoryData: any = {}
  ) => {
    let respObj = {
      status: 'กำลังปรุง',
      imagePath: '/asset/images/cook.png',
    }
    if (!isUndefined(orderData)) {
      if (
        order_status === Constant.SUCCESS ||
        merchant_status === Constant.SUCCESS ||
        rider_status === Constant.SUCCESS
      ) {
        respObj.status = 'จัดส่งสำเร็จ'
        respObj.imagePath = '/asset/images/success.png'
      } else if (
        order_status === Constant.CANCEL ||
        merchant_status === Constant.CANCEL ||
        rider_status === Constant.CANCEL
      ) {
        respObj.status = 'ยกเลิกออเดอร์'
        respObj.imagePath = '/asset/images/cancel.png'
      } else if (order_status === Constant.WAITING) {
        respObj.status = 'ออเดอร์ใหม่'
        respObj.imagePath = '/asset/images/new-order.png'
      } else if (merchant_status === Constant.COOKING) {
        respObj.status = 'กำลังปรุง'
        respObj.imagePath = '/asset/images/cook.png'
      } else if (merchant_status === Constant.COOKED) {
        respObj.status = 'ปรุงสำเร็จ'
        respObj.imagePath = '/asset/images/cook.png'
      } else if (order_status === '' && rider_status === Constant.WAITING) {
        respObj.status = 'กำลังหาไรเดอร์ใหม่'
        respObj.imagePath = '/asset/images/delivery.png'
      } else if (rider_status === Constant.ASSIGNING) {
        respObj.status = 'กำลังหาไรเดอร์'
        respObj.imagePath = '/asset/images/delivery.png'
      } else if (rider_status === Constant.ASSIGNED) {
        respObj.status = 'ไรเดอร์รับออเดอร์'

        if (!isUndefined(orderHistoryData)) {
          let data = orderHistoryData as OrderStatusHistoryDetail
          if (!isUndefined(data.current_rider_info) && !isUndefined(data.previous_rider_info)) {
            if (
              !isEmpty(data.current_rider_info.first_name) &&
              !isEmpty(data.previous_rider_info.first_name)
            ) {
              respObj.status = 'เปลี่ยนไรเดอร์'
            }
          }
        }
        respObj.imagePath = '/asset/images/delivery.png'
      } else if (rider_status === Constant.GOING_MERCHANT) {
        respObj.status = 'ไรเดอร์กำลังไปที่ร้าน'
        respObj.imagePath = '/asset/images/delivery.png'
      } else if (rider_status === Constant.PICKING_UP) {
        respObj.status = 'ไรเดอร์มาถึงร้าน'
        respObj.imagePath = '/asset/images/store.png'
      } else if (rider_status === Constant.PICKED_UP) {
        respObj.status = 'ไรเดอร์รับอาหารและกำลังจัดส่ง '
        respObj.imagePath = '/asset/images/shopping-bag.png'
      } else if (rider_status === Constant.ARRIVED) {
        respObj.status = 'ไรเดอร์ถึงจุดหมาย'
        respObj.imagePath = '/asset/images/placeholder.png'
      }
    }

    return respObj
  }

  const fetchcancelRider = async (order_no: any) => {
    confirm({
      title: 'ยืนยันการยกเลิกไรเดอร์ ?',
      icon: <ExclamationCircleOutlined />,
      content: 'หลังจากยกเลิกต้องดำเนินจากร้านค้า เพื่อเรียกไรเดอร์ใหม่อีกครั้ง',
      async onOk() {
        const body = {
          order_no: String(order_no),
        }
        const { result, success } = await cancelRider(body)
        if (success) {
          setIsCancelRider(true)
        }
      },
      // onCancel() {
      //   console.log('Cancel');
      // },
    })
  }

  useEffect(() => {
    if (id) {
      const request: requestReportInterface = {
        order_number: String(id),
        brand_id: String(brand_id),
        branch_id: Number(outlet_id),
      }

      fetchOrderTransaction(request)
      fetchOrdersStatusHistory(request)
    }
  }, [id])

  return (
    <MainLayout isLoading={isLoading}>
      <Row justify="space-around" align="middle">
        <Col span={8}>
          <Title level={4}>บัญชีผู้ใช้งาน</Title>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>การจัดการออเดอร์</Breadcrumb.Item>
            <Breadcrumb.Item>รายการออเดอร์</Breadcrumb.Item>
            <Breadcrumb.Item>ข้อมูลรายการออเดอร์</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col span={8} offset={8} style={{ textAlign: 'end' }}>
          <Button
            style={{ width: '120px', marginLeft: '10px' }}
            type="primary"
            isDanger={true}
            size="middle"
            // orderStatusHistory
            disabled={isCancelRider}
            onClick={() => fetchcancelRider(id)}
          >
            ยกเลิกไรเดอร์
          </Button>
          <Button
            style={{ width: '120px', marginLeft: '10px' }}
            type="primary"
            isDanger={true}
            size="middle"
            disabled={isOrderStatus}
          >
            ยกเลิก
          </Button>
        </Col>
      </Row>

      <Card>
        <Formik
          enableReinitialize={true}
          initialValues={orderInitialValues}
          onSubmit={() => { }}
          validationSchema={Schema}
        >
          {(values) => (
            <Form>
              <Title level={5}>ข้อมูลรายการออเดอร์</Title>
              <Row gutter={16}>
                <Col className="gutter-row" span={12}>
                  <Field
                    label={{ text: 'เลขออเดอร์' }}
                    name="order_no"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="order_no"
                    placeholder="เลขออเดอร์"
                    disabled={true}
                  />
                </Col>
              </Row>

              <Title level={5}>รายการอาหาร {orderData?.products.length} รายการ</Title>
              <Row gutter={16}>
                <Col className="gutter-row order-menu-background" span={18}>
                  <div style={{ maxHeight: '400px', overflow: 'scroll' }}>
                    <Row gutter={16}>
                      <Col className="gutter-row" span={1}>
                        #
                      </Col>
                      <Col className="gutter-row" span={8}>
                        ชื่อเมนู
                      </Col>
                      <Col className="gutter-row" span={3}>
                        จำนวน
                      </Col>
                      <Col className="gutter-row" span={3}>
                        ราคาต่อหน่วย
                      </Col>
                      <Col className="gutter-row" span={3}>
                        ราคารวม
                      </Col>
                      <Col className="gutter-row" span={5}>
                        หมายเหตุ
                      </Col>
                      <Divider />
                    </Row>

                    {orderData?.products?.map((val, index: number) => {
                      return (
                        <>
                          <Row gutter={16}>
                            <Col className="gutter-row" span={1}>
                              {index + 1}
                            </Col>
                            <Col className="gutter-row" span={8}>
                              {val.name.th}
                            </Col>
                            <Col className="gutter-row" span={3}>
                              {val.quantity}
                            </Col>
                            <Col className="gutter-row" span={3}>
                              {numberFormat(val.price)}
                            </Col>
                            <Col className="gutter-row" span={3}>
                              {numberFormat(val.price * val.quantity)}
                            </Col>
                            <Col className="gutter-row" span={5}>
                              {val.remark || '-'}
                            </Col>
                          </Row>

                          {val?.selected_choices?.map((choice, index: number) => {
                            return (
                              <>
                                <Row gutter={16}>
                                  <Col className="gutter-row" span={1}></Col>
                                  <Col className="gutter-row" span={8}>
                                    {choice.name.th}
                                  </Col>
                                  <Col className="gutter-row" span={3}>
                                    {val.quantity}
                                  </Col>
                                  <Col className="gutter-row" span={3}>
                                    {numberFormat(choice.price)}
                                  </Col>
                                  <Col className="gutter-row" span={3}>
                                    {numberFormat(choice.price * val.quantity)}
                                  </Col>
                                  <Col className="gutter-row" span={5}></Col>
                                </Row>
                              </>
                            )
                          })}

                          {
                            <>
                              <Divider />
                              <Row gutter={16}>
                                <Col className="gutter-row" span={1}></Col>
                                <Col className="gutter-row" span={8}>
                                  <Text strong>รวม</Text>
                                </Col>
                                <Col className="gutter-row" span={3}></Col>
                                <Col className="gutter-row" span={3}></Col>
                                <Col className="gutter-row" span={3}>
                                  {numberFormat(val.total)}
                                </Col>
                                <Col className="gutter-row" span={5}></Col>
                              </Row>
                              <Divider />
                            </>
                          }
                        </>
                      )
                    })}
                  </div>

                  <div>
                    <br />
                    <Row gutter={16}>
                      <Col span={12}>
                        <Row gutter={16} className="mb-6">
                          <Col span={12} className="pull-left">
                            <Text>ยอดรวม </Text>
                          </Col>
                          <Col span={12} className="pull-right">
                            <Text>{numberFormat(orderData?.total_amount || 0)}</Text>
                          </Col>
                        </Row>

                        <Row gutter={16} className="mb-6">
                          <Col span={24} className="pull-left">
                            <Text>ส่วนลด</Text>
                          </Col>
                        </Row>

                        <Row gutter={16} className="mb-6">
                          <Col span={1}></Col>
                          <Col span={11} className="pull-left">
                            <Text>ส่วนลดยำ</Text>
                          </Col>
                          <Col span={12} className="pull-right">
                            <Text>0.00</Text>
                          </Col>
                        </Row>

                        <Row gutter={16} className="mb-6 mt-16">
                          <Col span={24} className="pull-left">
                            <Text>โค้ดส่วนลด</Text>
                          </Col>
                        </Row>

                        <Row gutter={16} className="mt-16">
                          <Col span={1}></Col>
                          <Col span={11} className="pull-left">
                            <Text>welcomekh100</Text>
                          </Col>
                          <Col span={12} className="pull-right">
                            <Text>{numberFormat(orderData?.total_discount || 0)}</Text>
                          </Col>
                        </Row>
                      </Col>

                      <Col span={3}></Col>

                      <Col span={9}>
                        <Row gutter={16} className="mb-6">
                          <Col span={12} className="pull-left">
                            <Text>ค่าจัดส่ง </Text>
                          </Col>
                          <Col span={12} className="pull-right">
                            <Text>{numberFormat(orderData?.delivery_fee || 0)}</Text>
                          </Col>
                        </Row>
                        <Row gutter={16} className="mb-6">
                          <Col span={12} className="pull-left">
                            <Text>ยอดรวมสุทธิ</Text>
                          </Col>
                          <Col span={12} className="pull-right">
                            <Text>{numberFormat(orderData?.total_amount || 0)}</Text>
                          </Col>
                        </Row>

                        <Row gutter={16}>
                          <Col span={14} className="pull-left">
                            <Text>ภาษีมูลค่าเพิ่ม (vat 7%)</Text>
                          </Col>
                          <Col span={10} className="pull-right">
                            <Text>{numberFormat(orderData?.total_vat || 0)}</Text>
                          </Col>
                        </Row>

                        <Divider />

                        <Row gutter={16}>
                          <Col span={12} className="center">
                            <Title level={5}>รวมมูลค่าสินค้า</Title>
                          </Col>
                          <Col span={12} className="pull-right">
                            <Text>{numberFormat(orderData?.total || 0)}</Text>
                          </Col>
                        </Row>
                      </Col>
                    </Row>

                    <Divider />

                    <Row gutter={16}>
                      <Col span={12}></Col>

                      <Col span={3}></Col>

                      <Col span={9}>
                        <Row gutter={16}>
                          <Col span={12}>
                            <Text strong>คะแนนที่ได้รับ </Text>
                          </Col>
                          <Col span={12} className="pull-right">
                            <Text>0 point</Text>
                          </Col>
                        </Row>
                      </Col>
                    </Row>

                    <br />
                  </div>
                </Col>

                <Col
                  className={`gutter-row ${orderStatusHistory?.length > 5 ? 'order-tracking' : ''}`}
                  span={6}
                >
                  <Title level={5}>ติดตามออเดอร์</Title>
                  {!isUndefined(orderStatusHistory) ? (
                    <Steps
                      direction="vertical"
                      size="small"
                      current={orderStatusHistory?.length}
                      status={orderData?.status === Constant.CANCEL ? 'error' : 'process'}
                    >
                      <Step
                        title={determineTrackingOrderStatus(Constant.WAITING).status}
                        description={Moment(orderData?.created_at).format(Constant.DATE_FORMAT)}
                        icon={
                          <Image
                            className="order-tracking-icon"
                            width={24}
                            height={24}
                            preview={false}
                            src={determineTrackingOrderStatus(Constant.WAITING).imagePath}
                          />
                        }
                      />

                      {orderStatusHistory?.map((val: OrderStatusHistoryDetail, index: number) => {
                        var determineTrackingResult = determineTrackingOrderStatus(
                          val?.current_status_info?.order_status,
                          val?.current_status_info?.merchant_status,
                          val?.current_status_info?.rider_status,
                          val
                        )
                        return (
                          <Step
                            key={val.order_no}
                            title={determineTrackingResult.status}
                            description={determineDescription(val)}
                            icon={
                              <Image
                                className="order-tracking-icon"
                                width={24}
                                height={24}
                                preview={false}
                                src={determineTrackingResult.imagePath}
                              />
                            }
                          />
                        )
                      })}
                    </Steps>
                  ) : (
                    <Steps direction="vertical" size="small" current={1}>
                      <Step
                        key={orderData?.order_no}
                        title={
                          determineTrackingOrderStatus(
                            orderData?.status,
                            orderData?.merchant_status,
                            orderData?.rider_status
                          ).status
                        }
                        description={Moment(orderData?.created_at).format(Constant.DATE_FORMAT)}
                        icon={
                          <Image
                            className="order-tracking-icon"
                            width={24}
                            height={24}
                            preview={false}
                            src={
                              determineTrackingOrderStatus(
                                orderData?.status,
                                orderData?.merchant_status,
                                orderData?.rider_status
                              ).imagePath
                            }
                          />
                        }
                      />
                    </Steps>
                  )}
                </Col>
              </Row>

              <br />
              <Title level={5}>การชำระเงิน</Title>
              <Row gutter={16}>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'ช่องทางการชำระเงิน' }}
                    name="payment_channel"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="order_no"
                    placeholder="ช่องทางการชำระเงิน"
                    disabled={true}
                  />
                </Col>
              </Row>

              <Row gutter={16}>
                <Col className="gutter-row" span={6}>
                  <div style={{ marginBottom: '6px' }}>
                    <Text>สลิป 1</Text>
                  </div>
                  <ImgButton
                    url={imagesInitialValues.imagePath_1}
                    privateBucket={imagesInitialValues.imagePath_1.includes("https") ? true : false} />
                </Col>

                <Col className="gutter-row" span={6}>
                  <div style={{ marginBottom: '6px' }}>
                    <Text>สลิป 2</Text>
                  </div>
                  <ImgButton
                    url={imagesInitialValues.imagePath_2}
                    privateBucket={imagesInitialValues.imagePath_2.includes("https") ? true : false} />
                </Col>

                <Col className="gutter-row" span={6}>
                  <div style={{ marginBottom: '6px' }}>
                    <Text>สลิป 3</Text>
                  </div>
                  <ImgButton
                    url={imagesInitialValues.imagePath_3}
                    privateBucket={imagesInitialValues.imagePath_3.includes("https") ? true : false} />
                </Col>

                <Col className="gutter-row" span={6}>
                  <div style={{ marginBottom: '6px' }}>
                    <Text>สลิป 4</Text>
                  </div>
                  <ImgButton
                    url={imagesInitialValues.imagePath_4}
                    privateBucket={imagesInitialValues.imagePath_4.includes("https") ? true : false} />
                </Col>
              </Row>
              <Row gutter={16} style={{ marginTop: '20px' }}>
                <Col className="gutter-row" span={6}>
                  <div style={{ marginBottom: '6px' }}>
                    <Text>สลิปการโอนเงินคืน 1</Text>
                  </div>
                  <ImgButton
                    url={merchantImagesInitialValues.merchant_image_1}
                    privateBucket={merchantImagesInitialValues.merchant_image_1.includes("https") ? true : false} />
                </Col>
                <Col className="gutter-row" span={6}>
                  <div style={{ marginBottom: '6px' }}>
                    <Text>สลิปการโอนเงินคืน 2</Text>
                  </div>
                  <ImgButton
                    url={merchantImagesInitialValues.merchant_image_2}
                    privateBucket={merchantImagesInitialValues.merchant_image_2.includes("https") ? true : false} />
                </Col>
                <Col className="gutter-row" span={6}>
                  <div style={{ marginBottom: '6px' }}>
                    <Text>สลิปการโอนเงินคืน 3</Text>
                  </div>
                  <ImgButton
                    url={merchantImagesInitialValues.merchant_image_3}
                    privateBucket={merchantImagesInitialValues.merchant_image_3.includes("https") ? true : false} />
                </Col>
                <Col className="gutter-row" span={6}>
                  <div style={{ marginBottom: '6px' }}>
                    <Text>สลิปการโอนเงินคืน 4</Text>
                  </div>
                  <ImgButton
                    url={merchantImagesInitialValues.merchant_image_4}
                    privateBucket={merchantImagesInitialValues.merchant_image_4.includes("https") ? true : false} />
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
      </Card>

      <Card>
        <Formik
          enableReinitialize={true}
          initialValues={outletInitialValues}
          onSubmit={() => { }}
          validationSchema={Schema}
        >
          {(values) => (
            <Form>
              <Title level={5}>ข้อมูลร้านค้า</Title>
              <Row gutter={16}>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'ชื่อร้านค้า' }}
                    name="outlet_name"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="outlet_name"
                    placeholder="ชื่อร้านค้า"
                    disabled={true}
                  />
                </Col>

                <Col className="gutter-row" span={18}>
                  <Field
                    label={{ text: 'ที่อยู่' }}
                    name="outlet_full_address"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="outlet_full_address"
                    placeholder="ที่อยู่"
                    disabled={true}
                  />
                </Col>
              </Row>

              <Row gutter={16}>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'ละติจูด' }}
                    name="outlet_latitude"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="outlet_latitude"
                    placeholder="ละติจูด"
                    disabled={true}
                  />
                </Col>

                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'ลองจิจูด' }}
                    name="outlet_longitude"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="outlet_longitude"
                    placeholder="ลองจิจูด"
                    disabled={true}
                  />
                </Col>

                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'เบอร์โทรศัพท์ร้านค้า' }}
                    name="outlet_phone"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="outlet_phone"
                    placeholder="เบอร์โทรศัพท์ร้านค้า"
                    disabled={true}
                  />
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
      </Card>

      <Card>
        <Formik
          enableReinitialize={true}
          initialValues={customerInitialValues}
          onSubmit={() => { }}
          validationSchema={Schema}
        >
          {(values) => (
            <Form>
              <Title level={5}>ข้อมูลลูกค้า</Title>
              <Row gutter={16}>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'Consumer ID' }}
                    name="consumer_id"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="consumer_id"
                    placeholder="Consumer ID"
                    disabled={true}
                  />
                </Col>

                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'เบอร์โทรศัพท์' }}
                    name="consumer_phone"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="consumer_phone"
                    placeholder="เบอร์โทรศัพท์"
                    disabled={true}
                  />
                </Col>

                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'Social Name' }}
                    name="consumer_social_name"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="consumer_social_name"
                    placeholder="Social Name"
                    disabled={true}
                  />
                </Col>

                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'ชื่อสกุล' }}
                    name="consumer_full_name"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="consumer_full_name"
                    placeholder="ชื่อสกุล"
                    disabled={true}
                  />
                </Col>
              </Row>

              <Row gutter={16}>
                <Col className="gutter-row" span={24}>
                  <Field
                    label={{ text: 'ที่อยู่ในการจัดส่ง' }}
                    name="consumer_full_address"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="consumer_full_address"
                    placeholder="ที่อยู่ในการจัดส่ง"
                    disabled={true}
                  />
                </Col>
              </Row>

              <Row gutter={16}>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'ชื่อที่อยู่' }}
                    name="consumer_address_name"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="consumer_address_name"
                    placeholder="ชื่อที่อยู่"
                    disabled={true}
                  />
                </Col>

                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'ละติจูด' }}
                    name="consumer_latitude"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="consumer_latitude"
                    placeholder="ละติจูด"
                    disabled={true}
                  />
                </Col>

                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'ลองจิจูด' }}
                    name="consumer_longitude"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="consumer_longitude"
                    placeholder="ลองจิจูด"
                    disabled={true}
                  />
                </Col>

                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'เบอร์โทรศัพท์' }}
                    name="consumer_phone"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="consumer_phone"
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
        <Formik
          enableReinitialize={true}
          initialValues={riderInitialValues}
          onSubmit={() => { }}
          validationSchema={Schema}
        >
          {(values) => (
            <Form>
              <Title level={5}>ข้อมูลไรเดอร์ </Title>

              <Row gutter={16}>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'Rider ID' }}
                    name="rider_id"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="rider_id"
                    placeholder="Rider ID"
                    disabled={true}
                  />
                </Col>

                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'ชื่อสกุล' }}
                    name="rider_name"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="rider_name"
                    placeholder="ชื่อสกุล"
                    disabled={true}
                  />
                </Col>

                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'เบอร์โทรศัพท์' }}
                    name="rider_phone"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="rider_phone"
                    placeholder="เบอร์โทรศัพท์"
                    disabled={true}
                  />
                </Col>

                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'พาร์ทเนอร์' }}
                    name="rider_partner"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="rider_partner"
                    placeholder="พาร์ทเนอร์"
                    disabled={true}
                  />
                </Col>
              </Row>
              <Row gutter={16}>
                <Col className="gutter-row" span={6}>
                  <div style={{ marginBottom: '6px' }}>
                    <Text>รูปหลักฐานการส่ง</Text>
                  </div>
                  <ImgButton
                    url={riderImages}
                    privateBucket={riderImages.includes("https") ? true : false} />
                </Col>
              </Row>
              <Row gutter={16}>
                <Col className="gutter-row" span={6}>
                  <div style={{ marginTop: '8px' }}>
                    <Field
                      label={{ text: 'Remark' }}
                      name="rider_remark"
                      type="text"
                      component={Input}
                      className="form-control round"
                      id="rider_remark"
                      placeholder="Remark"
                      disabled={true}
                    />
                  </div>
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
      </Card>
    </MainLayout>
  )
}

export default OrderDetails
