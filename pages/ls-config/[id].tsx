import Button from '@/components/Button'
import Card from '@/components/Card'
import DateTimeRangePicker from '@/components/Form/DateTimeRangePicker'
import Input from '@/components/Form/Input'
import Select from '@/components/Form/Select'
import LsSummaryComponent from '@/components/LsSummary'
import OutletSelecter from '@/components/OutletSelecter'
import MainLayout from '@/layout/MainLayout'
import { findLsConfig } from '@/services/ls-config'
import { getBrandListV2 } from '@/services/pos-profile'
import { CopyOutlined } from '@ant-design/icons'
import { Breadcrumb, Button as ButtonAntd, Checkbox, Col, Collapse, Divider, Form as FormAntd, Input as InputAntd, Modal, notification, Radio, Row, Tooltip, Typography } from 'antd'
import { Field, Form, Formik } from 'formik'
import _, { filter, flatMap, forEach, forOwn, get, groupBy, intersection, isEmpty, isUndefined, size } from 'lodash'
import { useRouter } from 'next/router'
import React, { ReactElement, useEffect, useState } from 'react'
import * as Yup from 'yup'
import noImage from '../../public/asset/images/no-image-available.svg'

const { warning } = Modal
const { Title } = Typography
const CUSTOMER_DISCOUNT = "customer_discount"
const CUSTOMER_PAY = "customer_pay"
const SUBSIDIZE = "subsidize"
const BAHT = "baht"
const PERCENT = "percent"
const allValue: any = []
const { Panel } = Collapse
const dateFormat = 'YYYY-MM-DDTHH:mm:ss.000Z'

interface Props { }

interface queryListDetail {
  id?: string | string[] | undefined
}

interface dateTime {
  start?: any | undefined;
  end?: any | undefined;
}

interface lsConfigDetail {
  id?: string
  name?: string;
  type?: string;
  type_name?: string;
  order_amount?: number;
  discount_type?: string;
  discount_amount?: number;
  min_distance?: number;
  max_distance?: number;
  ls_type?: string;
  ls_platform_amount?: number;
  ls_merchant_amount?: number;
  start_date?: any;
  end_date?: any;
  deep_link?: string;
  inapp_link?: string;
  image_link?: string;
  total_merchant_add?: string;
  total_merchant_join?: string;
  campaign_time?: dateTime
  brands?: any;
  ls_outlet?: any;
  is_apply_all_brand?: any;
}

