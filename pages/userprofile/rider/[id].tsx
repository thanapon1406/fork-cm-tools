import Button from "@/components/Button";
import Card from "@/components/Card";
import Input from "@/components/Form/Input";
import MainLayout from "@/layout/MainLayout";
import { downloadImage } from '@/services/cdn';
import { getRiderDetail } from '@/services/rider';
import { Breadcrumb, Col, Form as antForm, Modal, Row, Typography } from "antd";
import { Field, Form, Formik } from "formik";
import _, { isUndefined } from 'lodash';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { ReactElement, useEffect, useState } from "react";
const { Title } = Typography;


interface Props {

}

interface queryListDetail {
  id?: string | string[] | undefined
  include?: string
}

interface queryUpdateRiderStatus {
  data: {
    id?: string | undefined;
    status?: string;
    ekyc_status?: string;
    topic?: {
      id?: number;
      code?: string;
      title?: string;
      status?: boolean;
    }[];
  }
}

interface riderDetail {
  id?: string;
  project_id?: number;
  sso_id: string;
  gender?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  country_code?: string;
  code?: string;
  verify_email?: boolean;
  working_status?: string;
  status?: string;
  ekyc_status?: string;
  approve_status?: string;
  view_approve_status?: boolean;
  reason?: string[];
  driver_license_photo?: string;
  car_photo?: string;
  car_tax_photo?: string;
  disable_photo?: string;
}


