import Button from "@/components/Button";
import Card from "@/components/Card";
import DateTimeRangePicker from "@/components/Form/DateTimeRangePicker";
import Input from "@/components/Form/Input";
import Select from "@/components/Form/Select";
import Table from "@/components/Table";
import MainLayout from "@/layout/MainLayout";
import { getRider } from '@/services/rider';
import { Breadcrumb, Col, Row, Typography } from "antd";
import { Field, Form, Formik } from "formik";
import Moment from 'moment';
import React, { ReactElement, useEffect, useState } from "react";
import * as Yup from "yup";

const { Title } = Typography;



interface Props { }
interface Pagination {
  total: number;
  current: number;
  pageSize: number;
}
interface SearchValue {
  keyword?: string,
  approve_status?: string,
  status?: string,
  ekyc_status?: string,
  created_at?: object,
  updated_at?: object,
}

const StatusConstants = {
  UPLOADED: {
    TH: "รอการตรวจสอบ",
    EN: "uploaded"
  },
  APPROVED: {
    TH: "อนุมัติ",
    EN: "approved",
  },
  REJECTED: {
    TH: "ไม่อนุมัติ",
    EN: "rejected",
  },
  RE_APPROVED: {
    TH: "ขอเอกสารเพิ่มเติม",
    EN: "re-approved",
  }
}
export default function Rider({ }: Props): ReactElement {
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
  const Schema = Yup.object().shape({
  });
  let [mockData, setMockData] = useState([]);
  let [pagination, setPagination] = useState<Pagination>({
    total: 0,
    current: 1,
    pageSize: 10,
  });
  let [isLoading, setIsLoading] = useState(true);
  let [filter, setFilter] = useState<SearchValue>(initialValues);

  const handleSubmit = (values: any) => {
    const filter: SearchValue = {
      keyword: values.keyword,
      approve_status: values.approve_status,
      status: values.status,
      ekyc_status: values.ekyc_status,
      created_at: values.created_at.start && values.created_at.end != "" ? values.created_at : {},
      updated_at: values.updated_at.start && values.updated_at.end != "" ? values.updated_at : {},
    }
    fetchData(filter, { current: 1, total: 0, pageSize: 10 })
  }

  const mapStatus = (status: any) => {
    let result = "-"
    if (status == StatusConstants.UPLOADED.EN) {
      result = StatusConstants.UPLOADED.TH
    } else if (status == StatusConstants.RE_APPROVED.EN) {
      result = StatusConstants.RE_APPROVED.TH
    } else if (status == StatusConstants.REJECTED.EN) {
      result = StatusConstants.REJECTED.TH
    } else if (status == StatusConstants.APPROVED.EN) {
      result = StatusConstants.APPROVED.TH
    }
    return result
  }
  const fetchData = async (filterObj: SearchValue = filter, paging: Pagination = pagination) => {
    const reqBody = {
      page: paging.current,
      per_page: paging.pageSize,
      ...filterObj,
    };
    setIsLoading(true);
    const { result, success } = await getRider(reqBody)

    if (success) {
      const { meta, data } = result;
      setMockData(data);
      setPagination({
        pageSize: paging.pageSize,
        current: meta.page,
        total: meta.total_count,
      })
      setIsLoading(false);
      setFilter(filterObj);
    }
  }
  const handelDataTableLoad = (pagination: any) => {
    fetchData(filter, pagination);
  };
  useEffect(() => {
    fetchData()
  }, [])

  const column = [
    {
      title: "ชื่อและนามสกุล",
      dataIndex: "first_name",
      render: (text: any, record: any) => {
        let fullName = record.first_name + ' ' + record.last_name
        return (fullName)
      },
    },
    {
      title: "เบอร์โทรศัพท์",
      dataIndex: "phoneNumber",
      render: (text: any, record: any) => {
        let phone = "-"
        if (record.phone) {
          phone = record.country_code + '-' + record.phone.replace('-', '').slice(2, 7) + "000"

        }
        return phone
      },
      align: "center"
    },
    {
      title: "ข้อมูลลงทะเบียน",
      dataIndex: "status",
      align: "center"
    },
    {
      title: "e-kyc",
      dataIndex: "ekyc_status",
      align: "center"
    },
    {
      title: "สถาณะการตรวจสอบ",
      dataIndex: "approve_status",
      className: "column-typverifye",
      align: "center",
      render: (text: any, record: any) => {
        let verify = mapStatus(record.approve_status)
        return verify
      },
    },
    {
      title: "วันและเวลาที่ลงทะเบียน",
      dataIndex: "created_at",
      align: "center",
      render: (row: any, record: any) => {
        return Moment(row).format("YYYY-MM-DD HH:MM");
      }
    },
    {
      title: "วันที่อัพเดตข้อมูล",
      dataIndex: "updated_at",
      align: "center",
      render: (text: any, record: any) => {
        return Moment(text).format('YYYY-MM-DD HH:MM')
      }
    }
  ];

  return (
    <MainLayout>
      <Title level={4}>อนุมัติผลการลงทะเบียนเข้าใช้งานระบบ</Title>
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>อนุมัติผลการลงทะเบียน</Breadcrumb.Item>
        <Breadcrumb.Item>ลงทะเบียนคนขับ</Breadcrumb.Item>
      </Breadcrumb>
      <Card>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={Schema}
        >
          {({ values, resetForm }) => (
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
                    <Button
                      style={{ width: "120px", marginTop: "31px", marginLeft: "10px" }}
                      type="default"
                      size="middle"
                      htmlType="reset"
                      onClick={() => resetForm()}
                    >
                      เคลียร์
                    </Button>
                  </div>
                </Col>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: "สถานะการตรวจสอบ" }}
                    name="approve_status"
                    component={Select}
                    id="approve_status"
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
                        name: "ไม่อนุมัติ",
                        value: "rejected",
                      },
                    ]}
                  />
                  <Field
                    label={{ text: "ข้อมูลลงทะเบียน" }}
                    name="status"
                    component={Select}
                    id="status"
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
                        name: "rejected",
                        value: "rejected",
                      },
                    ]}
                  />
                </Col>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: "วันเวลาที่ลงทะเบียน" }}
                    name="created_at"
                    component={DateTimeRangePicker}
                    id="created_at"
                    placeholder="registerDate"
                  />
                  <Field
                    label={{ text: "e-kyc" }}
                    name="ekyc_status"
                    component={Select}
                    id="ekyc_status"
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
                        name: "rejected",
                        value: "rejected",
                      },
                    ]}
                  />
                </Col>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: "วันเวลาที่อัพเดท" }}
                    name="updated_at"
                    component={DateTimeRangePicker}
                    id="updated_at"
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
            handelDataTableLoad: handelDataTableLoad,
            pagination: pagination,
          }}
        />
      </Card>
    </MainLayout>
  )
}