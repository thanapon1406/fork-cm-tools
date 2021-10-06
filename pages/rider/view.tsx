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
											<Row gutter={10}>
												<Col span={4}>
													บัตรประชาชน
												</Col>
												<Col>
												{/* <Form.Item label="Field A" required tooltip="This is a required field"> */}
													<Button>ดูรูปภาพ</Button>
												{/* </Form.Item> */}
												</Col>
											</Row>
											<Row gutter={10}>
												<Col span={4}>
													บุคคลที่ติดต่อได้ในกรณีฉุกเฉิน
												</Col>
												<Col className="gutter-row" span={6}>
												<Field
														label={{ text: "ชื่อ-สกุลของบุคคลที่ติดต่อได้ในกรณีฉุกเฉิน" }}
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
														label={{ text: "ความสัมพันธ์" }}
														name="keyword"
														type="text"
														component={Input}
														className="form-control round"
														id="keyword"
														placeholder="ความสัมพันธ์"
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
											</Row>
											<Row>
												<Col className="gutter-row" span={18} offset={4}>
													<Field
														label={{ text: "ที่อยู่" }}
														name="keyword"
														type="text"
														component={Input}
														className="form-control round"
														id="keyword"
														placeholder="ที่อยู่"
														isRange={true}
													/>
												</Col>
											</Row>
											<Row gutter={10}>
												<Col span={4}>
													บุคคลอ้างอิง
												</Col>
												<Col className="gutter-row" span={6}>
												<Field
														label={{ text: "ชื่อ-สกุลของบุคคลอ้างอิง" }}
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
														label={{ text: "ความสัมพันธ์" }}
														name="keyword"
														type="text"
														component={Input}
														className="form-control round"
														id="keyword"
														placeholder="ความสัมพันธ์"
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
											</Row>
											<Row>
												<Col className="gutter-row" span={18} offset={4}>
													<Field
														label={{ text: "ที่อยู่" }}
														name="keyword"
														type="text"
														component={Input}
														className="form-control round"
														id="keyword"
														placeholder="ที่อยู่"
														isRange={true}
													/>
												</Col>
											</Row>
											<Row gutter={10}>
												<Col span={4}>
													รายละเอียดรถ
												</Col>
												<Col className="gutter-row" span={6}>
												<Field
														label={{ text: "กรรมสิทธิ์เจ้าของจักรยานยนต์" }}
														name="keyword"
														type="text"
														component={Input}
														className="form-control round"
														id="keyword"
														placeholder="กรรมสิทธิ์เจ้าของจักรยานยนต์"
														isRange={true}
													/>
												</Col>
												<Col className="gutter-row" span={6}>
												<Field
														label={{ text: "ยี่ห้อ/รุ่นรถจักรยานยนต์" }}
														name="keyword"
														type="text"
														component={Input}
														className="form-control round"
														id="keyword"
														placeholder="ยี่ห้อ/รุ่นรถจักรยานยนต์"
														isRange={true}
													/>
												</Col>
												<Col className="gutter-row" span={6}>
												<Field
														label={{ text: "เลขทะเบียนรถจักรยานยนต์" }}
														name="keyword"
														type="text"
														component={Input}
														className="form-control round"
														id="keyword"
														placeholder="เลขทะเบียนรถจักรยานยนต์"
														isRange={true}
													/>
												</Col>
											</Row>
											<Row gutter={10}>
												<Col className="gutter-row" span={6} offset={4}>
													<Button>ดูรูปภาพ</Button>
												</Col>
												<Col className="gutter-row" span={6}>
													<Button>ดูรูปภาพ</Button>
												</Col>
											</Row>
											<Row gutter={10}>
												<Col span={4}>
													ความบกพร่องทางร่างกาย
												</Col>
												<Col className="gutter-row" span={6}>
												<Field
														label={{ text: "ความบกพร่องทางร่างกาย" }}
														name="keyword"
														type="text"
														component={Input}
														className="form-control round"
														id="keyword"
														placeholder="ความบกพร่องทางร่างกาย"
														isRange={true}
													/>
												</Col>
												<Col className="gutter-row" span={6}>
													<Button>ดูรูปภาพ</Button>
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
