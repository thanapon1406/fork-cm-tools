import Button from "@/components/Button";
import Card from "@/components/Card";
import Input from "@/components/Form/Input";
import Table from '@/components/Table';
import useFetchTable from '@/hooks/useFetchTable';
import MainLayout from "@/layout/MainLayout";
import { downloadImage } from '@/services/cdn';
import { outletList } from '@/services/merchant';
import { GetSocialLinkProvider } from '@/services/sso';
import { getUser } from '@/services/staff';
import { Breadcrumb, Col, Modal, Row, Typography } from "antd";
import { Field, Form, Formik } from "formik";
import _, { map } from 'lodash';
import moment from 'moment';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { ReactElement, useEffect, useState } from "react";
import facebookLogo from '../../../../public/asset/icon/facebook.png';
import googleLogo from '../../../../public/asset/icon/google.png';
import lineLogo from '../../../../public/asset/icon/line.png';
import CustomBadge from './style';

const { Title, Text } = Typography;



interface Props {

}

interface queryList {
  id?: string | string[] | undefined
}

interface filterObject {
  ids: number[]
}

interface staffDetail {
  id?: string;
  sso_id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
}

export default function StaffDetail({ }: Props): ReactElement {
  const router = useRouter()
  const { id } = router.query
  let [_isLoading, setIsLoading] = useState(true);
  let [staffDetail, setStaffDetail] = useState<staffDetail>({
    sso_id: ""
  });
  const [isShowMediaModal, setIsShowMediaModal] = useState(false)
  const [isActive, setActive] = useState(false)
  const [isBan, setIsBan] = useState(false)
  const [isLoadingMedia, setIsLoadingMedia] = useState(false)
  const [imgUrl, setImgUrl] = useState('')
  const column = [{
    title: 'แบรนด์',
    dataIndex: 'brand_name',
    align: 'center',
    render: (row: any) => {
      return row['th']
    },
  },
  {
    title: 'สาขา',
    dataIndex: 'name',
    align: 'center',
    render: (row: any) => {
      return row['th']
    },

  }, {
    title: 'วันที่ลงทะเบียน Merchant App',
    dataIndex: 'mapping_sso_at',
    align: 'center',
    render: (row: any) => {
      return row ? moment(row).format('YYYY-MM-DD HH:mm') : '-'
    },
  }]
  let [userInitialValues, setUserInitialValues] = useState({
    social: [],
  })
  const requestApi: Function = outletList
  const { isLoading, dataTable, handelDataTableChange, handleFetchData, pagination } =
    useFetchTable(requestApi, {}, { isAutoFetch: false })

  useEffect(() => {
    if (id) {
      fetchData()
    }
  }, [id])
  const renderSocialLink = (socialList: any) => {
    return socialList.map((val: string) => {
      let logImg = googleLogo
      switch (val) {
        case 'google':
          logImg = googleLogo
          break
        case 'facebook':
          logImg = facebookLogo
          break
        case 'line':
          logImg = lineLogo
          break
      }
      return (
        <span key={val} style={{ marginRight: '10px' }}>
          <Image src={logImg} width={30} height={30} />
        </span>
      )
    })
  }
  const fetchData = async () => {
    const request: queryList = {
      id: id,
    }
    setIsLoading(true);
    const { result, success } = await getUser(request);
    let StaffDetail: staffDetail
    let staffID: any
    if (success) {
      const { data } = result;
      staffID = data.id
      data.name = data.firstname + " " + data.lastname
      data.created_at_format = moment(data.created_at).format('YYYY-MM-DD HH:mm')

      var status: boolean = false
      if (data.user_status === 'active') {
        status = true
      }
      console.log('sso: ', data.sso_id)
      let social: any = []
      if (data.sso_id) {
        const socialReq = {
          uid: data.sso_id,
          project_id: '1',
        }
        const { result: ssoResult, success: ssoSuccess } = await GetSocialLinkProvider(socialReq)
        if (ssoSuccess) {
          const { data } = ssoResult
          social = map(data, (val) => {
            return val['provider'] || '-'
          })
        }
      }
      let permissionsOutlets = _.get(data, 'permissions_outlet', [])
      if (permissionsOutlets.length > 0) {
        let reqFilter: filterObject = {
          ids: permissionsOutlets
        }
        handleFetchData(reqFilter)
      }

      setUserInitialValues({
        social: social,
      })
      setActive(status)
      setIsBan(data.is_ban)
      StaffDetail = data
      setStaffDetail(StaffDetail)
      setIsLoading(false);
    };

  }

  const onClickViewMedia = async (type: string, pathUrl: string) => {
    setIsLoadingMedia(true)
    const payload = {
      filepath: pathUrl,
    }

    const res = await downloadImage(payload)
    const url = URL.createObjectURL(res)
    setImgUrl(url)
    setIsLoadingMedia(false)
    setIsShowMediaModal(true)

  }

  return (
    <MainLayout>
      {!_isLoading &&
        <>
          <Title level={4}>ข้อมูลบัญชีพนักงาน</Title>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>ข้อมูลบัญชีพนักงาน</Breadcrumb.Item>
            <Breadcrumb.Item>ข้อมูลพนักงาน</Breadcrumb.Item>
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
            initialValues={staffDetail}
            onSubmit={() => { }}
          >

            {({ values, resetForm, setFieldValue }) => (
              <Form>
                <Card>
                  <Row gutter={16} >
                    <Col span={8} style={{ paddingLeft: 0 }}>
                      <h4 className="ant-typography">ข้อมูลส่วนบุคคล</h4>
                    </Col>
                    <Col span={16} style={{ textAlign: 'right' }}>
                      {(!isBan) ?
                        <span >สถานะพนักงาน: <CustomBadge status="success" text="Active" /></span> :
                        <span >สถานะพนักงาน: <CustomBadge status="error" text="Inactive" /></span>}
                      &emsp;
                      {(isActive) ?
                        <span >สถานะ CMS: <CustomBadge status="success" text="Active" /></span> :
                        <span >สถานะ CMS: <CustomBadge status="error" text="Inactive" /></span>}
                    </Col>
                  </Row>
                  <Row gutter={10} >
                    <Col className="gutter-row" span={6}>
                      <Field
                        label={{ text: "รหัสพนักงาน" }}
                        name="id"
                        type="text"
                        component={Input}
                        className="form-control round"
                        placeholder="รหัสพนักงาน"
                        isRange={true}
                        disabled={true}
                      />
                    </Col>
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
                        label={{ text: "เบอร์โทรศัพท์" }}
                        name="tel"
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
                        label={{ text: "สิทธิ์การใช้งาน" }}
                        name="user_type"
                        type="text"
                        component={Input}
                        className="form-control round"
                        placeholder="สิทธิ์การใช้งาน"
                        isRange={true}
                        disabled={true}
                      />
                    </Col>
                    <Col className="gutter-row" span={6}>
                      <Field
                        label={{ text: "วันที่สร้างพนักงาน" }}
                        name="created_at_format"
                        type="text"
                        component={Input}
                        className="form-control round"
                        placeholder="วันที่สร้างพนักงาน"
                        isRange={true}
                        disabled={true}
                      />
                    </Col>
                  </Row>
                  <div>
                    <Text strong>Social Login</Text>
                  </div>
                  <br />
                  {renderSocialLink(userInitialValues.social)}

                </Card>
                <Card>
                  <Table
                    config={{
                      dataTableTitle: 'แบรนด์และสาขา',
                      loading: isLoading,
                      tableName: 'merchant',
                      tableColumns: column,
                      dataSource: dataTable,
                      handelDataTableLoad: handelDataTableChange,
                      pagination: pagination,
                    }}
                  />
                </Card>
              </Form>
            )}
          </Formik>
        </>
      }
    </MainLayout>
  )
}
