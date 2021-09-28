import React, { ReactElement, useState, useEffect } from "react";
import MainLayout from "@/layout/MainLayout";
import Button from "@/components/Button";
import Table from "@/components/Table";
import Tag from "@/components/Tag";
import Card from "@/components/Card";
import DateRangePicker from "@/components/Form/DateRangePicker";
import { Row, Col } from "antd";

import Select from "@/components/Form/Select";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Input from "@/components/Form/Input";
import { useRecoilState } from "recoil";
import { personState } from "@/store";
import { uniqueId } from "@/utils/helpers";

interface Props {}

export default function Merchant({}: Props): ReactElement {
  const [userObj, setUserObj] = useRecoilState(personState);
  const initialValues = {
    name: "",
    chanel: "",
    verify: "",
    registerDate: {
      start: "",
      end: "",
    },
    updateDate: {
      start: "",
      end: "",
    },
  };

  let [mockData, setMockData] = useState([]);
  let [isLoading, setIsLoading] = useState(true);

  const genData = (value: number) => {
    let tempData: any = [];
    for (let i = 0; i < value; i++) {
      const name = uniqueId();
      const userData = {
        register: ["register", "E-KYC"][
          (Math.floor(Math.random() * 2) + 1) % 2
        ],
        id: uniqueId(),
        name: `${name.toLocaleLowerCase()}  ${name}`,
        phoneNumber: "081111111" + i,
        type: ["merchant", "raider", "consumer"][
          (Math.floor(Math.random() * 3) + 1) % 3
        ],
        verify: ["waiting", "document", "reject", "approve"][
          (Math.floor(Math.random() * 4) + 1) % 4
        ],
        create_at: "2021-09-01 14:08",
        update_at: "2021-09-01 14:08",
      };
      tempData.push(userData);
    }

    setTimeout(() => {
      setMockData(tempData);
      setIsLoading(false);
    }, 1300);
  };

  useEffect(() => {
    genData(40);
  }, []);

  const handleSubmit = (values: any) => {
    console.log("values", values);
    const rand = Math.floor(Math.random() * 10) + 1;
    setIsLoading(true);
    genData(rand);
  };

  const Schema = Yup.object().shape({
  });

  const column = [
    {
      title: "ประเภทการลงทะเบียน",
      dataIndex: "register",
    },
    {
      title: "ชื่อ-นามสกุล",
      dataIndex: "name",
    },
    {
      title: "เบอร์โทรศัพท์",
      dataIndex: "phoneNumber",
      align:"center"
    },
    {
      title: "ช่องทางการลงทะเบียน",
      dataIndex: "type",
      className: "column-type",
      render: (row: any) => {
        const colorMapping: any = {
          merchant: "success",
          raider: "gold",
          consumer: "blue",
        };
        return <Tag type={colorMapping[row]}>{row}</Tag>;
      },
    },
    {
      title: "สถาณะการตรวจสอบ",
      dataIndex: "verify",
      className: "column-typverifye",
      render: (row: any) => {
        const nameMapping: any = {
          waiting: "รอการตรวจสอบ",
          document: "รอเอกสารเพิ่มเติม",
          reject: "ไม่ผ่านการอนุมัติ",
          approve: "อนุมัติแล้ว",
        };
        return nameMapping[row];
      },
    },
    {
      title: "วันที่ลงทะเบียน",
      dataIndex: "create_at",
    },
    {
      title: "วันที่อัพเดตข้อมูล",
      dataIndex: "update_at",
    },
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
                      style={{ width: "120px" , marginTop: "31px"}}
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
                    name="chanel"
                    component={Select}
                    id="chanel"
                    placeholder="chanel"
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
                    name="chanel"
                    component={Select}
                    id="chanel"
                    placeholder="chanel"
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
                    name="verify"
                    component={Select}
                    id="verify"
                    placeholder="verify"
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
                    name="verify"
                    component={Input}
                    id="verify"
                    placeholder="verify"
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
            tableName: "merchant",
            tableColumns: column,
            action: ["view"],
            dataSource: mockData,
          }}
        />
      </Card>
    </MainLayout>
  );
}