export default function RiderDetail({ }: Props): ReactElement {
  const router = useRouter()
  const { id } = router.query
  let [_isLoading, setIsLoading] = useState(true);
  let [riderDetail, setRiderDetail] = useState<riderDetail>({
    sso_id: ""
  });
  const [isShowMediaModal, setIsShowMediaModal] = useState(false)
  const [isLoadingMedia, setIsLoadingMedia] = useState(false)
  const [imgUrl, setImgUrl] = useState('')

  useEffect(() => {
    if (id) {
      fetchData()
    }
  }, [id])

  const fetchData = async () => {
    const request: queryListDetail = {
      include: "pdpa",
      id: id,
    }
    setIsLoading(true);
    const { result, success } = await getRiderDetail(request);
    let RiderDetail: riderDetail
    let riderID: any
    if (success) {
      const { message, data } = result;
      riderID = data.id
      const rider_status = data.status
      data.approve_status = "approve"
      data.name = data.first_name + " " + data.last_name
      data.phone = data.country_code + data.phone
      data.reason = []
      if (isUndefined(data.pdpa)) {
        data.contact_emergency = ""
        data.contact_emergency_address = ""
        data.contact_refer = ""
        data.contact_refer_address = ""
        data.car = ""
        data.driver_license_photo = ""
        data.car_photo = ""
        data.car_tax_photo = ""
        data.disable_photo = ""
      } else {
        data.contact_emergency = _.find(data.contacts, function (o) { return o.type == "emergency"; });
        data.contact_emergency_phone = _.get(data.contact_emergency, 'country_code', '') + _.get(data.contact_emergency, 'phone', '');
        data.contact_emergency_address = _.get(data.contact_emergency, 'address_no', ''); + " " + _.get(data.contact_emergency, 'district_name', ''); + " " + _.get(data.subdistrict_name, 'district_name', ''); + " " + _.get(data.subdistrict_name, 'province_name', ''); + " " + _.get(data.subdistrict_name, 'zipcode', '');
        data.contact_refer = _.find(data.contacts, function (o) { return o.type == "refer"; });
        data.contact_refer_phone = _.get(data.contact_refer, 'country_code', '') + _.get(data.contact_refer, 'phone', '');
        data.contact_refer_address = _.get(data.contact_refer, 'address_no', ''); + " " + _.get(data.contact_refer, 'district_name', ''); + " " + _.get(data.contact_emergency, 'subdistrict_name', ''); + " " + _.get(data.contact_emergency, 'province_name', ''); + " " + _.get(data.contact_emergency, 'zipcode', '');
        data.car = _.get(data.pdpa, 'car_info[0].brand_name', '') + "/" + _.get(data.pdpa, 'car_info[0].model_name', '')
        data.driver_license_photo = _.get(data.pdpa, 'driver_license_photo', '')
        data.car_photo = _.get(data.pdpa, 'car_info[0].photo', '')
        data.car_tax_photo = _.get(data.pdpa, 'car_info[0].tax_photo', '')
        data.disable_photo = _.get(data.pdpa, 'disable_person[0].photo', '')
      }
      RiderDetail = data

      setRiderDetail(RiderDetail)
      setIsLoading(false);
    };

  }

  const onClickViewMedia = async (type: string, pathUrl: string) => {
    setIsLoadingMedia(true)
    const payload = {
      filepath: pathUrl,
    }

    const res = await downloadImage(payload)
    const url = URL.createObjectURL(res)
    setImgUrl(url)
    setIsLoadingMedia(false)
    setIsShowMediaModal(true)

  }

  const handleSubmit = async (values: any) => {

  }

  const handleStatus = (event: any) => {

  };

  return (
    <MainLayout>
      {!_isLoading &&
        <>
          <Title level={4}>อนุมัติผลการละทะเบียนเข้าใช้ระบบ</Title>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>อนุมัติผลการละทะเบียน</Breadcrumb.Item>
            <Breadcrumb.Item>ลงทะเบียนคนขับ</Breadcrumb.Item>
            <Breadcrumb.Item>ข้อมูลคนขับ</Breadcrumb.Item>
          </Breadcrumb>
          <Modal
            closable={false}
            onOk={() => {
              setIsShowMediaModal(false)
            }}
            visible={isShowMediaModal}
            footer={[
              <Button
                key="1"
                type="primary"
                onClick={() => {
                  setIsShowMediaModal(false)
                }}
              >
                ปิด
              </Button>,
            ]}
          >
            <Image src={imgUrl} width={1920} height={1200} alt="media" />
          </Modal>
          <Formik
            enableReinitialize={true}
            initialValues={riderDetail}
            onSubmit={handleSubmit}
          //validationSchema={Schema}
          >

            {({ values, resetForm, setFieldValue }) => (
              <Form>
                <Card>
                  <Row gutter={16} >
                    <h2>ข้อมูลการลงทะเบียน(Register Data)</h2>
                  </Row>
                  <Row gutter={16} >
                    <h3>ข้อมูลส่วนบุคคล</h3>
                  </Row>
                  <Row gutter={10} >
                    <Col className="gutter-row" span={6}>
                      <Field
                        label={{ text: "Rider ID" }}
                        name="code"
                        type="text"
                        component={Input}
                        className="form-control round"
                        placeholder="Rider ID"
                        isRange={true}
                        disabled={true}
                      />
                    </Col>
                    <Col className="gutter-row" span={6}>
                      <Field
                        label={{ text: "ชื่อ - สกุล" }}
                        name="name"
                        type="text"
                        component={Input}
                        className="form-control round"
                        placeholder="ชื่อ-สกุล"
                        isRange={true}
                        disabled={true}
                      />
                    </Col>
                    <Col className="gutter-row" span={6}>
                      <Field
                        label={{ text: "เพศ" }}
                        name="gender"
                        type="text"
                        component={Input}
                        className="form-control round"
                        placeholder="เพศ"
                        isRange={true}
                        disabled={true}
                      />
                    </Col>
                    <Col className="gutter-row" span={6}>
                      <Field
                        label={{ text: "เบอร์โทรศัพท์" }}
                        name="phone"
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
                        label={{ text: "อีเมล" }}
                        name="email"
                        type="text"
                        component={Input}
                        className="form-control round"
                        placeholder="อีเมล"
                        isRange={true}
                        disabled={true}
                      />
                    </Col>
                    <Col className="gutter-row" span={6}>
                      <Field
                        label={{ text: "เลขบัตรประชาชน" }}
                        name="pdpa.nation_id"
                        type="text"
                        component={Input}
                        className="form-control round"
                        placeholder="เลขบัตรประชาชน"
                        isRange={true}
                        disabled={true}
                      />
                    </Col>
                  </Row>
                </Card>
                <Card>
                  <Row gutter={16} >
                    <h3>ที่อยู่</h3>
                  </Row>
                  <Row gutter={16} >
                    <h4>ที่อยู่ตามบัตรประชาชน</h4>
                  </Row>
                  <Row>
                    <Col className="gutter-row" span={24}>
                      <Field
                        label={{ text: "ที่อยู่1" }}
                        name="contact_emergency_address"
                        type="text"
                        component={Input}
                        className="form-control round"
                        placeholder="ที่อยู่"
                        isRange={true}
                        disabled={true}
                      />
                    </Col>
                  </Row>
                  <Row gutter={16} >
                    <h4>ที่อยู่ที่ติดต่อได้</h4>
                  </Row>
                  <Row>
                    <Col className="gutter-row" span={24}>
                      <Field
                        label={{ text: "ที่อยู่2" }}
                        name="contact_emergency_address"
                        type="text"
                        component={Input}
                        className="form-control round"
                        placeholder="ที่อยู่"
                        isRange={true}
                        disabled={true}
                      />
                    </Col>
                  </Row>
                </Card>
                <Card>
                  <Row gutter={16} >
                    <h3>ข้อมูล Rider</h3>
                  </Row>
                  <Row gutter={10}>
                    <Col style={{ marginTop: "31px" }} span={4}>
                      ใบอนุญาติขับรถ
                    </Col>
                    <Col>
                      <div className="ant-form ant-form-vertical">
                        <antForm.Item label="ใบอนุญาติขับรถ">
                          <Button
                            loading={isLoadingMedia}
                            disabled={isUndefined(values.driver_license_photo) || values.driver_license_photo == ""}
                            onClick={() => {
                              if (!isUndefined(values.driver_license_photo)) {
                                onClickViewMedia('image', values.driver_license_photo)
                              }
                            }}
                          >
                            ดูรูปภาพ
                          </Button>
                        </antForm.Item>
                      </div>
                    </Col>
                  </Row>
                  <Row gutter={10}>
                    <Col style={{ marginTop: "31px" }} span={4}>
                      บุคคลที่ติดต่อได้ในกรณีฉุกเฉิน
                    </Col>
                    <Col className="gutter-row" span={6}>
                      <Field
                        label={{ text: "ชื่อ-สกุลของบุคคลที่ติดต่อได้ในกรณีฉุกเฉิน" }}
                        name="contact_emergency.fullname"
                        type="text"
                        component={Input}
                        className="form-control round"
                        placeholder="ชื่อ-สกุล"
                        isRange={true}
                        disabled={true}
                      />
                    </Col>
                    <Col className="gutter-row" span={6}>
                      <Field
                        label={{ text: "ความสัมพันธ์" }}
                        name="contact_emergency.relationship"
                        type="text"
                        component={Input}
                        className="form-control round"
                        placeholder="ความสัมพันธ์"
                        isRange={true}
                        disabled={true}
                      />
                    </Col>
                    <Col className="gutter-row" span={6}>
                      <Field
                        label={{ text: "เบอร์โทรศัพท์" }}
                        name="contact_emergency_phone"
                        type="text"
                        component={Input}
                        className="form-control round"
                        placeholder="เบอร์โทรศัพท์"
                        isRange={true}
                        disabled={true}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col className="gutter-row" span={18} offset={4}>
                      <Field
                        label={{ text: "ที่อยู่" }}
                        name="contact_emergency_address"
                        type="text"
                        component={Input}
                        className="form-control round"
                        placeholder="ที่อยู่"
                        isRange={true}
                        disabled={true}
                      />
                    </Col>
                  </Row>
                  <Row gutter={10}>
                    <Col style={{ marginTop: "31px" }} span={4}>
                      บุคคลอ้างอิง
                    </Col>
                    <Col className="gutter-row" span={6}>
                      <Field
                        label={{ text: "ชื่อ-สกุลของบุคคลอ้างอิง" }}
                        name="contact_refer.fullname"
                        type="text"
                        component={Input}
                        className="form-control round"
                        placeholder="ชื่อ-สกุล"
                        isRange={true}
                        disabled={true}
                      />
                    </Col>
                    <Col className="gutter-row" span={6}>
                      <Field
                        label={{ text: "ความสัมพันธ์" }}
                        name="contact_refer.relationship"
                        type="text"
                        component={Input}
                        className="form-control round"
                        placeholder="ความสัมพันธ์"
                        isRange={true}
                        disabled={true}
                      />
                    </Col>
                    <Col className="gutter-row" span={6}>
                      <Field
                        label={{ text: "เบอร์โทรศัพท์" }}
                        name="contact_refer_phone"
                        type="text"
                        component={Input}
                        className="form-control round"
                        placeholder="เบอร์โทรศัพท์"
                        isRange={true}
                        disabled={true}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col className="gutter-row" span={18} offset={4}>
                      <Field
                        label={{ text: "ที่อยู่" }}
                        name="contact_refer_address"
                        type="text"
                        component={Input}
                        className="form-control round"
                        placeholder="ที่อยู่"
                        isRange={true}
                        disabled={true}
                      />
                    </Col>
                  </Row>
                  <Row gutter={10}>
                    <Col style={{ marginTop: "31px" }} span={4}>
                      รายละเอียดรถ
                    </Col>
                    <Col className="gutter-row" span={6}>
                      <Field
                        label={{ text: "กรรมสิทธิ์เจ้าของจักรยานยนต์" }}
                        name="pdpa.car_info[0].ownership"
                        type="text"
                        component={Input}
                        className="form-control round"
                        placeholder="กรรมสิทธิ์เจ้าของจักรยานยนต์"
                        isRange={true}
                        disabled={true}
                      />
                    </Col>
                    <Col className="gutter-row" span={6}>
                      <Field
                        label={{ text: "ยี่ห้อ/รุ่นรถจักรยานยนต์" }}
                        name="car"
                        type="text"
                        component={Input}
                        className="form-control round"
                        placeholder="ยี่ห้อ/รุ่นรถจักรยานยนต์"
                        isRange={true}
                        disabled={true}
                      />
                    </Col>
                    <Col className="gutter-row" span={6}>
                      <Field
                        label={{ text: "เลขทะเบียนรถจักรยานยนต์" }}
                        name="pdpa.car_info[0].car_no"
                        type="text"
                        component={Input}
                        className="form-control round"
                        placeholder="เลขทะเบียนรถจักรยานยนต์"
                        isRange={true}
                        disabled={true}
                      />
                    </Col>
                  </Row>
                  <Row gutter={10}>
                    <Col className="gutter-row" span={6} offset={4}>
                      <div className="ant-form ant-form-vertical">
                        <antForm.Item label="รูปรายการจดทะเบียนรถจักรยานยนต์">
                          <Button
                            loading={isLoadingMedia}
                            disabled={isUndefined(values.car_photo) || values.car_photo == ""}
                            onClick={() => {
                              if (!isUndefined(values.car_photo)) {
                                onClickViewMedia('image', values.car_photo)
                              }
                            }}
                          >
                            ดูรูปภาพ
                          </Button>
                        </antForm.Item>
                      </div>
                    </Col>
                    <Col className="gutter-row" span={6}>
                      <div className="ant-form ant-form-vertical">
                        <antForm.Item label="รูปรายการชำระภาษีรถจักรยานยนต์">
                          <Button
                            loading={isLoadingMedia}
                            disabled={isUndefined(values.car_tax_photo) || values.car_tax_photo == ""}
                            onClick={() => {
                              if (!isUndefined(values.car_tax_photo)) {
                                onClickViewMedia('image', values.car_tax_photo)
                              }
                            }}
                          >
                            ดูรูปภาพ
                          </Button>
                        </antForm.Item>
                      </div>
                    </Col>
                  </Row>
                  <Row gutter={10}>
                    <Col style={{ marginTop: "31px" }} span={4}>
                      ความบกพร่องทางร่างกาย
                    </Col>
                    <Col className="gutter-row" span={6}>
                      <Field
                        label={{ text: "ความบกพร่องทางร่างกาย" }}
                        name="pdpa.disable_person[0].disable"
                        type="text"
                        component={Input}
                        className="form-control round"
                        placeholder="ความบกพร่องทางร่างกาย"
                        isRange={true}
                        disabled={true}
                      />
                    </Col>
                    <Col className="gutter-row" span={6}>
                      <div className="ant-form ant-form-vertical">
                        <antForm.Item label="รูปความบกพร่องทางร่างกาย">
                          <Button
                            loading={isLoadingMedia}
                            disabled={isUndefined(values.disable_photo) || values.disable_photo == ""}
                            onClick={() => {
                              if (!isUndefined(values.disable_photo)) {
                                onClickViewMedia('image', values.disable_photo)
                              }
                            }}
                          >
                            ดูรูปภาพ
                          </Button>
                        </antForm.Item>
                      </div>
                    </Col>
                  </Row>
                </Card>
                <Card minHeight={100}>
                  <Row gutter={10}>
                    <Col style={{ marginTop: "31px" }} span={4}>
                      ช่องทางการสมัคร
                    </Col>
                    <Col className="gutter-row" span={6}>
                      <span>social</span>
                    </Col>
                    <Col className="gutter-row" span={6}>
                      <Field
                        label={{ text: "วันที่อนุมัติ" }}
                        name="contact_emergency.fullname"
                        type="text"
                        component={Input}
                        className="form-control round"
                        placeholder="วันที่อนุมัติ"
                        isRange={true}
                        disabled={true}
                      />
                    </Col>
                  </Row>
                </Card>
                <div style={{ maxHeight: 200, overflowY: 'auto', marginBottom: 36 }}>
                  <Card marginBottom={1}>
                    <Row gutter={16} >
                      <h3>ผูกร้านค้า</h3>
                    </Row>
                    <Row gutter={16}>
                      <Col style={{ marginTop: "31px" }} span={4}>
                        ร้านค้าที่ {`1`}
                      </Col>
                      <Col className="gutter-row" span={6}>
                        <Field
                          label={{ text: "ชื่อร้านค้า" }}
                          name="contact_refer.fullname"
                          type="text"
                          component={Input}
                          className="form-control round"
                          placeholder="ชื่อร้านค้า"
                          isRange={true}
                          disabled={true}
                        />
                      </Col>
                      <Col className="gutter-row" span={6}>
                        <Field
                          label={{ text: "คำอธิบายร้านค้า" }}
                          name="contact_refer.fullname"
                          type="text"
                          component={Input}
                          className="form-control round"
                          placeholder="ชื่อร้านค้า"
                          isRange={true}
                          disabled={true}
                        />
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col style={{ marginTop: "31px" }} span={4}>
                        ร้านค้าที่ {`1`}
                      </Col>
                      <Col className="gutter-row" span={6}>
                        <Field
                          label={{ text: "ชื่อร้านค้า" }}
                          name="contact_refer.fullname"
                          type="text"
                          component={Input}
                          className="form-control round"
                          placeholder="ชื่อร้านค้า"
                          isRange={true}
                          disabled={true}
                        />
                      </Col>
                      <Col className="gutter-row" span={6}>
                        <Field
                          label={{ text: "คำอธิบายร้านค้า" }}
                          name="contact_refer.fullname"
                          type="text"
                          component={Input}
                          className="form-control round"
                          placeholder="ชื่อร้านค้า"
                          isRange={true}
                          disabled={true}
                        />
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col style={{ marginTop: "31px" }} span={4}>
                        ร้านค้าที่ {`1`}
                      </Col>
                      <Col className="gutter-row" span={6}>
                        <Field
                          label={{ text: "ชื่อร้านค้า" }}
                          name="contact_refer.fullname"
                          type="text"
                          component={Input}
                          className="form-control round"
                          placeholder="ชื่อร้านค้า"
                          isRange={true}
                          disabled={true}
                        />
                      </Col>
                      <Col className="gutter-row" span={6}>
                        <Field
                          label={{ text: "คำอธิบายร้านค้า" }}
                          name="contact_refer.fullname"
                          type="text"
                          component={Input}
                          className="form-control round"
                          placeholder="ชื่อร้านค้า"
                          isRange={true}
                          disabled={true}
                        />
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col style={{ marginTop: "31px" }} span={4}>
                        ร้านค้าที่ {`1`}
                      </Col>
                      <Col className="gutter-row" span={6}>
                        <Field
                          label={{ text: "ชื่อร้านค้า" }}
                          name="contact_refer.fullname"
                          type="text"
                          component={Input}
                          className="form-control round"
                          placeholder="ชื่อร้านค้า"
                          isRange={true}
                          disabled={true}
                        />
                      </Col>
                      <Col className="gutter-row" span={6}>
                        <Field
                          label={{ text: "คำอธิบายร้านค้า" }}
                          name="contact_refer.fullname"
                          type="text"
                          component={Input}
                          className="form-control round"
                          placeholder="ชื่อร้านค้า"
                          isRange={true}
                          disabled={true}
                        />
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col style={{ marginTop: "31px" }} span={4}>
                        ร้านค้าที่ {`1`}
                      </Col>
                      <Col className="gutter-row" span={6}>
                        <Field
                          label={{ text: "ชื่อร้านค้า" }}
                          name="contact_refer.fullname"
                          type="text"
                          component={Input}
                          className="form-control round"
                          placeholder="ชื่อร้านค้า"
                          isRange={true}
                          disabled={true}
                        />
                      </Col>
                      <Col className="gutter-row" span={6}>
                        <Field
                          label={{ text: "คำอธิบายร้านค้า" }}
                          name="contact_refer.fullname"
                          type="text"
                          component={Input}
                          className="form-control round"
                          placeholder="ชื่อร้านค้า"
                          isRange={true}
                          disabled={true}
                        />
                      </Col>
                    </Row>
                  </Card>
                </div>
              </Form>
            )}
          </Formik>
        </>
      }
    </MainLayout>
  )
}
