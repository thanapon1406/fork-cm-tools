import React, { ReactElement, useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { Row, Col } from "antd";
import * as Yup from "yup";

import MainLayout from "@/layout/MainLayout";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Input from "@/components/Form/Input";
import Select from "@/components/Form/Select";
import DateRangePicker from "@/components/Form/DateRangePicker";
import Table from "@/components/Table";

interface Props { }

export default function Rider({ }: Props): ReactElement {
  const initialValues = {
    keyword: "",
    verify: "",
    verifyRider: "",
    ekycRider: "",
    registerDate: {
      start: "",
      end: "",
    },
    updateDate: {
      start: "",
      end: "",
    },
  }
  const Schema = Yup.object().shape({
  });
  let [mockData, setMockData] = useState([]);
  let [isLoading, setIsLoading] = useState(true);

  const handleSubmit = (values: any) => {
    console.log("values : ", values)
    setIsLoading(true);
  }

  const mapStatus = (status:any, ekyc:any) => {
    let result = "-"
    if(status == "uploaded" || ekyc =="uploaded"){
      result = "รอการตรวจสอบ"
    }else if(status == "re-approved" || ekyc =="re-approved"){
      result = "ขอเอกสารเพิ่มเติม"
    }else if(status == "rejected" || ekyc =="rejected"){
      result = "ไม่อนุมัติ"
    }else if(status == "approved" || ekyc =="approved"){
      result = "อนุมัติ"
    }
    return result
  }
  const genData = (value: number) => {
    let tempData: any = [];
    tempData.push({
      first_name: "abc",
      last_name: "นามสกุลใคร",
      pdpa: {
        nation_id: "1103701092603"
      },
      phone: "87-3612521",
      status: "uploaded",
      ekyc_status: "uploaded",
      created_at: "2021-09-08T06:10:13Z",
      updated_at: "2021-09-23T04:13:47Z"
    },
    {
      first_name: "abc",
      last_name: "นามสกุลใคร",
      pdpa: {
        nation_id: "1103701092603"
      },
      phone: "87-3612521",
      status: "uploaded",
      ekyc_status: "approved",
      created_at: "2021-09-08T06:10:13Z",
      updated_at: "2021-09-23T04:13:47Z"
    },
    {
      first_name: "abc",
      last_name: "นามสกุลใคร",
      pdpa: {
        nation_id: "1103701092603"
      },
      phone: "87-3612521",
      status: "approved",
      ekyc_status: "uploaded",
      created_at: "2021-09-08T06:10:13Z",
      updated_at: "2021-09-23T04:13:47Z"
    },
    {
      first_name: "abc",
      last_name: "นามสกุลใคร",
      pdpa: {
        nation_id: "1103701092603"
      },
      phone: "87-3612521",
      status: "approved",
      ekyc_status: "approved",
      created_at: "2021-09-08T06:10:13Z",
      updated_at: "2021-09-23T04:13:47Z"
    },
    {
      first_name: "abc",
      last_name: "นามสกุลใคร",
      pdpa: {
        nation_id: "1103701092603"
      },
      phone: "87-3612521",
      status: "re-approved",
      ekyc_status: "re-approved",
      created_at: "2021-09-08T06:10:13Z",
      updated_at: "2021-09-23T04:13:47Z"
    },
    {
      first_name: "abc",
      last_name: "นามสกุลใคร",
      pdpa: {
        nation_id: "1103701092603"
      },
      phone: "87-3612521",
      status: "re-approved",
      ekyc_status: "uploaded",
      created_at: "2021-09-08T06:10:13Z",
      updated_at: "2021-09-23T04:13:47Z"
    },
    {
      first_name: "abc",
      last_name: "นามสกุลใคร",
      pdpa: {
        nation_id: "1103701092603"
      },
      phone: "87-3612521",
      status: "rejected",
      ekyc_status: "rejected",
      created_at: "2021-09-08T06:10:13Z",
      updated_at: "2021-09-23T04:13:47Z"
    },
    {
      first_name: "abc",
      last_name: "นามสกุลใคร",
      pdpa: {
        nation_id: "1103701092603"
      },
      phone: "87-3612521",
      status: "re-approved",
      ekyc_status: "approved",
      created_at: "2021-09-08T06:10:13Z",
      updated_at: "2021-09-23T04:13:47Z"
    },
    {
      first_name: "abc",
      last_name: "นามสกุลใคร",
      pdpa: {
        nation_id: "1103701092603"
      },
      phone: "87-3612521",
      status: "rejected",
      ekyc_status: "approved",
      created_at: "2021-09-08T06:10:13Z",
      updated_at: "2021-09-23T04:13:47Z"
    })
    setTimeout(() => {
      setMockData(tempData);
      setIsLoading(false);
    }, 4000);
  }
  useEffect(() => {
    genData(40)
  }, [])

  const column = [
    {
      title: "ชื่อและนามสกุล",
      dataIndex: "first_name",
      render: (text: any, record: any) => {
        let fullName = record.first_name + ' ' + record.last_name
        return (fullName)
      },
      align: "center"
    },
    {
      title: "เลขบบัตรประชาชน",
      dataIndex: "nationId",
      render: (text: any, record: any) => {
        console.log("record : ", record)
        let nationId = record.pdpa && record.pdpa.nation_id ? record.pdpa.nation_id : "-"
        return nationId
      },
      align: "center"
    },
    {
      title: "เบอร์โทรศัพท์",
      dataIndex: "phoneNumber",
      render: (text: any, record: any) => {
        console.log("record : ", record)
        let phone = record.phone ? record.phone.slice(0,7) + "xxx" : "-"
        return phone
      },
      align: "center"
    },
    {
      title: "ข้อมูลลงทะเบียน",
      dataIndex: "status",
      render: (row: any) => {
        const nameMapping: any = {
          uploaded: "uploaded",
          're-approved': "re-approved",
          approved: "approved",
          rejected: "reject",
        };
        return nameMapping[row];
      },
      align: "center"
    },
    {
      title: "e-kyc",
      dataIndex: "ekyc_status",
      render: (row: any) => {
        const nameMapping: any = {
          uploaded: "uploaded",
          're-approved': "re-approved",
          approved: "approved",
          rejected: "reject",
        };
        return nameMapping[row];
      },
      align: "center"
    },
    {
      title: "สถาณะการตรวจสอบ",
      dataIndex: "verify",
      className: "column-typverifye",
      align: "center",
      render: (text: any, record: any) => {
        console.log("record : ", record)
        let verify = mapStatus(record.status, record.ekyc_status)
        // let phone = record.phone ? record.phone.slice(0,7) + "xxx" : "-"
        return verify
      },
    },
    {
      title: "วันและเวลาที่ลงทะเบียน",
      dataIndex: "created_at",
      align: "center"
    },
    {
      title: "วันที่อัพเดตข้อมูล",
      dataIndex: "updated_at",
      align: "center"
    },
    // {
    //   title: "จัดการ",
    //   dataIndex: "button",
    //   align:"center"
    // },
  ];

  return (
    <MainLayout>
      <Card>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={Schema}
        >
          {(values) => (
            <Form>
              <Row gutter={16} >
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: "ค้นหา" }}
                    name="keyword"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="keyword"
                    placeholder="ค้นหา"
                    isRange={true}
                  />
                  <div className="ant-form ant-form-vertical">
                    <Button
                      style={{ width: "120px", marginTop: "31px" }}
                      type="primary"
                      size="middle"
                      htmlType="submit"
                    >
                      ค้นหา
                    </Button>
                  </div>
                </Col>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: "สถานะการตรวจสอบ" }}
                    name="verify"
                    component={Select}
                    id="verify"
                    placeholder="สถานะการตรวจสอบ"
                    selectOption={[
                      {
                        name: "ทุกสถานะ",
                        value: "all",
                      },
                      {
                        name: "รอการตรวจสอบ",
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
                  <Field
                    label={{ text: "ข้อมูลลงทะเบียน" }}
                    name="verifyRider"
                    component={Select}
                    id="verifyRider"
                    placeholder="ข้อมูลลงทะเบียน"
                    selectOption={[
                      {
                        name: "ทุกสถานะ",
                        value: "all",
                      },
                      {
                        name: "uploaded",
                        value: "uploaded",
                      },
                      {
                        name: "approved",
                        value: "approved",
                      },
                      {
                        name: "re-approve",
                        value: "re-approved",
                      },
                      {
                        name: "reject",
                        value: "rejected",
                      },
                    ]}
                  />
                </Col>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: "วันเวลาที่ลงทะเบียน" }}
                    name="registerDate"
                    component={DateRangePicker}
                    id="registerDate"
                    placeholder="registerDate"
                  />
                  <Field
                    label={{ text: "e-kyc" }}
                    name="ekycRider"
                    component={Select}
                    id="ekycRider"
                    placeholder="e-kyc"
                    selectOption={[
                      {
                        name: "ทุกสถานะ",
                        value: "all",
                      },
                      {
                        name: "uploaded",
                        value: "uploaded",
                      },
                      {
                        name: "approved",
                        value: "approved",
                      },
                      {
                        name: "re-approve",
                        value: "re-approved",
                      },
                      {
                        name: "reject",
                        value: "rejected",
                      },
                    ]}
                  />
                </Col>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: "วันเวลาที่อัพเดท" }}
                    name="updateDate"
                    component={DateRangePicker}
                    id="updateDate"
                    placeholder="updateDate"
                  />
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
      </Card>
      <Card>
        <Table
          config={{
            dataTableTitle: "รายการรอตรวจสอบ",
            loading: isLoading,
            tableName: "rider",
            tableColumns: column,
            action: ["view"],
            dataSource: mockData
          }}
        />
      </Card>
    </MainLayout>
  )
}