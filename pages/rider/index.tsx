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

import { getRider } from '@/services/rider'
import lodash from "lodash";

interface Props { }
interface SearchValue {
  keyword: string,
  approve_status: string,
  status: string,
  ekyc_status: string,
  created_at: object,
  updated_at: object,
}

const StatusConstants = {
  UPLOADED: {
    TH: "รอตรวจสอบ",
    EN: "uploaded"
  },
  APPROVED: {
    TH: "อนุมัติ",
    EN: "approved",
  },
  REJECTED: {
    TH: "ไม่ผ่าน",
    EN: "rejected",
  },
  RE_APPROVED: {
    TH: "ขอเอกสารเพิ่ม",
    EN: "re-approved",
  }
}
export default function Rider({ }: Props): ReactElement {
  const initialValues = {
    keyword: "",
    verify: "all",
    verifyRider: "all",
    ekycRider: "all",
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
  let [pagination, setPagination] = useState({current: 1, pageSize: 10, total: 0});
  let [isLoading, setIsLoading] = useState(true);

  const handleSubmit = (values: any) => {
    const filter = {
      keyword: values.keyword,
      approve_status: values.verify,
      status: values.verifyRider,
      ekyc_status: values.ekycRider,
      created_at: values.registerDate.start && values.registerDate.end != "" ? values.registerDate : {},
      updated_at: values.updateDate.start && values.updateDate.end != "" ? values.updateDate: {} ,
    }
    
    setIsLoading(true);
    genData(filter)
  }

  const mapStatus = (status: any, ekyc: any) => {
    let result = "-"
    if (status == StatusConstants.UPLOADED.EN || ekyc == StatusConstants.UPLOADED.EN) {
      result = StatusConstants.UPLOADED.TH
    } else if (status == StatusConstants.RE_APPROVED.EN || ekyc == StatusConstants.RE_APPROVED.EN) {
      result = StatusConstants.RE_APPROVED.TH
    } else if (status == StatusConstants.REJECTED.EN || ekyc == StatusConstants.REJECTED.EN) {
      result = StatusConstants.REJECTED.TH
    } else if (status == StatusConstants.APPROVED.EN || ekyc == StatusConstants.APPROVED.EN) {
      result = StatusConstants.APPROVED.TH
    }
    return result
  }
  const genData = async (value?: SearchValue) => {
    // let tempData: any = [];
    const tempData = await getRider(value)
    if (tempData.status) {
      console.log('abcd : ',lodash.get(tempData, 'data.meta'))
      setMockData(lodash.get(tempData, 'data.data'));
      setPagination({...pagination, total:lodash.get(tempData, 'data.meta.total_count') })
      setIsLoading(false);
    }
  }
  const handelDataTableLoad = (pagination?:any, filters?:any, sorter?:any) =>{
    console.log("handelDataTableLoad : ", JSON.stringify(pagination,filters,sorter))
  }
  useEffect(() => {
    genData()
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
      title: "เบอร์โทรศัพท์",
      dataIndex: "phoneNumber",
      render: (text: any, record: any) => {
        
        let phone = "-" //record.phone ? record.phone.slice(0, 7) + "xxx" : "-"
        let countryCode
        if (record.phone) {
          phone = record.country_code+'-'+record.phone.replace('-','').slice(2, 7)+"000"

        }
        return phone
      },
      align: "center"
    },
    {
      title: "ข้อมูลลงทะเบียน",
      dataIndex: "status",
      // render: (row: any) => {
      //   const nameMapping: any = {
      //     uploaded: "uploaded",
      //     're-approved': "re-approved",
      //     approved: "approved",
      //     rejected: "reject",
      //   };
      //   return nameMapping[row];
      // },
      align: "center"
    },
    {
      title: "e-kyc",
      dataIndex: "ekyc_status",
      // render: (row: any) => {
      //   const nameMapping: any = {
      //     uploaded: "uploaded",
      //     're-approved': "re-approved",
      //     approved: "approved",
      //     rejected: "reject",
      //   };
      //   return nameMapping[row];
      // },
      align: "center"
    },
    {
      title: "สถาณะการตรวจสอบ",
      dataIndex: "verify",
      className: "column-typverifye",
      align: "center",
      render: (text: any, record: any) => {
        let verify = mapStatus(record.status, record.ekyc_status)
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
    }
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
                    placeholder="ชื่อ-สกุล, เบอร์โทรศัพท์"
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
            dataSource: mockData,
            // pagination: pagination,
            // handelDataTableLoad: handelDataTableLoad()
          }}
         
          
        />
      </Card>
    </MainLayout>
  )
}