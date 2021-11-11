import Button from '@/components/Button';
import Card from '@/components/Card';
import DateRangePicker from '@/components/Form/DateRangePicker';
import Input from '@/components/Form/Input';
import Select from '@/components/Form/Select';
import Table from '@/components/Table';
import useFetchTable from '@/hooks/useFetchTable';
import MainLayout from '@/layout/MainLayout';
import { generateRepoertWalletTransaction, getLalamoveWallet, getWalletBalanceSetting, getWalletExcel } from '@/services/wallet';
import { currencyFormat } from '@/utils/helpers';
import { WarningOutlined } from '@ant-design/icons';
import { Breadcrumb, Col, Modal, notification, Row, Typography } from 'antd';
import FileSaver from 'file-saver';
import { Field, Form, Formik } from 'formik';
import _ from 'lodash';
import moment from "moment";
import { useRouter } from 'next/router';
import React, { ReactElement, useEffect, useState } from 'react';
import * as Yup from 'yup';

const { Title } = Typography
const normal_color = "#17C2D7"
const increase_color = "#28A745"
const decrease_color = "#F82F38"

interface Props { }

interface filterObject {
  id?: string
  rider_name?: string
  type?: string
  created_at?: object
  partner_order_id?: string
  partner_name: string
}

export default function Wallet({ }: Props): ReactElement {
  const Router = useRouter()
  const partner = _.get(Router, 'query.partner') ? _.get(Router, 'query.partner') : ""
  const initialValues = {
    transaction_id: '',
    rider_name: '',
    type: '',
    created_at: {
      start: '',
      end: '',
    },
  }
  let [outletType, setOutletType] = useState<Array<any>>([
    {
      name: 'ทุกประเภท',
      value: '',
    },
  ])

  interface IQueryWalletSetting {
    partner_name: string
  }

  interface generateExcel {
    key: string
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
  let [balanceAmount, SetBalanceAmount] = useState(0)
  let [spendingLastestAmount, SetSpendingLastestAmount] = useState(0)
  let [topUpLastestAmount, SetTopUpLastestAmount] = useState(0)
  let [minimumBalanceAmount, SetMinimumBalanceAmount] = useState(0)
  let [paramExport, SetparamExport] = useState<filterObject>()


  useEffect(() => {
    if (partner) {
      fetchData()
    }
    // SetBalanceAmount(490)
    // SetSpendingLastestAmount(5000)
    // SetTopUpLastestAmount(10000)
    // SetMinimumBalanceAmount(500)
  }, [partner])

  const fetchData = async () => {
    const request: IQueryWalletSetting = {
      partner_name: partner,
    }
    setIsLoading(true);
    const { result, success } = await getWalletBalanceSetting(request);
    if (success) {
      const { data } = result;
      const balanceAmount = _.get(data, 'total_balance') ? _.get(data, 'total_balance') : 0
      const minAlertBalance = _.get(data, 'min_alert_balance') ? _.get(data, 'min_alert_balance') : 0
      const minAlertStatus = _.get(data, 'min_alert_status') ? _.get(data, 'min_alert_status') : false
      if (minAlertStatus && balanceAmount < minAlertBalance) {
        warning(minAlertBalance)
        SetMinimumBalanceAmount(minAlertBalance)
      }
      SetBalanceAmount(balanceAmount)
      setIsLoading(false);
    } else {
      // Handle Case : Not Success
      setIsLoading(false);
      notification.success({
        message: `ไม่สำเร็จ`,
        description: "",
      });
    }
  }

  const warning = (Amount: any) => {
    const CurrentDate = moment().format("YYYY-MM-DD");
    const DateLastAlert = localStorage.getItem("minAlertLasted")
    if (CurrentDate != DateLastAlert) {
      localStorage.setItem("minAlertLasted", CurrentDate)
      Modal.warning({
        title: `ยอดเงินในกระเป๋าน้อยกว่า ฿${Amount.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
        content: 'กรุณาติดต่อเจ้าหน้าที่บัญชีเพื่อทำการเติมเงิน',
      });
    }
  }

  const filterRequest: filterObject = {
    partner_name: partner
  }
  const requestApi: Function = getLalamoveWallet
  const { isLoading, dataTable, handelDataTableChange, handleFetchData, pagination } =
    useFetchTable(requestApi, filterRequest)

  const Schema = Yup.object().shape({})

  const handleSubmit = (values: typeof initialValues) => {
    let reqFilter: filterObject = {
      partner_order_id: values.transaction_id,
      rider_name: values.rider_name,
      type: values.type,
      created_at: values.created_at.start && values.created_at.end != '' ? values.created_at : {},
      partner_name: partner
    }
    SetparamExport(reqFilter)
    handleFetchData(reqFilter)
  }

  const handleGenerateExcel = async () => {
    const requestExport: filterObject = {
      ...paramExport,
      partner_name: partner
    }
    const { result, success } = await generateRepoertWalletTransaction(requestExport)
    console.log(result);
    const request: generateExcel = {
      key: result.download_key
    }
    const res = await getWalletExcel(request)
    const CurrentDate = moment().format("YYYY_MM_DD");
    const filename = `WalletTransaction_${CurrentDate}.xlsx`
    FileSaver.saveAs(res, decodeURIComponent(filename))
  }

  const column = [
    {
      title: '#',
      dataIndex: 'id',
      render: (row: string, record: number, index: number) => {
        return index + 1
      },
    },
    {
      title: 'Transaction ID',
      dataIndex: 'partner_order_id',
    },
    {
      title: 'ประเภท',
      dataIndex: 'type',
      render: (row: any) => {
        let typeText = ""
        if (row === "top-up") {
          typeText = "เติมเงิน"
        } else if (row === "increase") {
          typeText = "เงินเข้า"
        } else if (row === "decrease") {
          typeText = "เงินออก"
        }
        return typeText
      },
    },
    {
      title: 'รายละเอียด',
      dataIndex: 'type',
      render: (row: any, record: any) => {
        let typeText = ""
        if (row === "top-up") {
          typeText = "เติมเงินเข้ากระเป๋าตังค์"
        } else if (row === "increase") {
          typeText = `Refund (${record["order_no"]})`
        } else if (row === "decrease") {
          typeText = `จัดส่ง (${record["order_no"]})`
        }
        return typeText
      }
    },
    {
      title: 'ชื่อไรเดอร์',
      dataIndex: 'rider_name',
    },
    {
      title: 'จำนวนเงิน',
      dataIndex: 'amount',
      render: (row: any, record: any) => {
        let sign = ""
        let color = ""
        if (record['type'] === 'top-up' || record['type'] === 'increase') {
          sign = "+"
          color = increase_color
        } else if (record['type'] === 'decrease') {
          sign = "-"
          color = decrease_color
        }
        return <span style={{ color: color }}>{`${sign}${currencyFormat(row)}`}</span>
      },
    },
    {
      title: 'เวลา',
      dataIndex: 'created_at',
      render: (row: any) => {
        return row ? moment(row).format('YYYY-MM-DD HH:mm') : '-'
      },
    },
  ]


  return (
    <MainLayout>
      {!_isLoading &&
        <>
          <Title level={4}>กระเป๋าตังค์</Title>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>กระเป๋าตังค์</Breadcrumb.Item>
            <Breadcrumb.Item>{partner.toUpperCase()}</Breadcrumb.Item>
          </Breadcrumb>
          <Card>
            <Row gutter={16}>
              <Col span={8} style={{ paddingLeft: 0 }}>
                <h3>กระเป๋าตังค์</h3>
              </Col>
              <Col span={16} style={{ textAlign: 'right' }}>
                <Button
                  style={{ width: '120px' }}
                  type="primary"
                  size="middle"
                  onClick={() => {
                    Router.push('/wallet/[partner]/setting', `/wallet/${partner}/setting`);
                  }}
                >
                  ตั้งค่า
                </Button>
              </Col>
            </Row>
            <Row gutter={16} style={{ paddingTop: 5 }}>
              <Col span={6} style={{ paddingLeft: 0 }}>
                <p>ยอดเครดิตคงเหลือ</p>
              </Col>
              <Col span={6}>
                <span style={{ color: normal_color }}>{currencyFormat(balanceAmount)}</span>
              </Col>
              <Col span={12}>
                {balanceAmount < minimumBalanceAmount ? <><WarningOutlined /> ยอดเงินในกระเป๋าของคุณน้อยกว่า ฿{minimumBalanceAmount.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} กรุณาเติมเงินก่อนใช้งาน</> : ``}
              </Col>
            </Row>
            {/* <Row gutter={16} style={{ paddingTop: 5 }} >
              <Col span={6} style={{ paddingLeft: 0 }}>
                <p style={{ marginBottom: 0 }}>ยอดเครดิตที่ใช้ไป</p>
                <p>(1 w.ย. 64 - 30 w.ย. 64)</p>
              </Col>
              <Col span={6}>
                <span style={{ color: decrease_color }}>{`${'-'}${currencyFormat(spendingLastestAmount)}`}</span>
              </Col>
            </Row>
            <Row gutter={16} style={{ paddingTop: 5 }} >
              <Col span={6} style={{ paddingLeft: 0 }}>
                <p style={{ marginBottom: 0 }}>ยอดเติมเครดิตล่าสุด</p>
                <p>(1 w.ย. 64 - 30 w.ย. 64)</p>
              </Col>
              <Col span={6}>
                <span style={{ color: increase_color }}>{`${'+'}${currencyFormat(topUpLastestAmount)}`}</span>
              </Col>
            </Row> */}
          </Card>
          <Card>
            <Title level={5}>กรุณากรอกข้อมูลที่ต้องการค้นหา</Title>
            <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={Schema}>
              {({ values, resetForm }) => (
                <Form>
                  <Row gutter={16}>
                    <Col className="gutter-row" span={6}>
                      <Field
                        label={{ text: 'Transaction ID' }}
                        name="transaction_id"
                        type="text"
                        component={Input}
                        className="form-control round"
                        id="transactionId"
                        placeholder="Transaction ID"
                      />
                    </Col>
                    <Col className="gutter-row" span={6}>
                      <Field
                        label={{ text: 'ประเภท' }}
                        name="type"
                        component={Select}
                        id="type"
                        placeholder="ประเภท"
                        defaultValue=""
                        selectOption={[
                          {
                            name: 'ทั้งหมด',
                            value: '',
                          },
                          {
                            name: 'เติมเงิน',
                            value: 'top-up',
                          },
                          {
                            name: 'เงินเข้า',
                            value: 'increase',
                          },
                          {
                            name: 'เงินออก',
                            value: 'decrease',
                          },
                        ]}
                      />
                    </Col>
                    <Col className="gutter-row" span={6}>
                      <Field
                        label={{ text: 'ชื่อไรเดอร์' }}
                        name="rider_name"
                        type="text"
                        component={Input}
                        className="form-control round"
                        id="rider_name"
                        placeholder="ชื่อไรเดอร์"
                      />
                    </Col>
                    <Col className="gutter-row" span={6}>
                      <Field
                        label={{ text: 'วันที่' }}
                        name="created_at"
                        component={DateRangePicker}
                        id="created_at"
                        placeholder="วันที่"
                      />
                    </Col>
                    <Col className="gutter-row" span={6}></Col>
                  </Row>
                  <Row gutter={16}>
                    <Col className="gutter-row" span={6}>
                      <div className="ant-form ant-form-vertical">
                        <Button
                          style={{ width: '120px', marginTop: '31px' }}
                          type="primary"
                          size="middle"
                          htmlType="submit"
                        >
                          ค้นหา
                        </Button>
                        <Button
                          style={{ width: '120px', marginTop: '31px', marginLeft: '10px' }}
                          type="default"
                          size="middle"
                          htmlType="reset"
                          onClick={() => resetForm()}
                        >
                          เคลียร์
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Form>
              )}
            </Formik>
          </Card>
          <Card>
            <Table
              config={{
                dataTableTitle: 'รายการ',
                loading: isLoading,
                tableName: 'wallet/lalamove',
                tableColumns: column,
                dataSource: dataTable,
                handelDataTableLoad: handelDataTableChange,
                pagination: pagination,
                isExport: true,
                handelDataExport: () => {
                  handleGenerateExcel()
                }
              }}
            />
          </Card>
        </>}
    </MainLayout >
  )
}
