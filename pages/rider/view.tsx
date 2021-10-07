import React, { ReactElement, useState, useEffect } from "react";
import MainLayout from "@/layout/MainLayout";
import { Row, Col, Typography, Breadcrumb, Space } from "antd";
import { Formik, Form, Field } from "formik";
import _ from 'lodash'
const { Title } = Typography;
import Card from "@/components/Card";
import Input from "@/components/Form/Input";
import Button from "@/components/Button";
import { getRiderDetail } from '@/services/rider'


interface Props {
    
}

interface filterObject {
  include?: string;
  id?: string;
}


export default function view({}: Props): ReactElement {

	let [_isLoading, setIsLoading] = useState(true);
	let [riderDetail, setRiderDetail] = useState({});
	let [filter, setFilter] = useState<filterObject>({
    include: "pdpa",
    id: "87",
  });

	useEffect(() => {
		fetchData();
	}, []);
	

	const fetchData = async (
		filterObj: filterObject = filter
	) => {
		const reqBody = {
			...filterObj,
		};
		console.log(`reqBody`, reqBody);
		setIsLoading(true);
		const { result, success } = await getRiderDetail(reqBody);
		if (success) {
			const { message, data } = result;
			data.name = data.first_name+" "+data.last_name
			data.contact_emergency= _.find(data.contacts, function(o) { return o.type == "emergency"; });
			data.contact_refer= _.find(data.contacts, function(o) { return o.type == "refer"; });
			setRiderDetail(data)
			console.log(message,data);
			setIsLoading(false);
			setFilter(filterObj);
		}
	};
	
	const handleSubmit = (values: any) => {
    console.log("test");
  }

    return (
        <MainLayout>
					<Title level={4}>อนุมัติผลการละทะเบียนเข้าใช้ระบบ</Title>
					<Breadcrumb style={{ margin: "16px 0" }}>
						<Breadcrumb.Item>อนุมัติผลการละทะเบียน</Breadcrumb.Item>
						<Breadcrumb.Item>ลงทะเบียนคนขับ</Breadcrumb.Item>
						<Breadcrumb.Item>ข้อมูลคนขับ</Breadcrumb.Item>
					</Breadcrumb>
							<Formik
								enableReinitialize={true}
								initialValues={riderDetail}
								onSubmit={handleSubmit}
								//validationSchema={Schema}
							>
								
								{({ values, resetForm,setFieldValue }) => (
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
													name="name"
													type="text"
													component={Input}
													className="form-control round"
													id="keyword"
													placeholder="ชื่อ-สกุล"
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
													id="keyword"
													placeholder="เลขบัตรประชาชน"
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
													id="keyword"
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
													id="keyword"
													placeholder="อีเมล"
													isRange={true}
													disabled={true}
												/>
											</Col>
											<Col className="gutter-row" span={6}>
											<Field
													label={{ text: "SsoID" }}
													name="sso_id"
													type="text"
													component={Input}
													className="form-control round"
													id="keyword"
													placeholder="SsoID"
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
														name="contact_emergency.fullname"
														type="text"
														component={Input}
														className="form-control round"
														id="keyword"
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
														id="keyword"
														placeholder="ความสัมพันธ์"
														isRange={true}
														disabled={true}
													/>
												</Col>
												<Col className="gutter-row" span={6}>
												<Field
														label={{ text: "เบอร์โทรศัพท์" }}
														name="contact_emergency.phone"
														type="text"
														component={Input}
														className="form-control round"
														id="keyword"
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
														name="contact_emergency.address_no"
														type="text"
														component={Input}
														className="form-control round"
														id="keyword"
														placeholder="ที่อยู่"
														isRange={true}
														disabled={true}
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
														name="contact_refer.fullname"
														type="text"
														component={Input}
														className="form-control round"
														id="keyword"
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
														id="keyword"
														placeholder="ความสัมพันธ์"
														isRange={true}
														disabled={true}
													/>
												</Col>
												<Col className="gutter-row" span={6}>
												<Field
														label={{ text: "เบอร์โทรศัพท์" }}
														name="contact_refer.phone"
														type="text"
														component={Input}
														className="form-control round"
														id="keyword"
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
														name="contact_refer.address_no"
														type="text"
														component={Input}
														className="form-control round"
														id="keyword"
														placeholder="ที่อยู่"
														isRange={true}
														disabled={true}
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
														name="pdpa.car_info[0].ownership"
														type="text"
														component={Input}
														className="form-control round"
														id="keyword"
														placeholder="กรรมสิทธิ์เจ้าของจักรยานยนต์"
														isRange={true}
														disabled={true}
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
														id="keyword"
														placeholder="เลขทะเบียนรถจักรยานยนต์"
														isRange={true}
														disabled={true}
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
														name="pdpa.disable_person[0].disable"
														type="text"
														component={Input}
														className="form-control round"
														id="keyword"
														placeholder="ความบกพร่องทางร่างกาย"
														isRange={true}
														disabled={true}
													/>
												</Col>
												<Col className="gutter-row" span={6}>
													<Button>ดูรูปภาพ</Button>
												</Col>
											</Row>
										</Card>
										<div className="ant-form" style={{float: 'right'}}>
                      <Button
                        style={{ width: "120px", marginTop: "31px" }}
                        type="primary"
                        size="middle"
                        htmlType="submit"
                      >
                        submit
                      </Button>
                      {/* <Button
                        style={{ width: "120px", marginTop: "31px" }}
                        type="ghost"
                        size="middle"
                      >
                        Clear
                      </Button> */}
                  </div>
									</Form>
								)}
							</Formik>
        </MainLayout>
    )
}
