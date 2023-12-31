import CustomBadge from '@/components/Badge'
import Button from '@/components/Button'
import Card from '@/components/Card'
import DownloadButton from '@/components/credit/DownloadButton'
import CheckBox from '@/components/Form/CheckBox'
import Input from '@/components/Form/Input'
import ImgButton from '@/components/ImgButton'
import Tab from '@/components/Tab'
import Table from '@/components/Table'
import Tag from '@/components/Tag'
import {
  creditPaymentChanel,
  days,
  onlineStatusTag,
  outletStatusTH,
  outletType,
  riderType,
  userServiceType
} from '@/constants/textMapping'
import StaffList from '@/containers/staff-list'
import { useLoadingContext } from '@/contexts/LoadingContext'
import useFetchTable from '@/hooks/useFetchTable'
import MainLayout from '@/layout/MainLayout'
import {
  sendTopupsEmail,
  sendTransactionsEmail,
  topupList,
  transactionList
} from '@/services/credit'
import { findLsOutlet } from '@/services/ls-outlet'
import { getAccounts, outletDetail, personalData, updateOutletStatus } from '@/services/merchant'
import { getRiderOutletDetail } from '@/services/rider'
import { StopOutlined } from '@ant-design/icons'
import { Badge, Breadcrumb, Col, Divider, Modal, Row, Select, Space, Typography } from 'antd'
import { Field, FieldArray, Form, Formik } from 'formik'
import _, { filter } from 'lodash'
import moment from 'moment'
import { useRouter } from 'next/router'
import { ReactElement, useEffect, useState } from 'react'
import * as Yup from 'yup'

const { Title, Text } = Typography

interface Props { }

