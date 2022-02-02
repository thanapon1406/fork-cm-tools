import Card from '@/components/Card'
import Input from '@/components/Form/Input'
import MainLayout from '@/layout/MainLayout'
import { getWalletBalanceSetting, saveWalletBalanceSetting } from '@/services/wallet'
import { Breadcrumb, Button, Col, notification, Row, Select, Switch, Typography } from 'antd'
import { Field, Form, Formik } from 'formik'
import _ from 'lodash'
import { useRouter } from 'next/router'
import React, { ReactElement, useEffect, useState } from 'react'
import * as Yup from 'yup'

const { Title } = Typography
interface Props { }

export default function WalletSetting({ }: Props): ReactElement {
  const Router = useRouter()
  const partner = _.get(Router, 'query.partner') ? _.get(Router, 'query.partner') : ""

  interface IQueryWalletSetting {
    partner_name: string
  }

  interface IWalletSettingDetail {
    id?: string;
    min_alert_balance?: number;
    min_alert_email?: string[];
    min_alert_status?: boolean;
    partner_name?: string;
    top_up_alert_email?: string[];
    top_up_alert_status?: boolean;
    total_balance?: number;
  }

  let [_isLoading, setIsLoading] = useState(true);
  let [walletSettingDetail, setWalletSettingDetail] = useState<IWalletSettingDetail>({
    min_alert_balance: 0,
    min_alert_email: [],
    min_alert_status: false,
    partner_name: "",
    top_up_alert_email: [],
    top_up_alert_status: false,
    total_balance: 0,
  });

  const Schema = Yup.object().shape({})

  useEffect(() => {
    if (partner) {
      fetchData()
    }
  }, [partner])

  const fetchData = async () => {
    const request: IQueryWalletSetting = {
      partner_name: partner,
    }
    setIsLoading(true);
    const { result, success } = await getWalletBalanceSetting(request);
    let WalletSettingDetail: IWalletSettingDetail
    if (success) {
      const { data } = result;
      WalletSettingDetail = {
        ...data,
        min_alert_email: (_.get(data, 'min_alert_email', false) ? _.split(data.min_alert_email, ',') : []),
        top_up_alert_email: (_.get(data, 'top_up_alert_email', false) ? _.split(data.top_up_alert_email, ',') : []),
      }
      setWalletSettingDetail(WalletSettingDetail)
      setIsLoading(false);
    } else {
      // Handle Case : Not Success
    }
  }

  const handleSubmit = async (values: IWalletSettingDetail) => {
    if (walletSettingDetail.min_alert_balance != values.min_alert_balance) {
      localStorage.removeItem("minAlertLasted")
    }
    let min_alert_email_string = ""
    let top_up_alert_email_string = ""
    let min_alert_emails = _.get(values, "min_alert_email") ? _.get(values, "min_alert_email") : []
    let top_up_alert_emails = _.get(values, "top_up_alert_email") ? _.get(values, "top_up_alert_email") : []
    //min_alert_email
    if (_.size(min_alert_emails) > 0) {
      min_alert_email_string = _.join(min_alert_emails, ",")
    }

    //top_up_alert_email
    if (_.size(top_up_alert_emails) > 0) {
      top_up_alert_email_string = _.join(top_up_alert_emails, ",")
    }
    let request = {
      data: {
        id: values.id,
        min_alert_balance: values.min_alert_balance,
        min_alert_email: min_alert_email_string,
        min_alert_status: values.min_alert_status,
        top_up_alert_email: top_up_alert_email_string,
        top_up_alert_status: values.top_up_alert_status,
      }
    }

    console.log("request", request)
    const { result, success } = await saveWalletBalanceSetting(request);
    console.log("result")
    if (success) {
      notification.success({
        message: `สำเร็จ`,
        description: "",
      });
      Router.reload()
    } else {
      // Handle Case : Not Success
      notification.success({
        message: `ไม่สำเร็จ`,
        description: "",
      });
    }
  }

  return (
    <MainLayout>
      {!_isLoading &&
        <>
          <Formik
            initialValues={walletSettingDetail}
            onSubmit={handleSubmit}
            validationSchema={Schema}>
            {({
              values,
              setFieldValue,

            }) => (
              <Form>
                <Row gutter={16}>
                  <Col className="gutter-row" span={8}>
                    <Title level={4}>กระเป๋าตังค์</Title>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                      <Breadcrumb.Item>กระเป๋าตังค์</Breadcrumb.Item>
                      <Breadcrumb.Item><a href={`/wallet/${partner}`}>{partner.toUpperCase()}</a></Breadcrumb.Item>
                      <Breadcrumb.Item>ตั้งค่ากระเป๋าตังค์</Breadcrumb.Item>
                    </Breadcrumb>
                  </Col>
                  <Col className="gutter-row" span={16} style={{ textAlign: 'right' }}>
                    <div className="ant-form ant-form-vertical">
                      <Button
                        style={{ width: '120px', marginTop: '31px', background: '#28A745', borderColor: '#28A745' }}
                        type="primary"
                        size="middle"
                        htmlType="submit"
                      >
                        บันทึก
                      </Button>
                    </div>
                  </Col>
                </Row>
                <Card>
                  <Title level={5}>ตั้งค่ากระเป๋าตังค์</Title>
                  <Row gutter={16} style={{ paddingTop: 5 }}>
                    <Col span={4}>
                      แจ้งเตือนเมื่อมียอดเงินในกระเป๋าน้อยกว่า
                    </Col>
                    <Col span={2}>
                      <Switch
                        checked={values.min_alert_status}
                        onChange={(value: any) => {
                          setFieldValue('min_alert_status', value)
                        }}
                      />
                    </Col>
                    <Col span={4}>
                      <Field
                        name="min_alert_balance"
                        type="text"
                        component={Input}
                        className="form-control"
                        id="min_alert_balance"
                        placeholder=""
                      />
                    </Col>
                    <Col style={{ marginTop: 5 }} span={1}>
                      <span>บาท</span>
                    </Col>
                  </Row>
                  <Row gutter={16} style={{ paddingTop: 5 }}>
                    <Col span={16} offset={6}>
                      <Select
                        defaultValue={walletSettingDetail.min_alert_email}
                        mode="tags"
                        style={{ width: '100%', marginBottom: 24 }}
                        onChange={(value: any) => {
                          setFieldValue('min_alert_email', value)
                        }}
                        tokenSeparators={[',']}
                        showArrow={false}
                        filterOption={false}
                        notFoundContent={null}
                        maxTagCount='responsive'
                      >
                      </Select>
                    </Col>
                  </Row>
                  <Row gutter={16} style={{ paddingTop: 5 }}>
                    <Col span={4}>
                      แจ้งเตือน<br />เมื่อมีเงินเข้ากระเป๋าตังค์
                    </Col>
                    <Col span={2}>
                      <Switch
                        checked={values.top_up_alert_status}
                        onChange={(value: any) => {
                          setFieldValue('top_up_alert_status', value)
                        }}
                      />
                    </Col>
                    <Col span={16}>
                      <Select
                        defaultValue={walletSettingDetail.top_up_alert_email}
                        mode="tags"
                        style={{ width: '100%' }}
                        onChange={(value: any) => {
                          setFieldValue('top_up_alert_email', value)
                        }}
                        tokenSeparators={[',']}
                        showArrow={false}
                        filterOption={false}
                        notFoundContent={null}
                        maxTagCount='responsive'
                      >
                      </Select>
                    </Col>
                  </Row>
                </Card>

              </Form>)}
          </Formik>
        </>}
    </MainLayout >
  );
};