export default function LsConfigDetail({ }: Props): ReactElement {
  const router = useRouter()
  const { id } = router.query
  let [_isLoading, setIsLoading] = useState(true)
  const [lsDetail, setLsDetail] = useState<lsConfigDetail>({})
  const [brandList, setBrandList] = useState([])
  const [lsSummaryElementParam, setlsSummaryElementParam] = useState({})
  const [userSelectedOutlet] = useState([])
  const [isVisibleLsSummary, setIsVisibleLsSummary] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [loadingImage, setloadingImage] = useState(false)
  const [disableSubmitButton, setDisableSubmitButton] = useState(false)

  const lsLogicsOption = [
    {
      name: "เลือก LS Logics",
      value: ""
    },
    {
      name: "กำหนดจากส่วนลดที่ลูกค้าจะได้รับ",
      value: CUSTOMER_DISCOUNT
    },
    {
      name: "กำหนดจากค่าส่งที่ลูกค้าจะต้องจ่าย",
      value: CUSTOMER_PAY
    },
    {
      name: "กำหนดจากค่าส่งที่ร้านอาหาร หรือ Platform จะออกให้",
      value: SUBSIDIZE
    }
  ]
  const amountType = [
    {
      name: "บาท",
      value: BAHT
    },
    {
      name: "เปอร์เซ็นต์",
      value: PERCENT
    }
  ]

  const Schema = Yup.object().shape({
    name: Yup.string().trim().max(255).required('ระบุชื่อ LS Configure').matches(/^[A-Za-zก-๙0-9 ]+$/, "Format ของชื่อ LS Configure ไม่ถูกต้อง"),
  })

  const fetchData = async () => {
    const request: queryListDetail = {
      id: id,
    }
    setIsLoading(true)
    const { result, success } = await findLsConfig(request)
    let LsConfigDetail: lsConfigDetail
    let lsConfigId: any
    if (success) {
      const { message, data } = result
      lsConfigId = data.id
      // console.log(data);
      LsConfigDetail = data
      const lsDetail = { ...data }

      // Type Name
      const selectedType = _.find(lsLogicsOption, { value: lsDetail["type"] })
      const typeName = _.get(selectedType, "name") ? _.get(selectedType, "name") : ""
      LsConfigDetail.type_name = typeName

      // Image Url
      if (lsDetail["image_link"]) {
        setImageUrl(lsDetail["image_link"])
      }

      // Construct Number
      LsConfigDetail.order_amount = _.get(lsDetail, "order_amount") ? _.get(lsDetail, "order_amount") : 0
      LsConfigDetail.discount_amount = _.get(lsDetail, "discount_amount") ? _.get(lsDetail, "discount_amount") : 0
      LsConfigDetail.min_distance = _.get(lsDetail, "min_distance") ? _.get(lsDetail, "min_distance") : 0
      LsConfigDetail.max_distance = _.get(lsDetail, "max_distance") ? _.get(lsDetail, "max_distance") : 0
      LsConfigDetail.ls_platform_amount = _.get(lsDetail, "ls_platform_amount") ? _.get(lsDetail, "ls_platform_amount") : 0
      LsConfigDetail.ls_merchant_amount = _.get(lsDetail, "ls_merchant_amount") ? _.get(lsDetail, "ls_merchant_amount") : 0

      // Start date and End date
      LsConfigDetail.campaign_time = {
        start: _.get(lsDetail, "start_date") ? _.get(lsDetail, "start_date") : "",
        end: _.get(lsDetail, "end_date") ? _.get(lsDetail, "end_date") : ""
      }

      // Construct Selected Brand
      let is_apply_all_brand = false
      if (_.size(lsDetail["allowed_list"]) > 0) {
        const allowedLists = lsDetail["allowed_list"]// const campaign_outlet = get(data, 'campaign_outlet', [])
        let lsOutletList: any = []
        await allowedLists.map(async (list: any) => {
          if (list["brand_id"] == 0) {
            is_apply_all_brand = true
          } else {
            const outlets = list["outlets"]
            if (_.size(outlets) > 0) {
              lsOutletList.push(...outlets)
            }
          }
        })
        if (_.size(lsOutletList) > 0) {
          const selectedBrands = await fetchBrandList(lsOutletList)
          LsConfigDetail.brands = selectedBrands
        }
      } else {
        is_apply_all_brand = true
      }
      LsConfigDetail.is_apply_all_brand = is_apply_all_brand


      setLsDetail(LsConfigDetail)
      setIsLoading(false)
    }
  }

  const fetchBrandList = async (campaign_outlet: any) => {
    const { result, success } = await getBrandListV2({})
    if (!isUndefined(result.data)) {
      const filterBrand: any = filter(result.data, (item) => {
        // if (item.outlets) {
        return item
        // }
      })
      setBrandList(filterBrand)
      //then -> set form selected brands = [{id: int, is_selected: true, type: 'all'|'specific', outlets: []}]

      let selBrands = groupBy(campaign_outlet, function (b: any) {
        return b.brand_id
      })
      let selectedBrandFieldValue: any = []
      forEach(filterBrand, (item: any, index: any) => {
        let find_selected_brand = get(selBrands, item.id)
        let is_selected = false
        let type = undefined
        let outlets: any = []
        if (find_selected_brand) {
          is_selected = true
          forOwn(find_selected_brand, (value: any, key: any) => {
            if (value.outlet_id === 0) {
              type = 'all'
              return
            } else {
              type = 'specific'
              outlets.push(value.outlet_id)
            }
          })
        }

        selectedBrandFieldValue.push({
          id: item.id,
          is_selected: is_selected,
          type: type,
          outlets: outlets,
        })
      })
      return selectedBrandFieldValue
    }
    return []
    // buildBrandData(get(response, 'data', []))
    // setBrandList(get(response, 'data', []))
  }

  const filterOutletSelected = (outletSelected: any, outletList: any, brandId: any) => {
    let outlet = allValue[brandId]
    let selected = outletSelected.map((v: any) => v * 1)
    return intersection(selected, outlet)
  }

  const getBrand = async () => {
    const { result, success } = await getBrandListV2({})
    if (success) {
      const filterBrand: any = filter(result.data, (item) => {
        return item
      })
      setBrandList(filterBrand)
    }
    setIsLoading(false)
  }

  const handleGetOutletLocations = async (ls_outlets: any, is_apply_all_brand: any) => {
    let provinceIds: any = []
    let districtIds: any = []
    let subDistrictIds: any = []
    let totalMerchantAdd = 0
    if (is_apply_all_brand) {
      if (_.size(brandList) > 0) {
        brandList.map((brand: any) => {
          let outlets = _.get(brand, "outlets") ? _.get(brand, "outlets") : []
          if (_.size(outlets) > 0) {
            outlets.map((outlet: any) => {
              const provinceId = _.get(outlet, "province_id") ? _.get(outlet, "province_id") : ""
              const districtId = _.get(outlet, "district_id") ? _.get(outlet, "district_id") : ""
              const subDistrictId = _.get(outlet, "sub_district_id") ? _.get(outlet, "sub_district_id") : ""
              if (provinceId) provinceIds.push(provinceId)
              if (districtId) districtIds.push(districtId)
              if (subDistrictId) subDistrictIds.push(subDistrictId)
              totalMerchantAdd += 1
            })
          }
        })
      }
    } else {
      if (_.size(ls_outlets) > 0) {
        ls_outlets.map((brand: any) => {
          const brandId = _.get(brand, "brand_id") ? _.get(brand, "brand_id") : ""
          if (brandId) {
            let brandDetail = _.find(brandList, { id: brandId })
            let outlets = _.get(brandDetail, "outlets") ? _.get(brandDetail, "outlets") : []
            const outletIds = _.get(brand, "outlet_ids") ? _.get(brand, "outlet_ids") : []
            if (_.size(outletIds) > 0) {
              outletIds.map((outletId: any) => {
                if (outletId == 0) {
                  if (_.size(outlets) > 0) {
                    outlets.map((outlet: any) => {
                      const provinceId = _.get(outlet, "province_id") ? _.get(outlet, "province_id") : ""
                      const districtId = _.get(outlet, "district_id") ? _.get(outlet, "district_id") : ""
                      const subDistrictId = _.get(outlet, "sub_district_id") ? _.get(outlet, "sub_district_id") : ""
                      if (provinceId) provinceIds.push(provinceId)
                      if (districtId) districtIds.push(districtId)
                      if (subDistrictId) subDistrictIds.push(subDistrictId)
                      totalMerchantAdd += 1
                    })
                  }
                } else {
                  let outletDetail = _.find(outlets, { id: outletId })
                  const provinceId = _.get(outletDetail, "province_id") ? _.get(outletDetail, "province_id") : ""
                  const districtId = _.get(outletDetail, "district_id") ? _.get(outletDetail, "district_id") : ""
                  const subDistrictId = _.get(outletDetail, "sub_district_id") ? _.get(outletDetail, "sub_district_id") : ""
                  if (provinceId) provinceIds.push(provinceId)
                  if (districtId) districtIds.push(districtId)
                  if (subDistrictId) subDistrictIds.push(subDistrictId)
                  totalMerchantAdd += 1
                }
              })
            }
          }
        })
      }
    }
    let outletLocations = {
      province_ids: _.uniq(provinceIds),
      district_ids: _.uniq(districtIds),
      sub_district_ids: _.uniq(subDistrictIds),
      total_merchant_add: totalMerchantAdd
    }
    return outletLocations
  }

  const buildOutletInitValue = (userSelectedOutlet: any) => {
    let result: any = {}
    userSelectedOutlet.forEach((selectOutlet: any) => {
      let arr: any = []
      flatMap(allValue, (val: any, key: any) => {
        if (!isEmpty(val)) {
          if (val.includes(selectOutlet)) {
            if (isEmpty(result[key])) {
              arr.push(selectOutlet)
              result[key] = arr
            } else {
              arr = result[key]
              arr.push(selectOutlet)
              result[key] = arr
            }
          }
        }
      })
    })
    return result
  }


  const handleSubmit = async (values: any) => {
    console.log("update ls config: ", values)
  }

  useEffect(() => {
    if (id) {
      fetchData()
      getBrand()
    }
  }, [id])


  const renderLogicInfo = (values: any, setFieldValue: any) => {
    return (<div key="logic_info">
      {/* Name */}
      < Row gutter={16} >
        <Col className="gutter-row" span={24}>
          <Field
            label={{ text: "LS Configure Name" }}
            name="name"
            type="text"
            component={Input}
            className="form-control"
            id="name"
            placeholder="LS Configure Name"
          />
        </Col>
      </Row >
      {/* Type */}
      < Row gutter={16} >
        <Col className="gutter-row" span={12}>
          <Field
            label={{ text: "LS Logics" }}
            name="type"
            component={Select}
            id="type"
            placeholder="LS Logics"
            selectOption={lsLogicsOption}
            onChange={(value: any) => {
              setFieldValue("type", value)

              // Type name
              const selectedType = _.find(lsLogicsOption, { value: value })
              const typeName = _.get(selectedType, "name") ? _.get(selectedType, "name") : ""
              setFieldValue("type_name", typeName)

              if (value == CUSTOMER_PAY) {
                setFieldValue("ls_type", PERCENT)
              }
            }}
            disabled
          />
        </Col>
      </Row >
      <Divider style={{
        marginTop: '5px',
        marginBottom: '20px'
      }} />
    </div>)
  }

  const renderLogicSetup = (values: any, setFieldValue: any) => {
    let logicSetupElements = []

    // Header
    logicSetupElements.push(
      <div key="logic_setup_header">
        <Row gutter={24}>
          <Col className="gutter-row" span={24}>
            <Title level={4}>Logic Setup</Title>
          </Col>
        </Row>
        <Row gutter={24}>
          < Col className="gutter-row" span={12} >
            <Field
              name="type_name"
              type="text"
              component={Input}
              className="form-control"
              id="type_name"
              disabled
            />
          </Col >
        </Row>
      </div>
    )

    const logicType = _.get(values, "type") ? _.get(values, "type") : ""
    if (logicType) {
      // Logic Setup
      let logicSetup = <div key="logic_setup_UNSELECTED"></div>
      switch (logicType) {
        case CUSTOMER_DISCOUNT:
          logicSetup = <div key="logic_setup_CUSTOMER_DISCOUNT">
            {/* Row#1 */}
            <Row gutter={{
              xs: 24,
              sm: 24,
              md: 12,
              lg: 12
            }}>
              <Col className="gutter-row" xs={24} sm={13} md={10} lg={4} style={{ marginTop: "5px", marginBottom: "10px" }}>
                ลูกค้าสั่งออเดอร์ยอดสุทธิตั้งแต่
              </Col>
              <Col className="gutter-row" xs={12} sm={5} md={4} lg={2}>
                <Field
                  name="order_amount"
                  type="number"
                  component={Input}
                  className="form-control round"
                  id="order_amount"
                  disabled
                />
              </Col>
              <Col className="gutter-row" xs={12} sm={6} md={6} lg={2} style={{ marginTop: "5px", marginBottom: "10px" }}>
                บาท ขึ้นไป
              </Col>
            </Row>
            {/* Row#2 */}
            <Row gutter={{
              xs: 24,
              sm: 24,
              md: 12,
              lg: 12
            }}>
              <Col className="gutter-row" xs={24} sm={5} md={4} lg={2} style={{ marginTop: "5px", marginBottom: "10px" }}>
                ส่วนลดค่าจัดส่ง
              </Col>
              <Col className="gutter-row" xs={12} sm={5} md={4} lg={2}>
                <Field
                  name="discount_amount"
                  type="number"
                  component={Input}
                  className="form-control"
                  id="discount_amount"
                  disabled
                />
              </Col>
              <Col className="gutter-row" xs={12} sm={6} md={5} lg={3}>
                <Field
                  name="discount_type"
                  component={Select}
                  id="discount_type"
                  defaultValue={{ value: BAHT }}
                  selectOption={amountType}
                  disabled
                />
              </Col>
            </Row>
            {/* Row#3 */}
            <Row gutter={{
              xs: 24,
              sm: 24,
              md: 12,
              lg: 12
            }}>
              <Col className="gutter-row" xs={24} sm={5} md={4} lg={2} style={{ marginTop: "5px", marginBottom: "10px" }}>
                ระยะทางจัดส่ง
              </Col>
              <Col className="gutter-row" xs={12} sm={5} md={4} lg={2} style={{}}>
                <Field
                  name="min_distance"
                  type="number"
                  component={Input}
                  className="form-control"
                  id="min_distance"
                  disabled
                />
              </Col>
              <Col className="gutter-row" xs={12} sm={1} md={1} lg={1} style={{ marginTop: "5px", marginBottom: "10px" }}>
                กม.
              </Col>
              <Col className="gutter-row" xs={1} sm={1} md={1} lg={1} style={{ marginTop: "5px", marginBottom: "10px", textAlign: "right" }}>
                ถึง
              </Col>
              <Col className="gutter-row" xs={12} sm={5} md={4} lg={2}>
                <Field
                  name="max_distance"
                  type="number"
                  component={Input}
                  className="form-control"
                  id="max_distance"
                  disabled
                />
              </Col>
              <Col className="gutter-row" xs={1} sm={1} md={1} lg={1} style={{ marginTop: "5px", marginBottom: "10px" }}>
                กม.
              </Col>
            </Row>
          </div>
          break;
        case CUSTOMER_PAY:
          logicSetup = <div key="logic_setup_CUSTOMER_PAY">
            {/* Row#1 */}
            <Row gutter={{
              xs: 24,
              sm: 24,
              md: 12,
              lg: 12
            }}>
              <Col className="gutter-row" xs={24} sm={13} md={10} lg={4} style={{ marginTop: "5px", marginBottom: "10px" }}>
                ลูกค้าสั่งออเดอร์ยอดสุทธิตั้งแต่
              </Col>
              <Col className="gutter-row" xs={12} sm={5} md={4} lg={2}>
                <Field
                  name="order_amount"
                  type="number"
                  component={Input}
                  className="form-control"
                  id="order_amount"
                  disabled
                />
              </Col>
              <Col className="gutter-row" xs={12} sm={6} md={6} lg={2} style={{ marginTop: "5px", marginBottom: "10px" }}>
                บาท ขึ้นไป
              </Col>
            </Row>
            {/* Row#2 */}
            <Row gutter={{
              xs: 24,
              sm: 24,
              md: 12,
              lg: 12
            }}>
              <Col className="gutter-row" xs={24} sm={13} md={10} lg={4} style={{ marginTop: "5px", marginBottom: "10px" }}>
                ค่าส่งที่ลูกค้าจะต้องจ่าย
              </Col>
              <Col className="gutter-row" xs={12} sm={5} md={4} lg={2}>
                <Field
                  name="discount_amount"
                  type="number"
                  component={Input}
                  className="form-control"
                  id="discount_amount"
                  disabled
                />
              </Col>
              <Col className="gutter-row" xs={2} sm={1} md={1} lg={1} style={{ marginTop: "5px", marginBottom: "10px" }}>
                บาท
              </Col>
            </Row>
            {/* Row#3 */}
            <Row gutter={{
              xs: 24,
              sm: 24,
              md: 12,
              lg: 12
            }}>
              <Col className="gutter-row" xs={24} sm={5} md={4} lg={2} style={{ marginTop: "5px", marginBottom: "10px" }}>
                ระยะทางจัดส่ง
              </Col>
              <Col className="gutter-row" xs={12} sm={5} md={4} lg={2} style={{}}>
                <Field
                  name="min_distance"
                  type="number"
                  component={Input}
                  className="form-control"
                  id="min_distance"
                  disabled
                />
              </Col>
              <Col className="gutter-row" xs={12} sm={1} md={1} lg={1} style={{ marginTop: "5px", marginBottom: "10px" }}>
                กม.
              </Col>
              <Col className="gutter-row" xs={1} sm={1} md={1} lg={1} style={{ marginTop: "5px", marginBottom: "10px", textAlign: "right" }}>
                ถึง
              </Col>
              <Col className="gutter-row" xs={12} sm={5} md={4} lg={2}>
                <Field
                  name="max_distance"
                  type="number"
                  component={Input}
                  className="form-control"
                  id="max_distance"
                  disabled
                />
              </Col>
              <Col className="gutter-row" xs={1} sm={1} md={1} lg={1} style={{ marginTop: "5px", marginBottom: "10px" }}>
                กม.
              </Col>
            </Row>
          </div>
          break;
        case SUBSIDIZE:
          logicSetup = <div key="logic_setup_SUBSIDIZE">
            {/* Row#1 */}
            <Row gutter={{
              xs: 24,
              sm: 24,
              md: 12,
              lg: 12
            }}>
              <Col className="gutter-row" xs={24} sm={13} md={10} lg={4} style={{ marginTop: "5px", marginBottom: "10px" }}>
                ลูกค้าสั่งออเดอร์ยอดสุทธิตั้งแต่
              </Col>
              <Col className="gutter-row" xs={12} sm={5} md={4} lg={2}>
                <Field
                  name="order_amount"
                  type="number"
                  component={Input}
                  className="form-control"
                  id="order_amount"
                  disabled
                />
              </Col>
              <Col className="gutter-row" xs={12} sm={6} md={6} lg={2} style={{ marginTop: "5px", marginBottom: "10px" }}>
                บาท ขึ้นไป
              </Col>
            </Row>
            {/* Row#2 */}
            <Row gutter={{
              xs: 24,
              sm: 24,
              md: 12,
              lg: 12
            }}>
              <Col className="gutter-row" xs={24} sm={5} md={4} lg={2} style={{ marginTop: "5px", marginBottom: "10px" }}>
                ระยะทางจัดส่ง
              </Col>
              <Col className="gutter-row" xs={12} sm={5} md={4} lg={2} style={{}}>
                <Field
                  name="min_distance"
                  type="number"
                  component={Input}
                  className="form-control"
                  id="min_distance"
                  disabled
                />
              </Col>
              <Col className="gutter-row" xs={12} sm={1} md={1} lg={1} style={{ marginTop: "5px", marginBottom: "10px" }}>
                กม.
              </Col>
              <Col className="gutter-row" xs={1} sm={1} md={1} lg={1} style={{ marginTop: "5px", marginBottom: "10px", textAlign: "right" }}>
                ถึง
              </Col>
              <Col className="gutter-row" xs={12} sm={5} md={4} lg={2}>
                <Field
                  name="max_distance"
                  type="number"
                  component={Input}
                  className="form-control"
                  id="max_distance"
                  disabled
                />
              </Col>
              <Col className="gutter-row" xs={1} sm={1} md={1} lg={1} style={{ marginTop: "5px", marginBottom: "10px" }}>
                กม.
              </Col>
            </Row>
          </div>
          break;
        default:
          logicSetup = <div key="logic_setup_UNSELECTED"></div>
      }
      logicSetupElements.push(
        logicSetup
      )

      // Logic Subsidize
      let logicSubsidize = <div key="logic_subsidize_UNSELECTED"></div>
      switch (logicType) {
        case CUSTOMER_DISCOUNT:
          const subsidizeTypeName = _.get(values, "ls_type") == "percent" ? "เปอร์เซ็นต์" : "บาท"
          logicSubsidize = <div key="logic_subsidize_CUSTOMER_DISCOUNT">
            <Row gutter={24}>
              <Col className="gutter-row" span={24}>
                <Title level={5}>สัดส่วน Logic Subsidize</Title>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col className="gutter-row" span={12} style={{ marginTop: "5px", marginBottom: "10px" }}>
                <Radio.Group name="ls_type"
                  defaultValue={values["ls_type"]}
                  onChange={e => {
                    setFieldValue("ls_type", e.target.value)
                  }}
                  disabled
                >
                  <Radio value={BAHT}>บาท</Radio>
                  <Radio value={PERCENT} >เปอร์เซ็นต์</Radio>
                </Radio.Group>
              </Col>
            </Row>
            <Row gutter={{
              xs: 24,
              sm: 24,
              md: 12,
              lg: 12
            }}>
              <Col className="gutter-row" xs={24} sm={5} md={4} lg={2} style={{ marginTop: "5px", marginBottom: "10px" }}>
                ร้านอาหาร
              </Col>
              <Col className="gutter-row" xs={12} sm={5} md={4} lg={2} style={{}}>
                <Field
                  name="ls_merchant_amount"
                  type="number"
                  component={Input}
                  className="form-control"
                  id="ls_merchant_amount"
                  disabled
                />
              </Col>
              <Col className="gutter-row" xs={2} sm={2} md={2} lg={2} style={{ marginTop: "5px", marginBottom: "10px" }}>
                {subsidizeTypeName}
              </Col>
            </Row>
            <Row gutter={{
              xs: 24,
              sm: 24,
              md: 12,
              lg: 12
            }}>
              <Col className="gutter-row" xs={24} sm={5} md={4} lg={2} style={{ marginTop: "5px", marginBottom: "10px" }}>
                แพลตฟอร์ม
              </Col>
              <Col className="gutter-row" xs={12} sm={5} md={4} lg={2} style={{}}>
                <Field
                  name="ls_platform_amount"
                  type="number"
                  component={Input}
                  className="form-control"
                  id="ls_platform_amount"
                  disabled
                />
              </Col>
              <Col className="gutter-row" xs={2} sm={2} md={2} lg={2} style={{ marginTop: "5px", marginBottom: "10px" }}>
                {subsidizeTypeName}
              </Col>
            </Row>
          </div>
          break;
        case CUSTOMER_PAY:
          logicSubsidize = <div key="logic_subsidize_CUSTOMER_PAY">
            <Row gutter={24}>
              <Col className="gutter-row" span={24} style={{ marginTop: "5px", marginBottom: "10px" }}>
                <span style={{ fontSize: "15px", fontWeight: 600, marginBottom: "0.5em", lineHeight: 1.5 }}>สัดส่วน Logic Subsidize</span> <span style={{ fontWeight: 500, color: "rgb(93 93 93)" }}>* ถ้ามีการ subsidize เกินมนส่วนของการตั้งค่า LS จะต้องแคปลิมิตค่าของอีกฝั่งนึง</span>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col className="gutter-row" span={24} style={{ marginTop: "5px", marginBottom: "10px" }}>
                แพลตฟอร์มและร้านอาหารต้องรวมกัน 100 เปอร์เซ็นต์
              </Col>
            </Row>
            <Row gutter={{
              xs: 24,
              sm: 24,
              md: 12,
              lg: 12
            }}>
              <Col className="gutter-row" xs={24} sm={5} md={4} lg={2} style={{ marginTop: "5px", marginBottom: "10px" }}>
                ร้านอาหาร
              </Col>
              <Col className="gutter-row" xs={12} sm={5} md={4} lg={2} style={{}}>
                <Field
                  name="ls_merchant_amount"
                  type="number"
                  component={Input}
                  className="form-control"
                  id="ls_merchant_amount"
                  disabled
                />
              </Col>
              <Col className="gutter-row" xs={2} sm={2} md={2} lg={2} style={{ marginTop: "5px", marginBottom: "10px" }}>
                เปอร์เซ็นต์
              </Col>
            </Row>
            <Row gutter={{
              xs: 24,
              sm: 24,
              md: 12,
              lg: 12
            }}>
              <Col className="gutter-row" xs={24} sm={5} md={4} lg={2} style={{ marginTop: "5px", marginBottom: "10px" }}>
                แพลตฟอร์ม
              </Col>
              <Col className="gutter-row" xs={12} sm={5} md={4} lg={2} style={{}}>
                <Field
                  name="ls_platform_amount"
                  type="number"
                  component={Input}
                  className="form-control"
                  id="ls_platform_amount"
                  disabled
                />
              </Col>
              <Col className="gutter-row" xs={2} sm={2} md={2} lg={2} style={{ marginTop: "5px", marginBottom: "10px" }}>
                เปอร์เซ็นต์
              </Col>
            </Row>
          </div>
          break;
        case SUBSIDIZE:
          const subsidizeTypeName2 = _.get(values, "ls_type") == "percent" ? "เปอร์เซ็นต์" : "บาท"
          logicSubsidize = <div key="logic_subsidize_SUBSIDIZE">
            <Row gutter={24}>
              <Col className="gutter-row" span={24}>
                <Title level={5}>สัดส่วน Logic Subsidize</Title>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col className="gutter-row" span={12} style={{ marginTop: "5px", marginBottom: "10px" }}>
                <Radio.Group name="ls_type"
                  defaultValue={values["ls_type"]}
                  onChange={e => {
                    setFieldValue("ls_type", e.target.value)
                  }}
                  disabled
                >
                  <Radio value={BAHT}>บาท</Radio>
                  <Radio value={PERCENT} >เปอร์เซ็นต์</Radio>
                </Radio.Group>
              </Col>
            </Row>
            <Row gutter={{
              xs: 24,
              sm: 24,
              md: 12,
              lg: 12
            }}>
              <Col className="gutter-row" xs={24} sm={5} md={4} lg={2} style={{ marginTop: "5px", marginBottom: "10px" }}>
                ร้านอาหาร
              </Col>
              <Col className="gutter-row" xs={12} sm={5} md={4} lg={2} style={{}}>
                <Field
                  name="ls_merchant_amount"
                  type="number"
                  component={Input}
                  className="form-control"
                  id="ls_merchant_amount"
                  disabled
                />
              </Col>
              <Col className="gutter-row" xs={2} sm={2} md={2} lg={2} style={{ marginTop: "5px", marginBottom: "10px" }}>
                {subsidizeTypeName2}
              </Col>
            </Row>
            <Row gutter={{
              xs: 24,
              sm: 24,
              md: 12,
              lg: 12
            }}>
              <Col className="gutter-row" xs={24} sm={5} md={4} lg={2} style={{ marginTop: "5px", marginBottom: "10px" }}>
                แพลตฟอร์ม
              </Col>
              <Col className="gutter-row" xs={12} sm={5} md={4} lg={2} style={{}}>
                <Field
                  name="ls_platform_amount"
                  type="number"
                  component={Input}
                  className="form-control"
                  id="ls_platform_amount"
                  disabled
                />
              </Col>
              <Col className="gutter-row" xs={2} sm={2} md={2} lg={2} style={{ marginTop: "5px", marginBottom: "10px" }}>
                {subsidizeTypeName2}
              </Col>
            </Row>
          </div>
          break;
        default:
          logicSubsidize = <div key="logic_subsidize_UNSELECTED"></div>
      }
      logicSetupElements.push(
        logicSubsidize
      )
    }

    // Footer
    logicSetupElements.push(
      <div key="logic_setup_footer">
        <Divider style={{
          marginTop: '5px',
          marginBottom: '20px'
        }} />
      </div>
    )
    return <div key="logic_setup">{logicSetupElements}</div>
  }

  const renderLogicOutlet = (values: any, setFieldValue: any, handleChange: any) => {
    let logicOutletElements = []
    // Header
    logicOutletElements.push(
      <div key="logic_outlet_header">
        <Row gutter={24}>
          <Col className="gutter-row" span={24}>
            <Title level={4}>ร้านอาหารที่ใช้งาน</Title>
          </Col>
        </Row>
      </div>
    )

    logicOutletElements.push(
      <div key="logic_outlet_section#1">
        <Row gutter={24}>
          <Col className="gutter-row" span={24}>
            <Checkbox
              defaultChecked={values.is_apply_all_brand}
              onChange={(e) => {
                setFieldValue("is_apply_all_brand", e.target.checked)
              }}
            >เข้าร่วมทุกร้านอาหาร
            </Checkbox>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col className="gutter-row" span={24}>
            < Collapse
              accordion
              collapsible={values.is_apply_all_brand ? 'disabled' : 'header'}
            >
              <Panel key="outlet_joined" header="ร้านอาหารที่เข้าร่วม">
                <OutletSelecter
                  handleChange={handleChange}
                  disabled={values.is_apply_all_brand}
                  selectedList={filterOutletSelected}
                  formValue={values}
                  setFieldValue={setFieldValue}
                  userSelectedOutlet={userSelectedOutlet}
                  brandList={brandList}
                />
              </Panel>
            </Collapse >
          </Col>
        </Row>
      </div>
    )

    // Footer
    logicOutletElements.push(
      <div key="logic_outlet_footer">
        <Divider style={{
          marginTop: '20px',
          marginBottom: '20px'
        }} />
      </div>)

    return <div key="logic_outlet">{logicOutletElements}</div>
  }

  const renderLogicSummary = (values: any, setFieldValue: any) => {
    let logicSummaryElements: any = []
    // Header
    logicSummaryElements.push(
      <div key="logic_summary_header">
        <Row key="logic_summary_row#1" gutter={24}>
          <Col key="logic_summary_row#1_col#1" className="gutter-row" sm={12} xs={24}>
            <Title level={4}>LS Summary</Title>
          </Col>
          <Col key="logic_summary_row#1_col#2" className="gutter-row" sm={12} xs={24} style={{ textAlign: 'end' }}>
            <Button
              style={{ width: '200px', marginTop: '0px' }}
              type="primary"
              size="middle"
              onClick={async () => {
                // Validate Logic Setup
                let validLogicSetup = false
                const type = _.get(values, "type") != undefined && _.get(values, "type") != "" ? true : false
                const typeName = _.get(values, "type") != undefined && _.get(values, "type") != "" ? _.get(values, "type") : ""
                const order_amount = _.get(values, "order_amount") != undefined ? true : false
                let discount_type = _.get(values, "discount_type") != undefined && _.get(values, "discount_type") != "" ? true : false
                let discount_amount = _.get(values, "discount_amount") != undefined ? true : false
                const min_distance = _.get(values, "min_distance") != undefined ? true : false
                const max_distance = _.get(values, "max_distance") != undefined ? true : false
                const ls_type = _.get(values, "ls_type") != undefined && _.get(values, "ls_type") != "" ? true : false
                const ls_platform_amount = _.get(values, "ls_platform_amount") != undefined ? true : false
                const ls_merchant_amount = _.get(values, "ls_merchant_amount") != undefined ? true : false

                if (typeName == SUBSIDIZE) {
                  discount_type = true
                  discount_amount = true
                }

                if (type && order_amount && discount_type && discount_amount && min_distance && max_distance && ls_type && ls_platform_amount && ls_merchant_amount) {
                  validLogicSetup = true
                }

                if (validLogicSetup) {
                  setIsVisibleLsSummary(true)
                  let outlets = []
                  if (size(get(values, 'brands')) > 0) {
                    for (var brand of values.brands) {
                      if (get(brand, 'is_selected') == true) {
                        if (get(brand, 'type') == 'all') {
                          outlets.push({ brand_id: brand["id"], outlet_ids: [0] })
                        } else if (size(get(brand, 'outlets')) > 0) {
                          outlets.push({ brand_id: brand["id"], outlet_ids: get(brand, 'outlets') })
                        }
                      }
                    }
                  }
                  setFieldValue("ls_outlet", outlets)
                  const is_apply_all_brand = _.get(values, "is_apply_all_brand") ? _.get(values, "is_apply_all_brand") : false
                  const outletLocations = await handleGetOutletLocations(outlets, is_apply_all_brand)
                  let lsSummaryParam = {
                    name: _.get(values, "name") ? _.get(values, "name") : "",
                    type: _.get(values, "type") ? _.get(values, "type") : "",
                    // type_name: _.get(values, "type_name") ? _.get(values, "type_name") : "",
                    order_amount: _.get(values, "order_amount") ? _.get(values, "order_amount") : 0,
                    discount_type: _.get(values, "discount_type") ? _.get(values, "discount_type") : "",
                    discount_amount: _.get(values, "discount_amount") ? _.get(values, "discount_amount") : 0,
                    min_distance: _.get(values, "min_distance") ? _.get(values, "min_distance") : 0,
                    max_distance: _.get(values, "max_distance") ? _.get(values, "max_distance") : 0,
                    ls_type: _.get(values, "ls_type") ? _.get(values, "ls_type") : "",
                    ls_platform_amount: _.get(values, "ls_platform_amount") ? _.get(values, "ls_platform_amount") : 0,
                    ls_merchant_amount: _.get(values, "ls_merchant_amount") ? _.get(values, "ls_merchant_amount") : 0,
                    // start_date: "",
                    // end_date: "",
                    province_ids: _.get(outletLocations, "province_ids") ? _.get(outletLocations, "province_ids") : [],
                    district_ids: _.get(outletLocations, "district_ids") ? _.get(outletLocations, "district_ids") : [],
                    sub_district_ids: _.get(outletLocations, "sub_district_ids") ? _.get(outletLocations, "sub_district_ids") : [],
                  }
                  setlsSummaryElementParam(lsSummaryParam)
                } else {
                  notification.warning({
                    message: `ไม่สามารถ Preview LS Summary ได้`,
                    description: 'กรุณาระบุ Logic Setup ให้ครบถ้วน',
                  })
                  setIsVisibleLsSummary(false)
                }
              }}
            >
              Preview LS Summary
            </Button>
          </Col>
        </Row>
      </div>
    )
    if (isVisibleLsSummary) {
      // LS Summary
      logicSummaryElements.push(
        <LsSummaryComponent payload={lsSummaryElementParam}></LsSummaryComponent>
      )
    }

    // Footer
    logicSummaryElements.push(
      <div key="logic_summary_footer" >
        <Divider style={{
          marginTop: '20px',
          marginBottom: '20px'
        }} />
      </div>)
    return <div key="logic_summary">{logicSummaryElements}</div>
  }

  const renderLogicDetail = (values: any, setFieldValue: any) => {
    let logicDetailElements = []
    logicDetailElements.push(
      <div key="logic_detail_section#1">
        {/* Row#1 Campaign Date */}
        <Row key="logic_detail_row#1" gutter={24}>
          <Col className="gutter-row" sm={24} xs={24}>
            <Field
              label={{ text: 'วันที่และเวลาของแคมเปญ' }}
              name="campaign_time"
              component={DateTimeRangePicker}
              id="campaign_time"
              placeholder="วันเวลาที่ทำรายการ"
            />
          </Col>
        </Row>
        {/* Row#2 Deep Link and In-app Link */}
        <Row key="logic_detail_row#2" gutter={24}>
          <Col className="gutter-row" sm={12} xs={24}>
            <div className="ant-form ant-form-vertical">
              <FormAntd.Item label={"Deep Link"}>
                <InputAntd.Group compact>
                  <InputAntd
                    style={{
                      width: 'calc(100% - 92px)',
                    }}
                    onChange={(e) => {
                      setFieldValue("deep_link", e.target.value)
                    }}
                    defaultValue={values.deep_link}
                    disabled
                  />
                  <Tooltip title="คัดลอก">
                    <ButtonAntd
                      icon={<CopyOutlined />}
                      onClick={() => {
                        navigator.clipboard.writeText(values.deep_link)
                      }}
                    >คัดลอก</ButtonAntd>
                  </Tooltip>
                </InputAntd.Group>
              </FormAntd.Item>
            </div>
          </Col>
          <Col className="gutter-row" sm={12} xs={24}>
            <div className="ant-form ant-form-vertical">
              <FormAntd.Item label={"Link In App"}>
                <InputAntd.Group compact>
                  <InputAntd
                    style={{
                      width: 'calc(100% - 92px)',
                    }}
                    onChange={(e) => {
                      setFieldValue("inapp_link", e.target.value)
                    }}
                    defaultValue={values.inapp_link}
                    disabled
                  />
                  <Tooltip title="คัดลอก">
                    <ButtonAntd
                      icon={<CopyOutlined />}
                      onClick={() => {
                        navigator.clipboard.writeText(values.inapp_link)
                      }}
                    >คัดลอก</ButtonAntd>
                  </Tooltip>
                </InputAntd.Group>
              </FormAntd.Item>
            </div>
          </Col>
        </Row>
        {/* Row#3 Deep Link and In-app Link */}
        {imageUrl != '' ?
          <Row key="logic_detail_row#3" gutter={24}>
            <Col className="gutter-row" span={24}>
              <label style={{ display: "block", marginBottom: "10px" }}>รูปภาพ
                {/* <span style={{ color: "rgb(93, 93, 93)", fontWeight: 500 }}>(ขนาดไม่เกิน 1 MB)</span> */}
              </label>
            </Col>

            {/* <Upload
            name="file"
            id="file"
            onRemove={e => { setImageUrl('') }}
            beforeUpload={handleChangeImage}
            maxCount={1}
          >

            <Button style={{ marginLeft: 10 }} icon={<PlusOutlined />}>เพิ่มรูป</Button>
          </Upload> */}


            <Col className="gutter-row" span={24} style={{ marginTop: "35px", marginBottom: "20px", textAlign: "center" }}>
              <img style={{ width: 'auto', height: 240 }} alt="example" src={imageUrl != '' ? imageUrl : noImage.src} />
            </Col>

          </Row>
          :
          <></>}
      </div>
    )

    return <div key="logic_detail">{logicDetailElements}</div>
  }


  return (
    <MainLayout>
      {!_isLoading && (
        <Formik
          initialValues={{
            ...lsDetail,
            outlets: buildOutletInitValue(userSelectedOutlet),
          }}
          onSubmit={handleSubmit}
          validationSchema={Schema}
          enableReinitialize={true}
          setFieldValue={true}
        >
          {({
            values,
            resetForm,
            setFieldValue,
            handleChange }) => (
            <Form>
              <Row justify="space-around" align="middle">
                <Col span={8}>
                  <Title level={4}>LS Logic</Title>
                  <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>LS Logic</Breadcrumb.Item>
                    <Breadcrumb.Item>สร้าง LS Logic</Breadcrumb.Item>
                  </Breadcrumb>
                </Col>
                <Col span={8} offset={8} style={{ textAlign: 'end' }}>
                  <Button
                    style={{ width: '100px', marginTop: '31px' }}
                    type="primary"
                    size="middle"
                    htmlType="submit"
                    disabled={disableSubmitButton}
                  >
                    บันทึก
                  </Button>
                </Col>
              </Row>
              <Card>
                {/* Logic Info */}
                {renderLogicInfo(values, setFieldValue)}

                {/* Logic Setup */}
                {renderLogicSetup(values, setFieldValue)}

                {/* Logic Outlet */}
                {renderLogicOutlet(values, setFieldValue, handleChange)}

                {/* Logic Summary */}
                {renderLogicSummary(values, setFieldValue)}

                {/* Logic Detail */}
                {renderLogicDetail(values, setFieldValue)}

              </Card>
            </Form>
          )}
        </Formik>
      )
      }
    </MainLayout >
  )
}