export default function MerchantUserView({ }: Props): ReactElement {
  const router = useRouter()
  const { id } = router.query
  const [ssoid, setSsoid] = useState('')
  const [isEdit, setIsEdit] = useState(false)
  const [isLoadingPage, setIsLoading] = useState(true)
  // Create our number formatter.
  var formatter = new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
  })

  // send transactions email
  const transactionsEmail = (value: any) => {
    sendTransactionsEmail({
      email: value.email,
      transaction_request: {
        outlet_id: id,
        is_preload_credit: true,
        all: true,
        gl_type: 'credit',
      },
    })
  }

  // send topups email
  const topupsEmail = (value: any) => {
    sendTopupsEmail({
      email: value.email,
      transaction_request: {
        outlet_id: id,
        all: true,
      },
    })
  }
  // credit list
  const requestTransactionApi: Function = transactionList
  const credit = useFetchTable(
    requestTransactionApi,
    {
      outlet_id: id,
      is_preload_credit: true,
      gl_type: 'credit',
    },
    { isAutoFetch: false }
  )
  const columnCredit = [
    {
      title: 'ประเภทการใช้เครดิต',
      dataIndex: 'credit_type',
      align: 'center',
      render: (row: string) => {
        return row == 'gross_profit'
          ? 'ค่าดำเนินการ'
          : row == 'delivery_fee'
            ? 'ค่าจัดส่ง'
            : 'อื่นๆ'
      },
    },
    {
      title: 'จำนวนเงิน',
      dataIndex: 'amount',
      align: 'center',
      render: (row: number) => {
        return formatter.format(row)
      },
    },
    {
      title: 'หมายเหตุ',
      dataIndex: '',
      align: 'center',
      render: (row: string) => {
        return row && ''
      },
    },
    {
      title: 'เลขออเดอร์',
      dataIndex: 'credit_no',
      align: 'center',
    },
    {
      title: 'เวลา',
      dataIndex: 'created_at',
      align: 'center',
      render: (row: any) => {
        return row ? moment(row).format('YYYY-MM-DD HH:mm') : '-'
      },
    },
    {
      title: 'สถานะ',
      dataIndex: 'status',
      align: 'center',
      render: (row: any) => {
        return (
          <>
            <Badge
              status={row == 'processing' ? 'warning' : row == 'success' ? row : 'error'}
              text={
                row == 'processing'
                  ? 'ดำเนินการ'
                  : row == 'success'
                    ? 'สำเร็จ'
                    : row == 'refund'
                      ? 'คืนเงิน'
                      : 'ยกเลิก'
              }
            />
          </>
        )
      },
    },
  ]
  // end credit list

  // topup list
  const requestTopupApi: Function = topupList
  const topup = useFetchTable(
    requestTopupApi,
    {
      outlet_id: id,
    },
    { isAutoFetch: false }
  )
  const columnTopup = [
    {
      title: 'Transaction ID',
      dataIndex: 'transaction_id',
      align: 'center',
    },
    {
      title: 'รายการ',
      dataIndex: '',
      align: 'center',
      render: (row: string) => {
        return row ? 'เติมเงิน' : 'ใช้เครดิต'
      },
    },
    {
      title: 'จำนวนเงิน',
      dataIndex: 'amount',
      align: 'center',
      render: (row: number) => {
        return formatter.format(row)
      },
    },
    {
      title: 'ยอดเครดิตที่ได้',
      dataIndex: 'credit',
      align: 'center',
      render: (row: number) => {
        if (row === undefined) {
          row = 0
        }
        return formatter.format(row)
      },
    },

    {
      title: 'หมายเหตุ',
      dataIndex: 'type',
      align: 'center',
      render: (row: string) => {
        return creditPaymentChanel[row]
      },
    },
    {
      title: 'เลขออเดอร์',
      dataIndex: 'order_no',
      align: 'center',
    },
    {
      title: 'เวลา',
      dataIndex: 'created_at',
      align: 'center',
      render: (row: any) => {
        return row ? moment(row).format('YYYY-MM-DD HH:mm') : '-'
      },
    },
    {
      title: 'สถานะ',
      dataIndex: 'status',
      align: 'center',
      render: (row: any) => {
        return (
          <>
            <Badge
              status={row == 'processing' ? 'warning' : row == 'success' ? row : 'error'}
              text={
                row == 'processing'
                  ? 'ดำเนินการ'
                  : row == 'success'
                    ? 'สำเร็จ'
                    : row == 'refund'
                      ? 'คืนเงิน'
                      : 'ยกเลิก'
              }
            />
          </>
        )
      },
    },
  ]
  // end topup list

  const requestJoinLsApi: Function = findLsOutlet
  const joinLs = useFetchTable(
    requestJoinLsApi,
    {
      outlet_id: id,
      is_show_ls_config: true,
      status: "active"
    },
    { isAutoFetch: false }
  )
  const columnJoinLs = [
    {
      title: 'Logistic Subsidize ที่เข้าร่วม',
      dataIndex: 'ls_config',
      // align: 'center',
      render: (row: string, record: any) => {
        return record?.ls_config?.name
      },
    },
    {
      title: 'วันที่เข้าร่วม',
      dataIndex: 'start_date',
      align: 'center',
      render: (row: any) => {
        return row ? moment(row).format('YYYY-MM-DD') : ''
      },
    },
    {
      title: 'วันที่สิ้นสุด',
      dataIndex: 'end_date',
      align: 'center',
      render: (row: any) => {
        return row ? moment(row).format('YYYY-MM-DD') : ''
      },
    },
  ]

  let [userInitialValues, setUserInitialValues] = useState({
    user_name: '',
    user_id: '',
    user_phone: '',
    user_email: '',
    nation_id: '',
    verify_email: '',
    is_ban: false,
    staff: [],
    line_id: '',
  })

  let [outletInitialValues, setOutletInitialValues] = useState({
    outlet_name: '',
    outlet_type: '',
    tax_id: '',
    email: '',
    full_address: '',
    address: '',
    province_name: '',
    district_name: '',
    sub_district_name: '',
    zipcode: '',
    verify_status: '',
    photo: '',
    banner_photo: '',
    latitude: '',
    longitude: '',
    tel: '',
    rating: '',
    business_times: [],
    business_extra_times: [],
    status: '',
    default_status: '',
    opening_time: '',
    closed_time: '',
    available_credit: 0,
    isBan: false,
    user_service_type: '',
    brand_name: '',
    online_status: '',
    default_online_status: '',
    rider_type: '',
    rider_condition: [],
    outlet_rider: [],
    banks: [],
    is_banks: false,
    promptpays: [],
    is_promptpays: false,
    is_cash: false,
    is_cash_active: false,
    is_merchant_test: false,
    is_auto_open: false,
    is_auto_call_rider: false,
  })

  const Loading = useLoadingContext()
  useEffect(() => {
    if (id) {
      getOutlet()
      credit.handleFetchData({
        outlet_id: id,
        is_preload_credit: true,
        gl_type: 'credit',
      })
      topup.handleFetchData({
        outlet_id: id,
      })
      joinLs.handleFetchData({
        outlet_id: id,
        is_show_ls_config: true,
        status: "active"
      })
    }
  }, [id])

  const getOutlet = async () => {
    const request = {
      id: id,
    }
    const { result, success } = await outletDetail(request)
    let verify_email = ''
    if (success) {
      const { data: outletData } = result
      let business_times_Set: any
      let business_extra_times_Set: any
      if (outletData?.business_times) {
        const convertStatus = (d: any) => {
          return {
            ...d,
            status: d.status === 'open' ? true : false,
          }
        }
        business_extra_times_Set = _.filter(outletData.business_times, { day: 'extra' })
        business_times_Set = _.filter(outletData.business_times, (d: any) => d.day !== 'extra')
        business_extra_times_Set = business_extra_times_Set.map(convertStatus)
        business_times_Set = business_times_Set.map(convertStatus)
      }
      verify_email = outletData?.email

      const userRequest: any = {
        page: 1,
        per_page: 10,
        id: id,
        include_staff: true,
      }
      const { result: riderResult, success: riderSuccess } = await getRiderOutletDetail({ outlet_id: id })
      const { data: riderData } = riderResult
      riderData?.map((value: any, key: number) => {
        value.fullname = value.first_name + " " + value.last_name
        value.phone = (value.country_code === '66' ? '0' : value.country_code) + value.phone
      })
      const { result: userResult, success: userSuccess } = await personalData(userRequest)
      if (userSuccess) {
        setIsLoading(false)
        const { data = [] } = userResult
        if (data[0]) {
          const { user = {}, staff = [], brand_name = {}, is_mass = false } = data[0]
          const {
            email = '',
            first_name = '',
            last_name = '',
            tel = '',
            ssoid = '',
            nation_id = '',
            is_ban = false,
            line_id = '',
            user_service_type = '',
          } = user
          if (ssoid) {
            setSsoid(ssoid)
          }
          setUserInitialValues({
            ...userInitialValues,
            user_name: `${first_name} ${last_name}`,
            user_id: '',
            user_phone: tel,
            user_email: email,
            nation_id: nation_id,
            verify_email: verify_email,
            is_ban: is_ban,
            staff: staff,
            line_id: line_id,
          })

          outletData?.delivery_condition?.map((value: any, key: number) => {
            if (key > 0) {
              value.min = ">" + " " + value.min
            }
          })

          let banks: any = []
          let promptpay: any = []
          let is_cash = false
          let is_cash_active = false
          let is_banks = false
          let is_promptpays = false
          const { result: accountResult, success: accountSuccess } = await getAccounts({
            merchant_id: id,
          })
          accountResult?.account_list?.map((value: any, key: number) => {
            if (value.account_name != "" && value.account_number != "") {
              if (value.payment_channel_id == 1) {
                banks.push(value)
                if (value.status == "active") {
                  is_banks = true
                }
              } else if (value.payment_channel_id == 2) {
                promptpay.push(value)
                if (value.status == "active") {
                  is_promptpays = true
                }
              }
            }
            if (value.payment_channel_id == 3) {
              is_cash = true
              if (value.status == "active") {
                is_cash_active = true
              }
            }
          })

          let delivery_setting = outletData?.delivery_setting
          const type: string = is_mass ? 'single' : 'multiple'
          setOutletInitialValues({
            ...outletInitialValues,
            outlet_name: outletData?.name.th,
            outlet_type: outletType[type],
            tax_id: outletData?.tax_id,
            email: outletData?.email,
            full_address: outletData.full_address,
            address: outletData.address,
            province_name: outletData?.province_name,
            district_name: outletData?.district_name,
            sub_district_name: outletData?.sub_district_name,
            zipcode: outletData?.zipcode,
            verify_status: outletData.verify_status,
            photo: outletData?.photo,
            banner_photo: outletData?.banner_photo,
            latitude: outletData?.latitude,
            longitude: outletData?.longitude,
            tel: outletData?.tel,
            rating: outletData?.rating,
            business_times: business_times_Set,
            business_extra_times: business_extra_times_Set,
            status: outletData?.status,
            default_status: outletData?.status,
            opening_time: outletData?.opening_time,
            closed_time: outletData?.closed_time,
            available_credit: outletData?.available_credit,
            isBan: outletData?.is_ban,
            user_service_type: user_service_type ? userServiceType[user_service_type] : '-',
            brand_name: brand_name?.th,
            online_status: outletData?.online_status,
            default_online_status: outletData?.online_status,
            rider_type: delivery_setting?.deliver_by ? riderType[delivery_setting?.deliver_by] : '-',
            rider_condition: outletData?.delivery_condition,
            outlet_rider: riderData,
            banks: banks,
            promptpays: promptpay,
            is_cash: is_cash,
            is_banks: is_banks,
            is_promptpays: is_promptpays,
            is_cash_active: is_cash_active,
            is_merchant_test: outletData?.is_merchant_test,
            is_auto_call_rider: delivery_setting?.auto_call_rider == true,
            is_auto_open: outletData?.is_auto_open
          })
        }
      }
    }
  }

  const Schema = Yup.object().shape({
    verify_status: Yup.string().trim().required('กรุณาเลือกการอนุมัติ'),
    verify_detail: Yup.mixed().test('is-42', 'กรุณาเลือกเหตุผล', (value: Array<any>, form: any) => {
      const { parent } = form
      const { verify_status = '' } = parent
      if (verify_status === 'rejected') {
        return value.length > 0
      }
      return true
    }),
  })

  const handleSubmit = async (values: any) => { }
  const handleSubmitStatus = async () => {
    const staffStatus = summaryBanStaff(userInitialValues.staff)
    if (outletInitialValues.online_status === 'online' && staffStatus.status === 'error') {
      const modal = Modal.error({
        title: 'แจ้งเตือน',
        content: `ไม่สามารถเปิดร้านได้ เนื่องจากพนักงานถูกระงับการใช้งาน`,
      })
      return
    }
    Loading.show()
    const body = {
      data: {
        id: id,
        status: outletInitialValues.status,
        online_status: outletInitialValues.online_status,
        is_merchant_test: outletInitialValues.is_merchant_test,
      },
    }

    const { result, success } = await updateOutletStatus(body)
    if (success) {
      setOutletInitialValues({
        ...outletInitialValues,
        default_status: outletInitialValues.status,
        default_online_status: outletInitialValues.online_status,
        is_merchant_test: outletInitialValues.is_merchant_test,
      })
      //Todo: Get After update
      getOutlet()
      Modal.success({
        content: <Title level={4}>แก้ไขเรียบร้อยแล้ว</Title>,
      })
      setIsEdit(false)
    }
    Loading.hide()
  }

  const outletStatusRender = (status: string) => {
    const mapping = outletStatusTH[status]
    return status ? <Tag type={mapping.status}>{mapping.text}</Tag> : ''
  }

  const onlineStatusRender = (status: string) => {
    const mapping = onlineStatusTag[status]
    return status ? <Tag type={mapping?.status}>{mapping?.text}</Tag> : ''
  }

  const merchantTestRender = () => {
    var text = "No"
    if (outletInitialValues.is_merchant_test) {
      text = "Yes"
    }
    return <Tag type={'disable'} >{text}</Tag>
  }

  const merchantTestEditForm = () => {
    const onChange = (event: any) => {
      var is_merchant_test = false
      if (event == "true") {
        is_merchant_test = true
      }
      setOutletInitialValues({
        ...outletInitialValues,
        is_merchant_test: is_merchant_test,
      })
    }

    var defaultValue = "false"
    if (outletInitialValues.is_merchant_test) {
      defaultValue = "true"
    }

    return (
      <Select
        style={{ width: '60px' }}
        defaultValue={defaultValue}
        onChange={onChange}
        size="small"
      >
        <Select.Option value="true">Yes</Select.Option>
        <Select.Option value="false">No</Select.Option>
      </Select>
    )
  }

  const outletStatusEditForm = (status: string) => {
    const onChange = (event: any) => {
      setOutletInitialValues({
        ...outletInitialValues,
        status: event ? event : 'closed',
      })
    }

    return (
      <Select
        style={{ width: '113px' }}
        defaultValue={outletInitialValues.status}
        onChange={onChange}
        size="small"
      >
        <Select.Option value="active">ดำเนินกิจการ</Select.Option>
        <Select.Option value="closed">ปิดกิจการ</Select.Option>
        <Select.Option value="temporarily_closed">ปิดปรับปรุง</Select.Option>
      </Select>
    )
  }

  const onlineStatusEditForm = (status: string) => {
    const onChange = (event: any) => {
      setOutletInitialValues({
        ...outletInitialValues,
        online_status: event ? event : 'offline',
      })
    }

    return (
      <Select
        style={{ width: '81px' }}
        defaultValue={outletInitialValues.online_status}
        onChange={onChange}
        size="small"
      >
        <Select.Option value="online">ร้านเปิด</Select.Option>
        <Select.Option value="offline">ร้านปิด</Select.Option>
      </Select>
    )
  }

  const summaryBanStaff = (staffList: Array<any>) => {
    const banList = filter(staffList, (value) => {
      return value?.is_ban === true
    })
    if (staffList.length === 0) {
      return banTextMapping(false, true)
    }
    if (banList.length === staffList.length) {
      return banTextMapping(true)
    }
    return banTextMapping(false)
  }

  const banTextMapping = (
    isBan: boolean,
    inactive = false
  ): { status: 'processing' | 'success' | 'error' | 'waiting'; text: string } => {
    if (inactive) {
      return {
        status: 'waiting',
        text: 'Inactive',
      }
    }
    return isBan
      ? {
        status: 'error',
        text: 'ถูกแบน',
      }
      : {
        status: 'success',
        text: 'ปกติ',
      }
  }

  return (
    <MainLayout isLoading={isLoadingPage}>
      <Row justify="space-around" align="middle">
        <Col span={8}>
          <Title level={4}>บัญชีผู้ใช้งาน</Title>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>บัญชีผู้ใช้งาน</Breadcrumb.Item>
            <Breadcrumb.Item>บัญชีร้านค้า</Breadcrumb.Item>
            <Breadcrumb.Item>ข้อมูลบัญชีร้านค้า</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col span={12} offset={4} style={{ textAlign: 'end' }}>
          <div>
            {isEdit ? (
              <Space size="small">
                <Button
                  type="default"
                  onClick={() => {
                    setIsEdit(false)
                    setOutletInitialValues({
                      ...outletInitialValues,
                      status: outletInitialValues.default_status,
                      online_status: outletInitialValues.default_online_status,
                      is_merchant_test: outletInitialValues.is_merchant_test,
                    })
                  }}
                >
                  ยกเลิก
                </Button>
                <Button
                  type="primary"
                  onClick={() => {
                    handleSubmitStatus()
                  }}
                >
                  บันทึก
                </Button>
              </Space>
            ) : (
              <Button
                type="default"
                onClick={() => {
                  setIsEdit(true)
                }}
              >
                แก้ไข
              </Button>
            )}
          </div>
          <Space>
            <Title style={{ textAlign: 'end', margin: '16px 0px' }} level={5}>
              ร้านทดสอบ :{' '}
              {isEdit
                ? merchantTestEditForm()
                : merchantTestRender()}
            </Title>
            <Title style={{ textAlign: 'end', margin: '16px 0px' }} level={5}>
              ร้านเปิด-ปิด :{' '}
              {isEdit
                ? onlineStatusEditForm(outletInitialValues.status)
                : onlineStatusRender(outletInitialValues.online_status)}
            </Title>
            <Title style={{ textAlign: 'end', margin: '16px 0px' }} level={5}>
              สถานะร้านค้า :{' '}
              {isEdit
                ? outletStatusEditForm(outletInitialValues.status)
                : outletStatusRender(outletInitialValues.status)}
            </Title>
          </Space>
        </Col>
      </Row>

      <Card>
        <br />
        {id && <StaffList outletId={id} page="merchant_profile" />}

        <Formik
          enableReinitialize={true}
          initialValues={outletInitialValues}
          onSubmit={handleSubmit}
          validationSchema={Schema}
        >
          {({ values }) => (
            <Form>
              <Divider />
              <Row gutter={16}>
                <Col className="gutter-row" span={3}>
                  <Title level={5}>ข้อมูลร้านค้า</Title>
                </Col>
                <Col className="gutter-row" span={4}>
                  <Button
                    type="primary"
                    size="small"
                    disabled={!isEdit || outletInitialValues.online_status == 'online'}
                    onClick={() => {
                      router.push(
                        '/userprofile/merchant/[id]/ban-merchant',
                        `/userprofile/merchant/${id}/ban-merchant`
                      )
                    }}
                    isDanger={true}
                  >
                    <StopOutlined />
                    แบนร้านค้า
                  </Button>
                </Col>
                <Col className="gutter-row" style={{ textAlign: 'end' }} offset={13} span={4}>
                  <CustomBadge
                    size="default"
                    customMapping={banTextMapping(outletInitialValues.isBan)}
                  ></CustomBadge>
                </Col>
              </Row>
              <br />

              <Row gutter={16}>
                <Col className="gutter-row" span={6}>
                  <div style={{ marginBottom: '6px' }}>
                    <Text>รูปภาพร้านค้า</Text>
                  </div>
                  <ImgButton url={values.photo} />
                </Col>
                <Col className="gutter-row" span={6}>
                  <div style={{ marginBottom: '6px' }}>
                    <Text>รูปภาพปกร้านค้า</Text>
                  </div>
                  <ImgButton url={values.banner_photo} />
                </Col>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'ชื่อแบรนด์' }}
                    name="brand_name"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="brand_name"
                    placeholder="ชื่อแบรนด์"
                    disabled={true}
                  />
                </Col>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'ช่องทางลงทะเบียน' }}
                    name="user_service_type"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="user_service_type"
                    placeholder="ช่องทางลงทะเบียน"
                    disabled={true}
                  />
                </Col>
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
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'หมายเลขประจำตัวผู้เสียภาษี' }}
                    name="tax_id"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="tax_id"
                    placeholder="หมายเลขประจำตัวผู้เสียภาษี"
                    disabled={true}
                  />
                </Col>
              </Row>
              <Row gutter={16}>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'ประเภทร้านค้า' }}
                    name="outlet_type"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="outlet_type"
                    placeholder="ประเภทร้านค้า"
                    disabled={true}
                  />
                </Col>

                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'ที่อยู่' }}
                    name="address"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="address"
                    placeholder="ที่อยู่"
                    disabled={true}
                  />
                </Col>
                <Col className="gutter-row" span={3}>
                  <Field
                    label={{ text: 'เขต/อำเภอ' }}
                    name="district_name"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="district_name"
                    placeholder="เขต/อำเภอ"
                    disabled={true}
                  />
                </Col>
                <Col className="gutter-row" span={3}>
                  <Field
                    label={{ text: 'แขวง/ตำบล' }}
                    name="sub_district_name"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="sub_district_name"
                    placeholder="แขวง/ตำบล"
                    disabled={true}
                  />
                </Col>
                <Col className="gutter-row" span={3}>
                  <Field
                    label={{ text: 'จังหวัด' }}
                    name="province_name"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="province_name"
                    placeholder="จังหวัด"
                    disabled={true}
                  />
                </Col>
                <Col className="gutter-row" span={3}>
                  <Field
                    label={{ text: 'รหัสไปรษณีย์' }}
                    name="zipcode"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="zipcode"
                    placeholder="รหัสไปรษณีย์"
                    disabled={true}
                  />
                </Col>
              </Row>

              <Row gutter={16}>
                <Col className="gutter-row" span={3}>
                  <Field
                    label={{ text: 'ละติจูด' }}
                    name="latitude"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="latitude"
                    placeholder="ประเภทร้านค้า"
                    disabled={true}
                  />
                </Col>

                <Col className="gutter-row" span={3}>
                  <Field
                    label={{ text: 'ลองจิจูด' }}
                    name="longitude"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="longitude"
                    placeholder="ลองจิจูด"
                    disabled={true}
                  />
                </Col>

                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'ตำแหน่งร้านค้า' }}
                    name="address"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="address"
                    placeholder="ตำแหน่งร้านค้า"
                    disabled={true}
                  />
                </Col>

                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'เบอร์โทรร้านค้า' }}
                    name="tel"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="tel"
                    placeholder="เบอร์โทรร้านค้า"
                    disabled={true}
                  />
                </Col>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: 'คะแนนร้านค้า' }}
                    name="rating"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="rating"
                    placeholder="คะแนนร้านค้า"
                    disabled={true}
                  />
                </Col>
              </Row>
              {outletInitialValues?.rider_type != "" &&
                <>
                  <Divider />

                  <Row>
                    <Col span={12}>
                      <Title level={5}>การจัดส่ง</Title>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col className="gutter-row" span={6}>
                      <Text style={{ marginTop: '12px' }}>การค้นหาคนขับโดยอัตโนมัติ : {values.is_auto_call_rider ? "เปิด" : "ปิด"}</Text>
                      <br />
                      <Field
                        label={{ text: 'วิธีการจัดส่ง' }}
                        name="rider_type"
                        type="text"
                        component={Input}
                        className="form-control round"
                        id="rider_type"
                        placeholder="วิธีการจัดส่ง"
                        disabled={true}
                      />
                    </Col>
                  </Row></>}
              {outletInitialValues?.rider_type == "จัดส่งโดยร้านค้า" && outletInitialValues.rider_condition?.map((value: any, key: number) => {
                return <>
                  <Row gutter={16}>
                    <Col className="gutter-row" span={3}>
                      <Field
                        label={{ text: 'ระยะทางเริ่มต้น' }}
                        name={`rider_condition.${key}.min`}
                        type="text"
                        component={Input}
                        className="form-control round"
                        placeholder="ระยะทางเริ่มต้น"
                        disabled={true}
                      />
                    </Col>
                    <Col className="gutter-row" style={{ display: "flex", alignItems: 'center' }} span={1}>กม.</Col>
                    <Col className="gutter-row" span={3}>
                      <Field
                        label={{ text: 'ระยะทางสิ้นสุด' }}
                        name={`rider_condition.${key}.max`}
                        type="text"
                        component={Input}
                        className="form-control round"
                        placeholder="ระยะทางสิ้นสุด"
                        disabled={true}
                      />
                    </Col>
                    <Col className="gutter-row" style={{ display: "flex", alignItems: 'center' }} span={1}>กม.</Col>
                    <Col className="gutter-row" span={3}>
                      <Field
                        label={{ text: 'ค่าจัดส่ง' }}
                        name={`rider_condition.${key}.price`}
                        type="text"
                        component={Input}
                        className="form-control round"
                        id="price"
                        placeholder="ค่าจัดส่ง"
                        disabled={true}
                      />
                    </Col>
                    <Col className="gutter-row" style={{ display: "flex", alignItems: 'center' }} span={1}>บาท</Col>

                  </Row></>
              })}

              {outletInitialValues?.rider_type == "จัดส่งโดยร้านค้า" && outletInitialValues.outlet_rider?.length > 0 && <Row>
                <Col span={12}>
                  <Title level={5}>รายชื่อไรเดอร์ที่ผูกกับร้านค้า</Title>
                </Col>
              </Row>}

              {outletInitialValues?.rider_type == "จัดส่งโดยร้านค้า" && outletInitialValues.outlet_rider?.map((value: any, key: number) => {
                return <>
                  <Row gutter={16}>
                    <Col className="gutter-row" span={6}>
                      <Field
                        label={{ text: 'Rider ID' }}
                        name={`outlet_rider.${key}.rider_id`}
                        type="text"
                        component={Input}
                        className="form-control round"
                        placeholder="Rider ID"
                        disabled={true}
                      />
                    </Col>
                    <Col className="gutter-row" span={6}>
                      <Field
                        label={{ text: 'ชื่อไรเดอร์' }}
                        name={`outlet_rider.${key}.fullname`}
                        type="text"
                        component={Input}
                        className="form-control round"
                        placeholder="ชื่อไรเดอร์"
                        disabled={true}
                      />
                    </Col>
                    <Col className="gutter-row" span={6}>
                      <Field
                        label={{ text: 'เบอร์โทรศัพท์' }}
                        name={`outlet_rider.${key}.phone`}
                        type="text"
                        component={Input}
                        className="form-control round"
                        id="price"
                        placeholder="เบอร์โทรศัพท์"
                        disabled={true}
                      />
                    </Col>
                  </Row></>
              })}
              <Divider />

              <Row>
                <Col span={8}>
                  <Title level={5}>เครดิตร้านค้า</Title>
                </Col>
                <Col span={8} offset={8} style={{ textAlign: 'end' }}>
                  <Title level={5}>{formatter.format(outletInitialValues.available_credit)}</Title>
                </Col>
              </Row>

              <Tab defaultActiveKey="1">
                <Tab.TabPane tab="เติมเงิน" key="1">
                  <Row style={{ marginBottom: 12 }}>
                    <Col span={8} offset={16} style={{ textAlign: 'end' }}>
                      <DownloadButton handelSubmit={topupsEmail} />
                    </Col>
                  </Row>
                  <Table
                    config={{
                      loading: topup.isLoading,
                      tableName: 'userprofile/merchant',
                      tableColumns: columnTopup,
                      dataSource: topup.dataTable,
                      handelDataTableLoad: topup.handelDataTableChange,
                      pagination: topup.pagination,
                      isShowRowNumber: true,
                    }}
                  />
                </Tab.TabPane>
                <Tab.TabPane tab="การใช้เครดิต" key="2">
                  <Row style={{ marginBottom: 12 }}>
                    <Col span={8} offset={16} style={{ textAlign: 'end' }}>
                      <DownloadButton handelSubmit={transactionsEmail} />
                    </Col>
                  </Row>
                  <Table
                    config={{
                      loading: credit.isLoading,
                      tableName: 'userprofile/merchant',
                      tableColumns: columnCredit,
                      dataSource: credit.dataTable,
                      handelDataTableLoad: credit.handelDataTableChange,
                      pagination: credit.pagination,
                      isShowRowNumber: true,
                    }}
                  />
                </Tab.TabPane>
              </Tab>
              <Divider />
              {(values.banks?.length > 0 || values.promptpays?.length > 0 || values.is_cash) &&
                <>
                  <Title level={5}>การรับชำระเงิน</Title>
                  <Row gutter={16}>
                    <Col className="gutter-row" span={6}>
                      <Text >ช่องทางการรับชำระเงิน</Text>
                    </Col>
                  </Row>
                </>
              }
              {values.is_cash &&
                <Row gutter={16}>
                  <Col className="gutter-row" style={{ marginTop: '24px' }} span={4}>
                    <Field
                      label={{ text: "เงินสด" }}
                      name={`is_cash_active`}
                      component={CheckBox}
                      className="form-control round"
                      id="is_cash_active"
                      disabled={true}
                    />
                  </Col>
                </Row>}
              {values.banks?.length > 0 &&
                <Row gutter={16}>
                  <Col className="gutter-row" span={4}>
                    <Field
                      label={{ text: "บัญชีธนาคาร" }}
                      name={`is_banks`}
                      component={CheckBox}
                      className="form-control round"
                      id="bank_account"
                      disabled={true}
                    />
                  </Col>
                </Row>}
              {values.banks?.map((value: any, index) => {
                return (
                  <>
                    <Row gutter={16}>
                      <Col style={{ display: 'flex', alignItems: 'center' }} className="gutter-row" span={6}>
                        <Text style={{ marginRight: "4%" }}>บัญชีที่ {index + 1}</Text>
                        {value?.is_main_account == "yes" &&
                          <Button type="primary" shape="round" >บัญชีหลัก</Button>}
                      </Col>
                      <Col className="gutter-row" span={6}>
                        <Field
                          label={{ text: 'ธนาคาร' }}
                          name={`banks.${index}.bank.bank_name`}
                          type="text"
                          component={Input}
                          className="form-control round"
                          id="rating"
                          placeholder="ธนาคาร"
                          disabled={true}
                        />
                      </Col>
                      <Col className="gutter-row" span={6}>
                        <Field
                          label={{ text: 'ชื่อบัญชี' }}
                          name={`banks.${index}.account_name`}
                          type="text"
                          component={Input}
                          className="form-control round"
                          id="rating"
                          placeholder="ชื่อบัญชี"
                          disabled={true}
                        />
                      </Col>
                      <Col className="gutter-row" span={6}>
                        <Field
                          label={{ text: 'เลขบัญชี' }}
                          name={`banks.${index}.account_number`}
                          type="text"
                          component={Input}
                          className="form-control round"
                          id="rating"
                          placeholder="เลขบัญชี"
                          disabled={true}
                        />
                      </Col>
                    </Row>
                  </>
                )
              })}
              {values.promptpays?.length > 0 &&
                <Row gutter={16}>
                  <Col className="gutter-row" span={4}>
                    <Field
                      label={{ text: "พร้อมเพย์" }}
                      name={`is_promptpays`}
                      component={CheckBox}
                      className="form-control round"
                      id="promptpay_account"
                      disabled={true}
                    />
                  </Col>
                </Row>}
              {values.promptpays?.map((value: any, index) => {
                return (
                  <>
                    <Row gutter={16} >
                      <Col style={{ display: 'flex', alignItems: 'center' }} className="gutter-row" span={6}>
                        <Text style={{ marginRight: "4%" }}>บัญชีที่ {index + 1}</Text>
                        {value?.is_main_account == "yes" &&
                          <Button type="primary" shape="round" style={{ cursor: 'auto' }} >บัญชีหลัก</Button>}
                      </Col>
                      <Col className="gutter-row" span={6}>
                        <Field
                          label={{ text: 'ชื่อพร้อมเพย์' }}
                          name={`promptpays.${index}.account_name`}
                          type="text"
                          component={Input}
                          className="form-control round"
                          id="rating"
                          placeholder="ชื่อพร้อมเพย์"
                          disabled={true}
                        />
                      </Col>
                      <Col className="gutter-row" span={6}>
                        <Field
                          label={{ text: 'หมายเลขพร้อมเพย์' }}
                          name={`promptpays.${index}.account_number`}
                          type="text"
                          component={Input}
                          className="form-control round"
                          id="rating"
                          placeholder="หมายเลขพร้อมเพย์"
                          disabled={true}
                        />
                      </Col>
                    </Row>
                  </>
                )
              })}
              <Divider />

              <Title level={5}>ข้อมูลการเปิด-ปิดร้าน</Title>
              <br />
              {_.isEmpty(values.business_times) === false && (
                <Row gutter={16}>
                  <Col className="gutter-row" span={6}>
                    <Text style={{ marginTop: '12px' }}>การเปิด-ปิดร้านค้าอัตโนมัติ : {values.is_auto_open ? "เปิด" : "ปิด"}</Text>
                    <br />
                    <Text style={{ marginTop: '12px' }}>วันเวลาที่เปิดปิด</Text>
                  </Col>
                  <Col className="gutter-row" span={18}>
                    <FieldArray
                      name="business_times"
                      render={(arrayHelpers) => (
                        <div>
                          {values.business_times?.map((day, index) => {
                            return (
                              <Row gutter={16} justify="space-around" align="middle" key={index}>
                                <Col className="gutter-row" span={4}>
                                  <Field
                                    label={{ text: days[day['day']] }}
                                    name={`business_times.${index}.status`}
                                    component={CheckBox}
                                    className="form-control round"
                                    id="day"
                                    disabled={true}
                                  />
                                </Col>
                                <Col className="gutter-row" span={3} >
                                  <Button
                                    style={{ background: outletInitialValues?.business_times[index]["is_open_24hr"] ? "#28a745" : "", borderColor: "white", cursor: 'auto' }}
                                    disabled={!outletInitialValues?.business_times[index]["is_open_24hr"]}
                                    shape="round"
                                  >
                                    24 ชั่วโมง
                                  </Button>
                                </Col>
                                <Col className={`gutter-row ${outletInitialValues?.business_times[index]["is_open_24hr"] && 'is_24hr'}`} span={8}>
                                  <Field
                                    label={{ text: 'เวลา' }}
                                    name={`business_times.${index}.opening_time`}
                                    type="text"
                                    component={Input}
                                    className="form-control round"
                                    id="rating"
                                    placeholder="เวลา"
                                    disabled={true}
                                  />
                                </Col>
                                <Col className={`gutter-row ${outletInitialValues?.business_times[index]["is_open_24hr"] && 'is_24hr'}`} span={8}>
                                  <Field
                                    label={{ text: 'เวลา' }}
                                    name={`business_times.${index}.closed_time`}
                                    type="text"
                                    component={Input}
                                    className="form-control round"
                                    id="rating"
                                    placeholder="เวลา"
                                    disabled={true}
                                  />
                                </Col>
                              </Row>
                            )
                          })}
                        </div>
                      )}
                    />
                  </Col>
                </Row>
              )}

              {_.isEmpty(values.business_extra_times) === false && (
                <Row gutter={16}>
                  <Col className="gutter-row" span={6}>
                    <Text style={{ marginTop: '12px' }}>วันหยุดพิเศษ</Text>
                  </Col>
                  <Col className="gutter-row" span={18}>
                    <FieldArray
                      name="business_extra_times"
                      render={(arrayHelpers) => (
                        <div>
                          {values.business_extra_times?.map((day, index) => {
                            return (
                              <Row gutter={16} justify="space-around" align="middle" key={index}>
                                <Col className="gutter-row" span={8}>
                                  <Field
                                    label={{ text: `วันหยุดพิเศษ ${index + 1}` }}
                                    name={`business_extra_times.${index}.status`}
                                    component={CheckBox}
                                    className="form-control round"
                                    id="day"
                                    disabled={true}
                                  />
                                </Col>
                                <Col className="gutter-row" span={8}>
                                  <Field
                                    label={{ text: 'วันที่' }}
                                    name={`business_extra_times.${index}.start_date`}
                                    type="text"
                                    component={Input}
                                    className="form-control round"
                                    id="rating"
                                    placeholder="วันที่"
                                    disabled={true}
                                  />
                                </Col>
                                <Col className="gutter-row" span={8}>
                                  <Field
                                    label={{ text: 'วันที่' }}
                                    name={`business_extra_times.${index}.end_date`}
                                    type="text"
                                    component={Input}
                                    className="form-control round"
                                    id="rating"
                                    placeholder="วันที่"
                                    disabled={true}
                                  />
                                </Col>
                              </Row>
                            )
                          })}
                        </div>
                      )}
                    />
                  </Col>
                </Row>
              )}

              <Title level={5}>ข้อมูลการเข้าร่วม Logistic Subsidize</Title>

              <Row gutter={16}>
                <Col className="gutter-row" span={24}>
                  <Table
                    config={{
                      loading: joinLs.isLoading,
                      tableName: 'merchant/ls_outlet',
                      tableColumns: columnJoinLs,
                      dataSource: joinLs.dataTable,
                      handelDataTableLoad: joinLs.handelDataTableChange,
                      pagination: joinLs.pagination,
                      isShowRowNumber: true,
                    }}
                  />
                </Col>

              </Row>

            </Form>
          )}
        </Formik>
      </Card>
    </MainLayout>
  )
}
