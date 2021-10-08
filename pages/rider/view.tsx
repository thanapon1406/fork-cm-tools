import React, { ReactElement, useState, useEffect } from "react";
import { notification } from "antd";
import MainLayout from "@/layout/MainLayout";
import { Row, Col, Typography, Breadcrumb, Form as antForm, Modal } from "antd";
import { Formik, Form, Field } from "formik";
import _, { isUndefined } from 'lodash'
const { Title } = Typography;
import Card from "@/components/Card";
import Input from "@/components/Form/Input";
import Button from "@/components/Button";
import Select from "@/components/Form/Select";
import Ekyc from "../ekyc/[id]"
import { getRiderDetail, getRejectReson, updateRiderStatus } from '@/services/rider'
import { getEkycDetail } from '@/services/ekyc'
import Image from 'next/image'


interface Props {

}

interface filterObject {
	include?: string;
	id?: string;
}

// interface updateRiderStatus {
// 	id?: string;
// 	status?: string;
// 	ekyc_status?: string;
// }


export default function view({ }: Props): ReactElement {

	let [_isLoading, setIsLoading] = useState(true);
	let [riderDetail, setRiderDetail] = useState({});
	let [disableRejectReason, setDisableRejectReason] = useState(false);
	let [rejectReason, setRejectReason] = useState([] as any);
	const [isShowMediaModal, setIsShowMediaModal] = useState(false)
	const [isLoadingMedia, setIsLoadingMedia] = useState(false)
	const [imgUrl, setImgUrl] = useState('')
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
			data.status = "re-approved"
			const rider_status = data.status
			data.approve_status = "approve"
			data.name = data.first_name + " " + data.last_name
			data.status1 = ["approved", "uploaded"]
			data.contact_emergency = _.find(data.contacts, function (o) { return o.type == "emergency"; });
			data.contact_emergency_address = data.contact_emergency.address_no + " " + data.contact_emergency.district_name + " " + data.contact_emergency.subdistrict_name + " " + data.contact_emergency.province_name + " " + data.contact_emergency.zipcode
			data.contact_refer = _.find(data.contacts, function (o) { return o.type == "refer"; });
			data.contact_refer_address = data.contact_refer.address_no + " " + data.contact_refer.district_name + " " + data.contact_refer.subdistrict_name + " " + data.contact_refer.province_name + " " + data.contact_refer.zipcode
			data.car = data.pdpa.car_info[0].brand_name + "/" + data.pdpa.car_info[0].model_name
			setRiderDetail(data)
			if (data.status == "waiting" || data.status == "uploaded") {
				setDisableRejectReason(true)
			} else {
				const { result, success } = await getRejectReson();
				const { message, data } = result
				for (let index = 0; index < data.length; index++) {
					data[index].name = data[index].title
					data[index].value = data[index].id
					data[index].code = "test"
				}
				let reject_reason = _.filter(data, function (o) { return o.type == rider_status; });
				setRejectReason(reject_reason)
				//setRejectReason
				console.log(message, data, reject_reason);
				setIsLoading(false);
				setFilter(filterObj);
			}
		};
	}

	const onClickViewMedia = async (type: string, pathUrl: string) => {
		setIsLoadingMedia(true)
		setImgUrl(pathUrl)
		setIsLoadingMedia(false)
		setIsShowMediaModal(true)
	}

	const handleSubmit = async (values: any) => {

		const { result, success } = await getEkycDetail("b450d352-33e7-4896-a994-b9736a85d352")
		const { data } = result
		notification.success({
			message: `ดำเนินการอัพเดตสถานะสำเร็จ`,
			description: "",
		});
		console.log(values, data, success);
		let reqBody = {
			data: {
				"id": riderDetail.id,
				"status": "re-approved",
				"ekyc_status": "re-approved",
				"topic": [
					{ "id": values, "code": "rider_info", "title": "บัตรประชาชนไม่ถูกต้อง", "status": true }
				]
			}
		}
		//const message = await updateRiderStatus(reqBody);
	}

	const handleStatus = (event: any) => {
		console.log(event.target.value);
	};

	return !_isLoading ? (

		<MainLayout>
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
										label={{ text: "SsoID" }}
										name="sso_id"
										type="text"
										component={Input}
										className="form-control round"
										placeholder="SsoID"
										isRange={true}
										disabled={true}
									/>
								</Col>
							</Row>
							{/* <Ekyc isComponent sso_id="b450d352-33e7-4896-a994-b9736a85d352" /> */}
						</Card>
						<Card>
							<Row gutter={16} >
								<h3>ข้อมูล Rider</h3>
							</Row>
							<Row gutter={10}>
								<Col style={{ marginTop: "31px" }} span={4}>
									บัตรประชาชน
								</Col>
								<Col>
									<div className="ant-form ant-form-vertical">
										<antForm.Item label="รูปบัตรประชาชน">
											<Button
												loading={isLoadingMedia}
												disabled={isUndefined(values.pdpa.nation_photo)}
												onClick={() => {
													if (!isUndefined(values.pdpa.nation_photo)) {
														onClickViewMedia('image', values.pdpa.nation_photo)
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
										name="contact_emergency.phone"
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
										name="contact_refer.phone"
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
												disabled={isUndefined(values.pdpa.nation_photo)}
												onClick={() => {
													if (!isUndefined(values.pdpa.nation_photo)) {
														onClickViewMedia('image', values.pdpa.nation_photo)
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
												disabled={isUndefined(values.pdpa.nation_photo)}
												onClick={() => {
													if (!isUndefined(values.pdpa.nation_photo)) {
														onClickViewMedia('image', values.pdpa.nation_photo)
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
												disabled={isUndefined(values.pdpa.nation_photo)}
												onClick={() => {
													if (!isUndefined(values.pdpa.nation_photo)) {
														onClickViewMedia('image', values.pdpa.nation_photo)
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
						{riderDetail.status !== "waiting" &&
							<>
								<Row gutter={10}>
									<Col className="gutter-row" span={6}>
										<Field
											label={{ text: "การอนุมัติ" }}
											name="status"
											component={Select}
											id="status2"
											placeholder="เลือก"
											selectOption={[
												{
													name: "เลือก",
													value: "uploaded",
												},
												{
													name: "อนุมัติ",
													value: "approved",
												},
												{
													name: "ขอเอกสารเพิ่มเติม",
													value: "re-approved",
												},
												{
													name: "ไม่ผ่านการอนุมัติ",
													value: "rejected",
												},
											]}
										/>
									</Col>
									<Col className="gutter-row" span={6}>
										<Field
											label={{ text: "เหตุผล" }}
											mode="multiple"
											name="status1"
											allowClear={true}
											component={Select}
											id="status1"
											placeholder="เลือก"
											selectOption={rejectReason}
										/>
									</Col>
								</Row>
								<div className="ant-form" style={{ float: 'right' }}>
									<Button
										style={{ width: "120px" }}
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
							</>
						}
					</Form>
				)}
			</Formik>
		</MainLayout>
	) : (<div></div>)
}
