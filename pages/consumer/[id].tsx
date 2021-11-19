import CustomBadge from '@/components/Badge';
import Button from "@/components/Button";
import Card from '@/components/Card';
import Input from "@/components/Form/Input";
import { Address } from '@/interface/customer';
import MainLayout from '@/layout/MainLayout';
import { consumerList, consumerUpdate } from '@/services/consumer';
import { checkOutletBySsoId } from '@/services/merchant';
import { requestReportInterface } from '@/services/report';
import { getRiderDetail } from '@/services/rider';
import { DoubleRightOutlined, StopOutlined } from '@ant-design/icons';
import { Breadcrumb, Col, Image, notification, Row, Switch, Typography } from "antd";
import { Field, FieldArray, Form, Formik } from "formik";
import { isEmpty, map } from 'lodash';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { default as React, ReactElement, useEffect, useState } from 'react';
import OrderHistoryComponent from '../orderhistory/component';
const { Title } = Typography

interface Props { }

export default function View({ }: Props): ReactElement {
  // const [brandObject, setBrandState] = useRecoilState(brandState)
  let [_isLoading, setIsLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false)
  const router = useRouter()
  const [isActive, setActive] = useState("")
  const id = router.query.id as string

  let [initialValues, setInitialValues] = useState({
    email: '',
    ssoId: '',
    tel: '',
    socialName: '',
    point: '',
    rank: '',
    confirmEKYC: '',
    firstName: '',
    lastName: '',
    facebookId: '',
    appleId: '',
    googleId: '',
    lineId: '',
    merchant: 'No',
    rider: 'No',
    isBan: false
  })

  let [paramsHistory, setparamsHistory] = useState<requestReportInterface>({
    // brand_id: brandObject.id,
    page: 1,
    per_page: 10,
    sso_id: "",
  })

  let [initialAddress, setInitialAddress] = useState<Address[]>([])
  useEffect(() => {
    console.log(`useEffect`, id)
    if (id) {
      getConsumerList()
    }
  }, [id])

  const getConsumerList = async () => {
    setIsLoading(true);
    const request = {
      id: id,
    }

    const { result, success } = await consumerList(request)
    if (success) {
      const { data: [data] } = result
      if (data) {
        setInitialAddress(
          map(data.addresses, (address) => {
            address.lat_log = address["latitude"] + "," + address["longitude"]
            return address
          }))
        setActive(data.status)

        let rider = 'No'
        let merchant = 'No'
        const requestRelate = {
          sso_id: data.sso_id,
        }
        const { result: resultRider, success: successRider } = await getRiderDetail(requestRelate)
        if (successRider) {
          if (resultRider) {
            rider = 'Yes'
          }
        }

        const { result: resultMerchant, success: successMerchant } = await checkOutletBySsoId(requestRelate)
        if (successMerchant) {
          if (resultMerchant.status == true) {
            merchant = 'Yes'
          }
        }

        setInitialValues({
          ...initialValues,
          email: data.email,
          ssoId: data.sso_id,
          tel: data.tel,
          socialName: data.social_login_first_name + " " + data.social_login_last_name,
          point: data.point,
          rank: data.ranking,
          confirmEKYC: data.confirm_e_kyc,
          firstName: data.first_name,
          lastName: data.last_name,
          googleId: data.google_id,
          facebookId: data.facebook_id,
          appleId: data.apple_id,
          lineId: data.line_id,
          merchant: merchant,
          rider: rider,
          isBan: data.is_ban,
        })

        setparamsHistory({
          ...paramsHistory,
          sso_id: data.sso_id,
          // brand_id: brandObject.id,
          page: 1,
          per_page: 5,
        })
      }
    }


    setIsLoading(false);
  }

  const handleSubmit = async (values: any) => {
    const request = {
      id: id,
      status: isActive,
      last_name: values.lastName,
      first_name: values.firstName,
      is_ban: values.isBan
    }
    const update = {
      data: request
    }
    const { result, success } = await consumerUpdate(update)
    if (success) {
      notification.success({
        message: `ดำเนินการอัพเดตสถานะสำเร็จ`,
        description: "",
      });
    } else {
      notification.error({
        message: `ไม่สามารถทำการ อัพเดตได้`,
        description: "",
      });
    }
    setIsEdit(!isEdit)
  }


  const handleStatus = (event: any) => {
    const checkStatus = (isActive == "active" ? "inactive" : "active")
    setActive(checkStatus)
  };


  const showImageIcon = (url: string, isDisable: boolean) => {
    return <Image
      style={{ opacity: isDisable ? '0.5' : '' }}
      preview={false}
      width={32}
      src={url}
    />
  }

  const showDefaultAddress = (isDisable: boolean, index: number) => {
    if (isDisable == true) {
      return <Row gutter={10} >
        <Col className="gutter-row" span={2}>
          ที่อยู่ {(index + 1)}
        </Col>
        <Col className="gutter-row" span={20}>
        </Col>
        <Col className="gutter-row" span={2}>
          <Image
            width={12}
            preview={false}
            src="https://ft-pos-dev.s3-ap-southeast-1.amazonaws.com/symbolics/57e4b884-605e-49db-9427-026633b56f26/Vector.jpg"
          /> Default Address
        </Col>
      </Row>
    } else {
      return <p>ที่อยู่ {(index + 1)}</p>
    }
  }

  const renderAddress = () => {
    return !isEmpty(initialAddress) &&
      <Card>
        <Row gutter={16} >
          <h3>ที่อยู่ในการจัดส่ง</h3>
        </Row>
        < Formik
          enableReinitialize={true}
          initialValues={{
            address: initialAddress
          }}
          onSubmit={values => {
            // same shape as initial values
            console.log(values);
          }}
          render={({ values }) => (
            <FieldArray
              name="address"
              render={() => (
                <div>
                  {
                    map(values.address, (address, index) =>
                      <Row gutter={10} >
                        <Col className="gutter-row" span={8}>
                          <Field
                            label={{ text: "ชื่อที่อยุ่" }}
                            name={`address.${index}.address_name`}
                            type="text"
                            component={Input}
                            className="form-control round"
                            placeholder="ชื่อที่อยู่"
                            isRange={true}
                            disabled={true}
                          />
                        </Col>
                        <Col className="gutter-row" span={8}>
                          <Field
                            label={{ text: "ละติจูด ลองติจูด" }}
                            name={`address.${index}.lat_log`}
                            type="text"
                            component={Input}
                            className="form-control round"
                            placeholder="ละติจูด ลองติจูด"
                            isRange={true}
                            disabled={true}
                          />
                        </Col>
                        <Col className="gutter-row" span={8}>
                          <Field
                            label={{ text: "เบอร์โทรศัพท์" }}
                            name={`address.${index}.address_tel`}
                            type="text"
                            component={Input}
                            className="form-control round"
                            placeholder="เบอร์โทรศัพท์"
                            isRange={true}
                            disabled={true}
                          />
                        </Col>
                        <Col className="gutter-row" span={24}>
                          <label>
                            {showDefaultAddress(address.default_address, index)}
                          </label>
                          <Field
                            name={`address.${index}.address_detail`}
                            type="text"
                            component={Input}
                            className="form-control round"
                            placeholder="ที่อยู่"
                            isRange={true}
                            disabled={true}
                          />
                        </Col>
                      </Row>
                    )
                  }
                </div>
              )}
            />
          )
          }
        />
      </Card>
  }

  return (
    <MainLayout>
      {!_isLoading &&
        <>
          <Formik
            enableReinitialize={true}
            initialValues={initialValues}
            onSubmit={() => { }}
          >
            {({ values }: any) => (
              <Form>
                <Row gutter={16}>
                  <Col span={20}>
                    <Title level={4}>อนุมัติผลการละทะเบียนเข้าใช้ระบบ</Title>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                      <Breadcrumb.Item>User Consumer</Breadcrumb.Item>
                      <Breadcrumb.Item>Consumer Profile</Breadcrumb.Item>
                      <Breadcrumb.Item>Consumer Details</Breadcrumb.Item>
                    </Breadcrumb>
                  </Col>
                  <Col span={4}>
                    {(isEdit) ?
                      <>
                        <Button style={{ float: 'right', backGroundColor: 'forestgreen !important' }}
                          size="middle"
                          className="confirm-button"
                          onClick={() => {
                            handleSubmit(values)
                          }}
                        >
                          บันทึก
                        </Button>
                        <Button style={{ float: 'right', marginRight: "10px" }}
                          type="default"
                          size="middle"
                          onClick={() => {
                            setIsEdit(!isEdit)
                          }}
                        >
                          ยกเลิก
                        </Button>
                      </>
                      :
                      <Button style={{ float: 'right', backGroundColor: 'forestgreen !important' }}
                        type="primary"
                        size="middle"
                        onClick={() => {
                          setIsEdit(true)
                        }}
                      >
                        แก้ไข
                      </Button>
                    }
                  </Col>
                </Row>
                <Card>
                  <Row gutter={16} >
                    <Col span={10} style={{ paddingLeft: 0 }}>
                      <h2>ข้อมูลบัญชีลูกค้า (Consumer Profile Details)</h2>
                    </Col>
                    <Col span={14} style={{ textAlign: 'right' }}>
                      {(isEdit) ?
                        <span >สถานะผู้ใช้งาน: <Switch
                          onClick={handleStatus}
                          checkedChildren="active"
                          unCheckedChildren="inactive"
                          defaultChecked={(isActive == "active") ? true : false}
                        />
                        </span> :
                        <span >สถานะผู้ใช้งาน: <Switch
                          disabled={true}
                          checkedChildren="active"
                          unCheckedChildren="inactive"
                          defaultChecked={(isActive == "active") ? true : false}
                        />
                        </span>
                      }
                    </Col>
                  </Row>
                  <Row gutter={10} style={{ marginBottom: '15px' }}>
                    <Col span={2} >
                      ข้อมูลส่วนตัว
                    </Col>
                    <Col span={20}>
                      <Button
                        icon={<StopOutlined />}
                        size="small"
                        isDanger={initialValues.isBan}
                        type='primary'
                        onClick={() => {
                          router.push(`/consumer/ban/${id}`)
                        }}
                      >
                        แบนผู้ใช้งาน
                      </Button>
                    </Col>
                    <Col span={2}>
                      {initialValues.isBan ? <CustomBadge
                        customMapping={{
                          status: "error",
                          text: "ถูกแบนผู้ใช้งาน",
                        }}
                      ></CustomBadge> :
                        <CustomBadge
                          customMapping={{
                            status: "success",
                            text: "ปกติ",
                          }}
                        ></CustomBadge>}
                    </Col>
                  </Row>
                  <Row gutter={10} >
                    <Col className="gutter-row" span={6}>
                      <Field
                        label={{ text: "Consumer ID" }}
                        name="ssoId"
                        type="text"
                        component={Input}
                        className="form-control round"
                        placeholder="Consumer ID"
                        isRange={true}
                        disabled={true}
                      />
                    </Col>
                    <Col className="gutter-row" span={6}>
                      <Field
                        label={{ text: "เบอร์โทรศัพท์" }}
                        name="tel"
                        type="text"
                        component={Input}
                        className="form-control round"
                        placeholder="เบอร์โทรศัพท์"
                        isRange={true}
                        disabled={true}
                      />
                    </Col>
                    <Col className="gutter-row" span={6}>
                      <Field
                        label={{ text: "Social name" }}
                        name="socialName"
                        type="text"
                        component={Input}
                        className="form-control round"
                        placeholder="social name"
                        isRange={true}
                        disabled={true}
                      />
                    </Col>
                    <Col className="gutter-row" span={6}>
                      Social Link Account
                      <Row gutter={16} >
                        <Col className="gutter-row" span={3}>
                          {
                            showImageIcon(
                              "https://ft-pos-dev.s3-ap-southeast-1.amazonaws.com/symbolics/540d7066-f360-4d81-8bb2-b0c71d95b27b/facebook1.jpg",
                              isEmpty(initialValues.facebookId))
                          }
                        </Col>
                        <Col className="gutter-row" span={3}>
                          {
                            showImageIcon(
                              "https://ft-pos-dev.s3-ap-southeast-1.amazonaws.com/symbolics/d69cf67a-3f1e-455e-adec-9ec2a7df008b/Social-LogIn.jpg",
                              isEmpty(initialValues.googleId))
                          }
                        </Col>
                        <Col className="gutter-row" span={3}>
                          {
                            showImageIcon(
                              "https://ft-pos-dev.s3-ap-southeast-1.amazonaws.com/symbolics/2786a903-2c90-40d8-a79d-4b7d5fec26f1/Social-LogIn.png",
                              isEmpty(initialValues.lineId))
                          }
                        </Col>
                        <Col className="gutter-row" span={15}>
                        </Col>
                      </Row>
                    </Col>
                    <Col className="gutter-row" span={6}>
                      <Field
                        label={{ text: "อีเมล์" }}
                        name="email"
                        type="text"
                        component={Input}
                        className="form-control round"
                        placeholder="อีเมล์"
                        isRange={true}
                        disabled={true}
                      />
                    </Col>
                    <Col className="gutter-row" span={6}>
                      <Field
                        label={{ text: "Rank" }}
                        name="rank"
                        type="text"
                        component={Input}
                        className="form-control round"
                        placeholder="Rank"
                        isRange={true}
                        disabled={true}
                      />
                    </Col>
                    <Col className="gutter-row" span={6}>
                      <Field
                        label={{ text: "Point" }}
                        name="point"
                        type="text"
                        component={Input}
                        className="form-control round"
                        placeholder="Point"
                        isRange={true}
                        disabled={true}
                      />
                    </Col>
                  </Row>

                  {
                    renderAddress()
                  }
                  <Row gutter={10} >
                    <Col className="gutter-row" span={4}>
                      <Field
                        label={{ text: "สถานะ E-KYC" }}
                        name="confirmEKYC"
                        type="text"
                        component={Input}
                        className="form-control round"
                        placeholder=""
                        isRange={true}
                        disabled={true}
                      />
                    </Col>
                    <Col className="gutter-row" span={5}>
                      <Field
                        label={{ text: "Name" }}
                        name="firstName"
                        type="text"
                        component={Input}
                        className="form-control round"
                        placeholder=""
                        isRange={true}
                        disabled={!isEdit}
                      />
                    </Col>
                    <Col className="gutter-row" span={5}>
                      <Field
                        label={{ text: "Lastname" }}
                        name="lastName"
                        type="text"
                        component={Input}
                        className="form-control round"
                        placeholder=""
                        isRange={true}
                        disabled={!isEdit}
                      />
                    </Col>
                    <Col className="gutter-row" span={5}>
                      <Field
                        label={{ text: "Merchant Account Relate" }}
                        name="merchant"
                        type="text"
                        component={Input}
                        className="form-control round"
                        placeholder=""
                        isRange={true}
                        disabled={true}
                      />
                    </Col>
                    <Col className="gutter-row" span={4}>
                      <Field
                        label={{ text: "Rider Account Relate" }}
                        name="rider"
                        type="text"
                        component={Input}
                        className="form-control round"
                        placeholder=""
                        isRange={true}
                        disabled={true}
                      />
                    </Col>
                  </Row>
                </Card>
              </Form>
            )}
          </Formik>

          <OrderHistoryComponent
            payload={{ ...paramsHistory }}
            tableHeader={
              <div style={{ textAlign: 'right' }}>
                <Link href={`/orderhistory?sso_id=${initialValues.ssoId}`}>
                  <a>
                    view all <DoubleRightOutlined />
                  </a>
                </Link>
              </div>
            }
          />
          {/* <Card>
                <div>
                    <Ekyc sso_id={ssoId} />
                </div>
            </Card> */}
        </>
      }
    </MainLayout >
  )
}
