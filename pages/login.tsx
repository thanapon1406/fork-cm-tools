import React, { useEffect } from "react";
import type { NextPage } from "next";
import { Formik, Form, Field } from "formik";
import Input from "@/components/Form/Input";
import Link from "next/link";
import * as Yup from "yup";
import Layout from "@/components/AuthLayout";
import { Row, Col, Button, Typography, Card } from "antd";
import Image from "next/image";
import logoImg from "../public/logo-kittchenhub.png";
import { useRouter } from "next/router";
const { Title } = Typography;
import { login } from "@/services/login";

const Login: NextPage = () => {
  const initialValues = {
    username: "",
    password: "",
  };

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.clear();
    }
  }, []);

  const handleSubmit = async (values: any) => {
    const response = await login(
      values
    );
    const { result, success } = response
    if(success){
      
    }
    
  };


  const Schema = Yup.object().shape({
    username: Yup.string()
      .trim()
      .email("กรุณากรอกอีเมลให้ถูกต้อง")
      .required("กรุณากรอกอีเมล"),
    password: Yup.string().trim().required("กรุณากรอกรหัสผ่าน"),
  });

  return (
    <Layout>
      <Row justify="center">
        <Col span={24} xs={24} sm={12} md={6} style={{ textAlign: "left" }}>
          <Card bordered={false}>
            <Formik
              initialValues={initialValues}
              onSubmit={handleSubmit}
              validationSchema={Schema}
            >
              {(values) => (
                <Form>
                  <div style={{ textAlign: "center", marginBottom: "20px" }}>
                    <Image src={logoImg} width={60} height={60} />
                    <Title level={5} style={{ color: "#dc1e24" }}>
                      KITCHEN HUB ADMIN
                    </Title>
                  </div>
                  <Field
                    name="username"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="username"
                    autoComplete="off"
                    placeholder="Username"
                  />

                  <Field
                    name="password"
                    type="password"
                    component={Input}
                    className="form-control round"
                    id="password"
                    autoComplete="off"
                    placeholder="Password"
                  />

                  <Button
                    htmlType="submit"
                    type="primary"
                    shape="round"
                    style={{ marginTop: "5px" }}
                    block
                  >
                    ลงชื่อเข้าใช้
                  </Button>

                  <div style={{ marginTop: "10px" }}>
                    <Link href="/forgotpassword">ลืมรหัสผ่าน</Link>
                  </div>
                </Form>
              )}
            </Formik>
          </Card>
        </Col>
      </Row>
    </Layout>
  );
};

export default Login;
