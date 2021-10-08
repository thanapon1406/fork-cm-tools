import React, { ReactElement, useEffect,useState } from "react";
import { useRouter } from "next/router";

import MainLayout from "@/layout/MainLayout";
import Button from "@/components/Button";
import Table from "@/components/Table";
import Card from "@/components/Card";
import { Row, Col, Typography, Breadcrumb, Divider } from "antd";
import { outletDetail } from "@/services/merchant";
const { Title } = Typography;
import { Formik, Form, Field } from "formik";
import Input from "@/components/Form/Input";

interface Props {}

export default function view({}: Props): ReactElement {
  const router = useRouter();
  const { id } = router.query;
  let [initialValues, setInitialValues] =  useState({
      outlet_name:"124",
      outlet_type:"",
      tax_id:"",
      email:"",
      address:""
  });

  useEffect(() => {
    console.log(`useEffect`, id);
    if (id) {
      getOutlet();
    }
  }, [id]);

  const getOutlet = async () => {
    const request = {
      id: id,
    };
    const { result, success } = await outletDetail(request);
    if (success) {
      const { data } = result;
      console.log(`data`, data);
      setInitialValues({
        outlet_name:data.name.th,
        outlet_type:data.outlet_type,
        tax_id:data.tax_id,
        email:data.email,
        address:data.address
    });
    }
  };

  const Schema = {};

  const handleSubmit = () => {};

  return (
    <MainLayout>
      <Title level={4}>อนุมัติผลการละทะเบียนเข้าใช้ระบบ</Title>
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>อนุมัติผลการละทะเบียน</Breadcrumb.Item>
        <Breadcrumb.Item>ลงทะเบียนร้านค้า</Breadcrumb.Item>
        <Breadcrumb.Item>ข้อมูลร้านค้า</Breadcrumb.Item>
      </Breadcrumb>
      <Card>
        <br />
        <Formik
          enableReinitialize={true}
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={Schema}
        >
          {(values) => (
            <Form>
              <Title level={5}>ข้อมูลการลงทะเบียน</Title>
              <Title level={5}>ข้อมูลส่วนบุคคล</Title>
              <Row gutter={16}>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: "ชื่อ-นามสกุล" }}
                    name="keyword"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="keyword"
                    placeholder="ชื่อ-นามสกุล"
                    disabled={true}
                  />
                </Col>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: "เลขบัตรประชาชน" }}
                    name="keyword"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="keyword"
                    placeholder="เลขบัตรประชาชน"
                  />
                </Col>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: "เบอร์โทรศัพท์" }}
                    name="keyword"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="keyword"
                    placeholder="เบอร์โทรศัพท์"
                  />
                </Col>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: "อีเมล์" }}
                    name="keyword"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="keyword"
                    placeholder="อีเมล์"
                  />
                </Col>
              </Row>
              <Row>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: "ชื่อ-นามสกุล" }}
                    name="keyword"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="keyword"
                    placeholder="ชื่อ-นามสกุล"
                  />
                </Col>
              </Row>

              <div>Ekyc Space</div>
              <Divider />
              <Title level={5}>ข้อมูลร้านค้า</Title>
              <Row gutter={16}>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: "ชื่อร้านค้า" }}
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
                    label={{ text: "ประเภทร้านค้า" }}
                    name="outlet_type"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="outlet_type"
                    placeholder="ประเภทร้านค้า"
                  />
                </Col>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: "หมายเลขประจำตัวผู้เสียภาษี" }}
                    name="tax_id"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="tax_id"
                    placeholder="หมายเลขประจำตัวผู้เสียภาษี"
                  />
                </Col>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: "อีเมล์" }}
                    name="email"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="email"
                    placeholder="อีเมล์"
                  />
                </Col>
              </Row>
              <Row>
                <Col className="gutter-row" span={18}>
                  <Field
                    label={{ text: "ที่อยู่" }}
                    name="address"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="address"
                    placeholder="ที่อยู่"
                  />
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
      </Card>
    </MainLayout>
  );
}
