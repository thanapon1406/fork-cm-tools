import React, { ReactElement } from 'react'
import MainLayout from "@/layout/MainLayout";
import { Row, Col } from "antd";
import { Formik, Form, Field } from "formik";
import Card from "@/components/Card";
import Input from "@/components/Form/Input";
import Button from "@/components/Button";

interface Props {
    
}

export default function view({}: Props): ReactElement {
	const initialValues = {
    keyword: "",
    approve_status: "all",
    status: "all",
    ekyc_status: "all",
    created_at: {
      start: "",
      end: "",
    },
    updated_at: {
      start: "",
      end: "",
    },
  }
	
	const handleSubmit = (values: any) => {
    console.log("test");
  }

    return (
        <MainLayout>
							<Formik
								initialValues={initialValues}
								onSubmit={handleSubmit}
								//validationSchema={Schema}
							>
								{({ values, resetForm }) => (
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
													label={{ text: "ชื่อ - สกุล" }}
													name="keyword"
													type="text"
													component={Input}
													className="form-control round"
													id="keyword"
													placeholder="ชื่อ-สกุล"
													isRange={true}
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
													isRange={true}
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
													isRange={true}
												/>
											</Col>
											<Col className="gutter-row" span={6}>
											<Field
													label={{ text: "อีเมล" }}
													name="keyword"
													type="text"
													component={Input}
													className="form-control round"
													id="keyword"
													placeholder="อีเมล"
													isRange={true}
												/>
											</Col>
											<Col className="gutter-row" span={6}>
											<Field
													label={{ text: "SsoID" }}
													name="keyword"
													type="text"
													component={Input}
													className="form-control round"
													id="keyword"
													placeholder="ชื่อ-สกุล, เบอร์โทรศัพท์"
													isRange={true}
												/>
											</Col>
										</Row>
										</Card>
										<Card>
										<Row>
										<Col className="gutter-row" span={6}>
											<span>ใบอนุญาตขับรถ</span>
										</Col>
										<Col className="gutter-row" span={6}>
											<Field
													label={{ text: "SsoID" }}
													name="keyword"
													type="text"
													component={Button}
													className="form-control round"
													id="keyword"
													placeholder="ชื่อ-สกุล, เบอร์โทรศัพท์"
													isRange={true}
												/>
											</Col>
											</Row>
										</Card>
									</Form>
								)}
								
							</Formik>
            hello
        </MainLayout>
    )
}
