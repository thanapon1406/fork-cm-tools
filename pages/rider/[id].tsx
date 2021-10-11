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
import { getRiderDetail, getRejectReson, updateRiderStatus, getStatusHistories } from '@/services/rider'
import { getEkycDetail } from '@/services/ekyc'
import Image from 'next/image'
import { useRouter } from 'next/router'


interface Props {

}

interface filterObject {
	include?: string;
	id?: string | string[] | undefined;
}

// interface updateRiderStatus {
// 	id?: string;
// 	status?: string;
// 	ekyc_status?: string;
// }


export default function view({ }: Props): ReactElement {
	const router = useRouter()
	const { id } = router.query
	let [_isLoading, setIsLoading] = useState(true);
	let [riderDetail, setRiderDetail] = useState({});
	let [disableRejectReason, setDisableRejectReason] = useState(false);
	let [rejectReason, setRejectReason] = useState([] as any);
	let [rejectReasonDropDown, setRejectReasonDropDown] = useState([] as any);
	const [isShowMediaModal, setIsShowMediaModal] = useState(false)
	const [isLoadingMedia, setIsLoadingMedia] = useState(false)
	const [imgUrl, setImgUrl] = useState('')

	useEffect(() => {
		if (id) {
			fetchData()
		}
	}, [id])

	const fetchData = async () => {
		const request = {
			include: "pdpa",
			id: id,
		}
		setIsLoading(true);
		const { result, success } = await getRiderDetail(request);
		let riderID, RiderDetail: any
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
				data.nation_photo = ""
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
				data.car = _.get(data.pdpa.car_info[0], 'brand_name', ''); + "/" + _.get(data.pdpa.car_info[0], 'model_name', '');
				data.nation_photo = (_.get(data.pdpa, 'nation_photo', '').indexOf("http") !== -1) ? _.get(data.pdpa, 'nation_photo', '') : ""
				data.car_photo = (_.get(data.pdpa.car_info[0], 'photo', '').indexOf("http") !== -1) ? _.get(data.pdpa.car_info[0], 'photo', '') : ""
				data.car_tax_photo = (_.get(data.pdpa.car_info[0], 'tax_photo', '').indexOf("http") !== -1) ? _.get(data.pdpa.car_info[0], 'tax_photo', '') : ""
				data.disable_photo = (_.get(data.pdpa.disable_person[0], 'photo', '').indexOf("http") !== -1) ? _.get(data.pdpa.disable_person[0], 'photo', '') : ""
			}
			RiderDetail = data
			if (data.status == "waiting" || data.status == "uploaded" || data.status == "approved") {
				setDisableRejectReason(true)
			} else {
				const reqStatusHistories = {
					rider_id: riderID,
					status: ["re-approved", "rejected"],
					type: ["rider", "ekyc"],
					per_page: 1
				}

				const statusHistories = await getStatusHistories(reqStatusHistories);
				if (statusHistories.result.data !== undefined) {
					statusHistories.result.data[0].topic.forEach(element => {
						RiderDetail.reason.push(element.id)
					});
				}
			}

			let rejectReason = await getRejectReson();
			rejectReason = rejectReason.result.data
			for (let index = 0; index < rejectReason.length; index++) {
				rejectReason[index].name = rejectReason[index].title
				rejectReason[index].value = rejectReason[index].id
			}
			setRejectReason(rejectReason)
			let reject_reason = _.filter(rejectReason, function (o) { return o.type == rider_status; });
			setRejectReasonDropDown(reject_reason)
			setRiderDetail(RiderDetail)
			setIsLoading(false);
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
		if (data.status == "uploaded") {
			notification.error({
				message: `กรุณาทำการอนุมัติ ekyc`,
				description: "",
			});
		} else {
			const topic = values.reason.map((n: any) => {
				const reason = _.find(rejectReason, function (o) { return o.id == n; })
				const topic = {
					id: reason.id,
					code: reason.code,
					title: reason.title,
					status: true,
				}
				return topic
			});

			let reqBody = {
				data: {
					"id": riderDetail.id,
					"status": riderDetail.status,
					"ekyc_status": data.status,
					"topic": topic
				}
			}

			const RiderStatus = await updateRiderStatus(reqBody);
			if (RiderStatus.result.message == "success") {
				notification.success({
					message: `ดำเนินการอัพเดตสถานะสำเร็จ`,
					description: "",
				});
			} else {
				notification.success({
					message: `ผิดพลาด`,
					description: "ไม่สามารถอัพเดตสถานะไรเดอร์ได้",
				});
			}
		}
	}

	const handleStatus = (event: any) => {
		if (event == "approved" || event == "uploaded") {
			setDisableRejectReason(true)
		} else if (event == "rejected") {
			setRejectReasonDropDown(_.filter(rejectReason, function (o) { return o.type == "rejected"; }))
			setDisableRejectReason(false)
		} else {
			setRejectReasonDropDown(_.filter(rejectReason, function (o) { return o.type == "re-approved"; }))
			setDisableRejectReason(false)
		}

		setRiderDetail({ ...riderDetail, status: event, reason: [] })
		console.log(event);
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
												disabled={isUndefined(values.nation_photo) || values.nation_photo == ""}
												onClick={() => {
													if (!isUndefined(values.nation_photo)) {
														onClickViewMedia('image', values.nation_photo)
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
												disabled={isUndefined(values.disable_photo) || values.car_tax_photo == ""}
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
						{riderDetail.status !== "waiting" &&
							<>
								<Row gutter={10}>
									<Col className="gutter-row" span={6}>
										<Field
											label={{ text: "การอนุมัติ" }}
											name="status"
											component={Select}
											placeholder="เลือก"
											onChange={handleStatus}
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
											name="reason"
											allowClear={true}
											component={Select}
											disabled={disableRejectReason}
											id="reason"
											placeholder="เลือก"
											selectOption={rejectReasonDropDown}
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
								</div>
							</>
						}
					</Form>
				)}
			</Formik>
		</MainLayout>
	) : (<div></div>)
}
