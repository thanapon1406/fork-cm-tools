import React, { ReactElement, useState, useEffect } from "react";
import MainLayout from "@/layout/MainLayout";
import Button from "@/components/Button";
import Table from "@/components/Table";
import Card from "@/components/Card";
import DateRangePicker from "@/components/Form/DateRangePicker";
import { Row, Col, Typography, Breadcrumb } from "antd";

import Select from "@/components/Form/Select";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Input from "@/components/Form/Input";
import { useRecoilState } from "recoil";
import { personState } from "@/store";
import useFetch from "@/hooks/useFetch";
const { Title } = Typography;
import { outletList } from "@/services/merchant";
import moment from "moment";
import { convertJsonToParam } from "@/utils/helpers";

interface Props {}

interface Pagination {
  total: number;
  current: number;
  pageSize: number;
}

interface filterObject {
  verify_status?: string;
  ekyc_status?: string;
  start_date_create?: string;
  end_date_create?: string;
  start_date_verify?: string;
  end_date_verify?: string;
  approve_status?: string;
  outlet_structure?: string;
  id?: string;
}

export default function Merchant({}: Props): ReactElement {
  const [userObj, setUserObj] = useRecoilState(personState);
  const initialValues = {
    name: "",
    outlet_structure: "",
    verify_status: "",
    ekyc_status: "",
    approve_status: "",
    date_create: {
      start: null,
      end: null,
    },
    date_verify: {
      start: null,
      end: null,
    },
  };

  let [dataTable, setDataTable] = useState([]);
  let [_isLoading, setIsLoading] = useState(true);
  let [pagination, setPagination] = useState<Pagination>({
    total: 0,
    current: 1,
    pageSize: 10,
  });
  let [filter, setFilter] = useState<filterObject>({
    verify_status: "",
    ekyc_status: "",
    start_date_create: "",
    end_date_create: "",
    start_date_verify: "",
    end_date_verify: "",
    approve_status: "",
    outlet_structure: "",
    id: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const Schema = Yup.object().shape({});

  const fetchData = async (
    filterObj: filterObject = filter,
    paging: Pagination = pagination
  ) => {
    const reqBody = {
      page: paging.current,
      per_page: paging.pageSize,
      ...filterObj,
    };
    console.log(`reqBody`, reqBody)
    setIsLoading(true);
    const { result, success } = await outletList(reqBody);
    if (success) {
      const { meta, data } = result;
      setPagination({
        pageSize: paging.pageSize,
        current: meta.page,
        total: meta.total_count,
      });
      setDataTable(data);
      setIsLoading(false);
      setFilter(filterObj)
    }
  };

  const handleSubmit = (values: any) => {
    console.log(`values`, values);
    let reqFilter: filterObject = {
      verify_status: values.verify_status,
      ekyc_status: values.ekyc_status,
      approve_status: values.approve_status,
      outlet_structure: values.outlet_structure,
      start_date_create: values.date_create.start || "",
      end_date_create: values.date_create.end || "",
      start_date_verify: values.date_verify.start || "",
      end_date_verify: values.date_verify.end || "",
    };
    fetchData(reqFilter);
  };

  const handelDataTableLoad = (pagination: any) => {
    console.log(`pagination`, pagination);
    fetchData(filter, pagination);
  };

  const column = [
    {
      title: "ชื่อร้านค้า",
      dataIndex: "name",
      render: (row: any) => {
        return row["th"];
      },
    },
    {
      title: "ประเภทร้านค้า",
      dataIndex: "outlet_structure",
    },
    {
      title: "ชื่อและนามสกุล",
      dataIndex: "name",
    },
    {
      title: "เบอร์โทรศัพท์",
      dataIndex: "tel",
      align: "center",
    },
    {
      title: "ข้อมูลร้านค้า",
      dataIndex: "approve_status",
      align: "center",
    },
    {
      title: "E-KYC",
      dataIndex: "ekyc_status",
      align: "center",
    },
    {
      title: "สถาณะการตรวจสอบ",
      dataIndex: "approve_status",
      className: "column-typverifye",
    },
    {
      title: "วันที่ลงทะเบียน",
      dataIndex: "created_at",
      render: (row: any) => {
        return moment(row).format("YYYY-MM-DD HH:MM");
      },
    },
    {
      title: "วันที่อัพเดตข้อมูล",
      dataIndex: "verify_date",
      render: (row: any) => {
        return moment(row).format("YYYY-MM-DD HH:MM");
      },
    },
  ];

  return (
    <MainLayout>
      <Title level={4}>อนุมัติผลการละทะเบียนเข้าใช้ระบบ</Title>
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>อนุมัติผลการละทะเบียน</Breadcrumb.Item>
        <Breadcrumb.Item>ลงทะเบียนร้านค้า</Breadcrumb.Item>
      </Breadcrumb>
      <Card>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={Schema}
        >
          {(values) => (
            <Form>
              <Row gutter={16}>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: "ค้นหา" }}
                    name="name"
                    type="text"
                    component={Input}
                    className="form-control round"
                    id="name"
                    placeholder="name"
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
                    label={{ text: "ประเภทร้านค้า" }}
                    name="outlet_structure"
                    component={Select}
                    id="outlet_structure"
                    placeholder="outlet_structure"
                    defaultValue={{ value: "all" }}
                    selectOption={[
                      {
                        name: "ประเภททั้งหมด",
                        value: "all",
                      },
                      {
                        name: "merchant",
                        value: "merchant",
                      },
                      {
                        name: "raider",
                        value: "raider",
                      },
                      {
                        name: "consumer",
                        value: "consumer",
                      },
                    ]}
                  />

                  <Field
                    label={{ text: "ข้อมูลร้านค้า" }}
                    name="verify_status"
                    component={Select}
                    id="verify_status"
                    placeholder="verify_status"
                    defaultValue={{ value: "all" }}
                    selectOption={[
                      {
                        name: "ประเภททั้งหมด",
                        value: "all",
                      },
                      {
                        name: "merchant",
                        value: "merchant",
                      },
                      {
                        name: "raider",
                        value: "raider",
                      },
                      {
                        name: "consumer",
                        value: "consumer",
                      },
                    ]}
                  />
                </Col>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: "สถานะการตรวจสอบ" }}
                    name="approve_status"
                    component={Select}
                    id="approve_status"
                    placeholder="approve_status"
                    selectOption={[
                      {
                        name: "ทุกสถานะ",
                        value: "all",
                      },
                      {
                        name: "รอการตรวจสอบ",
                        value: "waiting",
                      },
                      {
                        name: "รอเอกสารเพิ่มเติม",
                        value: "document",
                      },
                      {
                        name: "ไม่ผ่านการอนุมัติ",
                        value: "reject",
                      },
                      {
                        name: "อนุมัติแล้ว",
                        value: "approve",
                      },
                    ]}
                  />
                  <Field
                    label={{ text: "E-KYC" }}
                    name="ekyc_status"
                    component={Input}
                    id="ekyc_status"
                    placeholder="ekyc_status"
                  />
                </Col>
                <Col className="gutter-row" span={6}>
                  <Field
                    label={{ text: "วันเวลาที่ลงทะเบียน" }}
                    name="date_create"
                    component={DateRangePicker}
                    id="date_create"
                    placeholder="date_create"
                  />
                  <Field
                    label={{ text: "วันเวลาที่อัพเดท" }}
                    name="date_verify"
                    component={DateRangePicker}
                    id="date_verify"
                    placeholder="date_verify"
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
            loading: _isLoading,
            tableName: "merchant",
            tableColumns: column,
            action: ["view"],
            dataSource: dataTable,
            handelDataTableLoad: handelDataTableLoad,
            pagination: pagination,
          }}
        />
      </Card>
    </MainLayout>
  );
}
