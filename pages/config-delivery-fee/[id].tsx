import Card from '@/components/Card';
import CheckBox2 from '@/components/Form/CheckBox2';
import Input from '@/components/Form/Input';
import Select from "@/components/Form/Select";
import Table from '@/components/Table';
import MainLayout from '@/layout/MainLayout';
import {
  getCity,
  getDistrict,
  getDistrictByProvinceId,
  getProvince
} from '@/services/pos-profile';
import { tierPriceList, tierPriceLocationUpdate, tierPriceUpdate, tierPriceValidate } from '@/services/tierPrices';
import { DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Col, message, Modal, notification, Row, Typography } from 'antd';
import { Field, Form, Formik } from 'formik';
import _, { map } from 'lodash';
import { useRouter } from 'next/router';
import { ReactElement, useEffect, useState } from 'react';
import * as Yup from 'yup';

const { Title } = Typography
const { confirm } = Modal;

interface Props { }


interface DistrictInterface {
  district_id: number
  city_id: number
  province_id: number
  name_th: string
  name_en: string
  zipcode: string
}

interface ProviceInterface {
  province_id: number
  name_th: string
  name_en: string
}

interface CityInterface {
  city_id: number
  province_id: number
  name_th: string
  name_en: string
}

const Schema = Yup.object().shape({
  name: Yup.string().trim().max(100, 'กรุณากรอกชื่อ Tier Price ไม่เกิน 100 ตัวอักษร').required('กรุณากรอกชื่อ Tier Price'),
  tier_prices: Yup.array()
    .of(
      Yup.object().shape({
        min: Yup.number().required('กรุณากรอกระยะทางเริ่มต้น').min(0, "กรุณากรอกระยะทางเริ่มต้นให้ถูกต้อง"),
        max: Yup.number().required('กรุณากรอกระยะทางสิ้นสุด').when('min', (min: any, schema: any) => {
          return schema.test({
            test: (max: any) => {
              if (!min) return true
              return (max > min)
            },
            message: "กรุณากรอกระยะทางให้ถูกต้อง",
          })
        }).min(0, "กรุณากรอกระยะทางสิ้นสุดให้ถูกต้อง"),
        price: Yup.number().required('กรุณากรอกค่าโดยสาร').min(0, "กรุณากรอกค่าโดยสารให้ถูกต้อง"),
      })
    )
    .min(1, 'กรุณากรอกค่าโดยสาร')
})

interface InterfaceOption {
  value: string | number
  name: string
  city?: string | number
}

interface initialValues {
  name?: string;
  province_id?: string;
  district_id?: string;
  sub_district_id?: never[];
  tier_prices?: {
    min: number;
    max: string;
    price: string;
  }[];
  all_city?: boolean;
  total_province?: number;
  total_district?: number;
  total_sub_district?: number;
}

export default function ConfigDeliveryCreate({ }: Props): ReactElement {
  const router = useRouter()
  const [deliveryFeeRuleCount, setDeliveryFeeRuleCount] = useState(1)
  const [deliveryFeeRuleValidate, setDeliveryFeeRuleValidate] = useState(false)
  const [allCityLocation, setAllCityLocation] = useState(false)
  const [deliveryFeeRuleValidateMessage, setDeliveryFeeRuleValidateMessage] = useState("")
  const [provinceList, setProvinceList] = useState<Array<InterfaceOption>>([])
  const [showError, setShowError] = useState(false)
  const [showErrorResult, setShowErrorResult] = useState<any>([])
  const [cityList, setCityList] = useState<Array<InterfaceOption>>([])
  const [subDistrictList, setSubDistrictList] = useState<Array<InterfaceOption>>([])
  const [districtData, setSubDistrciData] = useState<Array<DistrictInterface>>([])
  let [initialValues, setInitialValues] = useState<initialValues>({
    name: '',
    province_id: "",
    district_id: "",
    sub_district_id: [],
    tier_prices: [
      {
        min: 0,
        max: '',
        price: '',
      }
    ],
    all_city: false,
    total_province: 0,
    total_district: 0,
    total_sub_district: 0
  })
  const id = router.query.id as string

  let [mockData, setMockData] = useState<any>([])
  let [isLoading, setIsLoading] = useState(true)
  let [selectColumn, setColumn] = useState<any>([])

  const handleDeductDeliveryFeeRule = (values: any, setFieldValue: any) => {
    setDeliveryFeeRuleValidate(false)
    if (deliveryFeeRuleCount > 0) {
      let formValue = values
      if (formValue) {
        let deliveryFeeValue = _.get(formValue, 'tier_prices') ? _.get(formValue, 'tier_prices') : []
        if (_.size(deliveryFeeValue) > 0) {
          setDeliveryFeeRuleCount(deliveryFeeRuleCount - 1)
          deliveryFeeValue.pop()
          setFieldValue("tier_prices", deliveryFeeValue)
          setDeliveryFeeRuleValidate(false)
        }
      }
    }
  }


  let [params, setParams] = useState<any>({})

  const fetchSubDistrict = async (cityId: number) => {
    const { success, result } = await getDistrict({ city_id: cityId })
    if (success) {
      const { result: data } = result
      const { items } = data
      const subDistrictOption = map(items, (item: DistrictInterface) => ({
        value: item.district_id,
        name: item.name_th,
      }))
      setSubDistrictList(subDistrictOption)
      setSubDistrciData(items)
    } else {
      message.error({ content: 'ไม่สามารถดึงค่าที่อยู่ได้กรุณาลองใหม่อีกครั้ง' })
    }
  }



  const fetchSubDistrictByParam = async (proviceId: number, districtId: number[] = []) => {
    let reqParam: any = { province_ids: [proviceId] }
    if (districtId.length > 0) {
      reqParam = { city_ids: districtId }
    }
    const { success, result } = await getDistrictByProvinceId(reqParam)
    if (success) {
      const { result: data } = result
      const { items } = data
      const subDistrictOption = map(items, (item: DistrictInterface) => ({
        value: item.district_id,
        name: item.name_th,
        city: item.city_id
      }))
      return subDistrictOption
    } else {
      message.error({ content: 'ไม่สามารถดึงค่าที่อยู่ได้กรุณาลองใหม่อีกครั้ง' })
    }
  }

  const renderDeliveryFeeRule = (values: any, setFieldValue: any) => {
    let deliveryFeeRuleElement = []
    for (let i = 0; i < deliveryFeeRuleCount; i++) {
      const deliveryMinParam = `tier_prices[${i}].min`
      const deliveryMaxParam = `tier_prices[${i}].max`
      const deliveryPriceParam = `tier_prices[${i}].price`

      deliveryFeeRuleElement.push(
        <div key={`tier_prices_rule#${i}`}>
          <Row key={`tier_prices_rule_title_row#${i}`} gutter={16}>
            <Col key={`tier_prices_rule_title#${i}`} className="gutter-row" span={2}>
              <Title level={5}>Rule {i + 1}</Title>
            </Col>
            {(i + 1) == deliveryFeeRuleCount ? <Col className="gutter-row" span={8}>
              {deliveryFeeRuleValidate ? <span style={{ "color": "red" }}>{deliveryFeeRuleValidateMessage}</span> : null}
            </Col> : null}
          </Row>
          <Row key={`tier_prices_rule#${i}`} gutter={24}>
            <Col style={{ marginTop: 5 }} span={2}>
              <span>ระยะทาง</span>
            </Col>
            <Col className="gutter-row" span={3}>
              <Field
                name={deliveryMinParam}
                type="number"
                component={Input}
                className="form-control"
                id={deliveryMinParam}
                placeholder=""
                // disabled={(i + 1) != deliveryFeeRuleCount ? true : false}
                disabled={true}
              />
            </Col>
            <Col style={{ marginTop: 5 }} span={1}>
              <span>กม.</span>
            </Col>
            <Col style={{ marginTop: 5 }} span={1}>
              <span>ถึง</span>
            </Col>
            <Col className="gutter-row" span={3}>
              <Field
                name={deliveryMaxParam}
                type="number"
                component={Input}
                className="form-control"
                id={deliveryMaxParam}
                placeholder=""
                disabled={(i + 1) != deliveryFeeRuleCount ? true : false}
              />
            </Col>
            <Col style={{ marginTop: 5 }} span={1}>
              <span>กม.</span>
            </Col>
            <Col style={{ marginTop: 5 }} span={2}>
              <span>ราคา</span>
            </Col>
            <Col className="gutter-row" span={3}>
              <Field
                name={deliveryPriceParam}
                type="number"
                component={Input}
                className="form-control"
                id={deliveryPriceParam}
                placeholder=""
              />
            </Col>
            <Col style={{ marginTop: 5 }} span={2}>
              <span>บาท / กม.</span>
            </Col>
            {
              ((i + 1) == deliveryFeeRuleCount) && (i != 0) ?
                <Button
                  key={`tier_prices_rule_button#${i}`}
                  style={{ width: '100px', marginBottom: '10px' }}
                  size="middle"
                  onClick={() => {
                    handleDeductDeliveryFeeRule(values, setFieldValue)
                  }}
                >
                  ลบ Rule
                </Button> : null
            }

          </Row>
        </div>
      )
    }
    return deliveryFeeRuleElement
  }

  const allCity = async () => {

    let data: any[] = []
    let dataRow: any = {}

    let subDistrictProvince = await fetchSubDistrictByParam(parseInt(params.province_id))

    let province_data: any = _.find(provinceList, function (obj) {
      if (obj.value == params.province_id) {
        return true;
      }
    });

    cityList.forEach(element => {

      let sub_district_data: any = []
      let city_data: any = _.find(cityList, function (obj) {
        if (obj.value == element.value) {
          return true;
        }
      });

      let sub_district_list = _.filter(
        subDistrictProvince, function (o) {
          return o.city == element.value;
        }
      );

      sub_district_list.forEach(element => {
        sub_district_data.push(parseInt(element.value.toString()))
      });

      dataRow =
      {
        province: province_data.name,
        province_data: province_data,
        province_id: province_data.value,
        city: city_data.name,
        city_data: city_data,
        city_id: city_data.value,
        location_type: "district",
        sub_district: [],
        sub_district_option: sub_district_list,
        sub_district_selected: sub_district_data,
        name: Math.floor(Math.random() * 1000).toString()
      }

      // let index = _.findIndex(data, (e: any) => {
      //   return e.city_id == city_data.value;
      // }, 0);

      // if (index !== -1) {
      //   data[index] = dataRow
      // } else {
      data.push(dataRow)
      //}

    });
    return data
  }

  const handleSubmit = async (values: typeof initialValues) => {

    let total_province: number = 0
    let total_district: number = 0
    let total_sub_district: number = 0
    let tier_prices: any = []

    values.tier_prices?.forEach((element: any) => {
      tier_prices.push({
        min: parseFloat(element.min),
        max: parseFloat(element.max),
        price: parseFloat(element.price),
      })
    });

    mockData.forEach((element: any) => {
      total_province = 1
      total_district = total_district + 1,
        total_sub_district = total_sub_district + element.sub_district_selected.length
    });

    const reqUpdateTierPrice: any = {
      data: {
        id: id,
        name: values.name,
        tier_prices: tier_prices,
        total_province: total_province,
        total_district: total_district,
        total_sub_district: total_sub_district
      }
    }
    const { success, result } = await tierPriceUpdate(reqUpdateTierPrice)

    if (success) {
      let location_type = "province"
      let locations: any[] = []
      let location = {}
      let sub_districts: any[] = []
      let sub_district: any

      let checkSubDistrict = _.find(mockData, function (obj) {
        if ("sub_district" == obj.location_type) {
          return true;
        }
      });

      mockData.forEach((data: any) => {

        //sub_district_data
        data.sub_district_selected.forEach((element: any) => {
          sub_district = _.find(data.sub_district_option, function (obj) {
            if (element == obj.value) {
              return true;
            }
          });
          sub_districts.push(
            {
              id: sub_district.value,
              name: sub_district.name
            }
          )
        });

        //location_type
        if (cityList.length !== mockData.length || (cityList.length == mockData.length && checkSubDistrict) || checkSubDistrict) {
          location_type = data.location_type
        }

        location = {
          location_type: location_type,
          province_id: data.province_id,
          province_data: {
            id: data.province_data.value,
            name: data.province_data.name
          },
          district_id: data.city_id,
          district_data: {
            id: data.city_data.value,
            name: data.city_data.name
          },
          sub_district_id: `|${data.sub_district_selected.join("|")}|`,
          sub_districts: sub_districts
        }
        locations.push(location)
      });

      const requstUpdateTierPriceLocation: any = {
        data: {
          tier_id: id,
          locations: locations
        }
      }

      const { success, result } = await tierPriceLocationUpdate(requstUpdateTierPriceLocation)
      if (success && result.message !== "Error") {
        notification.success({
          message: `แก้ไขข้อมูลสำเร็จ`,
          description: '',
          duration: 3,
        })
        router.push('/config-delivery-fee');
      } else {
        notification.warning({
          message: `ผิดพลาด`,
          description: 'ไม่สามารถเพิ่มพื้นที่ได้ เนื่องจากมีพื้นที่ซ้อนทับกับ config อื่น',
          duration: 3,
        })
        if (_.get(result, "validate[0]") || _.get(result, "tier_duplicate_location")) {
          setShowError(true)
          result.validate.forEach((element: any, index: number) => {
            let districtData: any = _.find(locations, function (obj) {
              if (obj.district_id == element.district) {
                return true;
              }
            });
            result.validate[index].district = districtData.district_data

            let sub_districtDatas: any = []

            if (districtData.location_type !== "district") {
              _.get(result, `validate[${index}].sub_district`, []).forEach((subdistrictId: any) => {
                let sub_districtData: any = _.find(districtData.sub_districts, function (obj) {
                  if (obj.id == subdistrictId) {
                    return true;
                  }
                });
                sub_districtDatas.push(sub_districtData.name)
              });
            }
            result.validate[index].sub_district = sub_districtDatas
          });
          setShowErrorResult(result.validate)
        }
        const reqUpdateTierPrice: any = {
          data: {
            id: id,
            name: initialValues.name,
            total_province: initialValues.total_province,
            total_district: initialValues.total_district,
            total_sub_district: initialValues.total_sub_district,
          }
        }
        await tierPriceUpdate(reqUpdateTierPrice)
      }
    }
  }

  const renderErrorMessage = (values: any, setFieldValue: any) => {
    let errorRow = []
    let keyword = ""
    for (let i = 0; i < showErrorResult.length; i++) {
      if (_.get(showErrorResult[i], "sub_district") && showErrorResult[i].sub_district.length > 0) {
        keyword = `-อำเภอ ${showErrorResult[i].district.name} มีการระบุตำบล (${showErrorResult[i].sub_district.join(",")}) ซ้ำ`
      } else {
        keyword = `-มีการระบุอำเภอ${showErrorResult[i].district.name}แล้ว หากคุณต้องการเจาะจงระดับตำบล กรุณาระบุเฉพาะตำบลที่คุณต้องการเพิ่ม`
      }
      errorRow.push(
        <Col span={24}>
          {keyword}
        </Col>
      )
    }
    return (
      <Row style={{ color: "red" }}>
        <Col span={24}>พบพื้นที่ซ้ำซ้อนกับ config อื่น</Col>
        {errorRow}
      </Row>)
  }

  const validateTierPrice = async () => {

    let location_type: string = "province"
    if (allCityLocation) {
      location_type = "province"
    } else if ((params.district_id && !params.sub_district_id) || _.get(params, "sub_district_id", "").split(",").length == subDistrictList.length) {
      location_type = "district"
    } else {
      location_type = "sub_district"
    }

    let reqValidatetierPrice: any = {
      tier_id: id,
      location_type: location_type,
      province_id: params.province_id,
      district_id: params.district_id || 0,
      sub_district_id: (params.sub_district_id) ? `|${params.sub_district_id.replaceAll(",", "|")}|` : ""
    }

    const { success, result } = await tierPriceValidate(reqValidatetierPrice)

    if (success && !result.tier_duplicate_location) {
      return true
    } else {
      notification.warning({
        message: `ผิดพลาด`,
        description: 'ไม่สามารถเพิ่มพื้นที่ได้ เนื่องจากมีพื้นที่ซ้อนทับกับ config อื่น',
      })
      return false
    }

  }

  const handleClaerlocation = () => {
    setMockData([])
  }

  const handleAddlocation = async () => {

    setIsLoading(false)
    let sub_district_data: (string | number)[] = []
    let data: any = []
    let location_type: string = ""
    let newData: any

    if (await validateTierPrice()) {
      if (allCityLocation) {
        const allCityData = await allCity()
        data = [
          ...allCityData
        ]
      } else {
        let province_data: any = _.find(provinceList, function (obj) {
          if (obj.value == params.province_id) {
            return true;
          }
        });

        let city_data: any = _.find(cityList, function (obj) {
          if (obj.value == params.district_id) {
            return true;
          }
        });

        if (!params.sub_district_id || _.get(params, "sub_district_id", "").split(",").length == subDistrictList.length) {
          sub_district_data = subDistrictList.map(a => a.value);
          location_type = "district"
        } else {
          sub_district_data = params.sub_district_id.split(",").map((str: any) => Number(str))
          location_type = "sub_district"
        }

        let index = _.findIndex(mockData, (e: any) => {
          return e.city_id == params.district_id;
        }, 0);

        newData = {
          province: province_data.name,
          province_data: province_data,
          province_id: province_data.value,
          city: city_data.name,
          city_data: city_data,
          city_id: city_data.value,
          location_type: location_type,
          sub_district: [],
          sub_district_option: subDistrictList,
          sub_district_selected: sub_district_data,
          name: Math.floor(Math.random() * 1000).toString()
        }

        if (index !== -1) {
          mockData[index].sub_district_selected = sub_district_data
          mockData[index].location_type = location_type
          data = [
            ...mockData
          ]
        } else if (province_data.value !== _.get(mockData[0], 'province_id')) {
          data = [
            newData
          ]
        } else {
          data = [
            ...mockData,
            newData
          ]
        }
      }
      setMockData(data)
      setColumn(
        [{
          title: 'แขวง',
          dataIndex: 'sub_district',
          align: 'center',
          render: (text: any, record: any) => {
            return (<Field
              key={record.id}
              component={Select}
              mode="multiple"
              className="form-control round"
              onChange={async (value: number[], info: any, city_id: number = record.city_id) => {
                let index = _.findIndex(data, (e: any) => {
                  return e.city_id == city_id;
                }, 0);
                if (value.length !== 0) {
                  //renew selected list
                  data[index].sub_district_selected = value
                  //check location_type
                  if (data[index].sub_district_option.length !== value.length) {
                    data[index].location_type = "sub_district"
                  } else {
                    data[index].location_type = "district"
                  }

                  setMockData([...data])
                } else {
                  showDeleteConfirm(data[index].city, index, data)
                }
              }}
              selectOption={record.sub_district_option}
              value={record.sub_district_selected}
              name={record.name}
            />)
          },
        }, {
          title: '',
          dataIndex: '',
          align: 'center',
          render: (text: any, record: any) => {
            return (<DeleteOutlined onClick={(e: any) => {
              let index = _.findIndex(data, (e: any) => {
                return e.city_id == record.city_id;
              }, 0);
              data.splice(index, 1);
              setMockData([...data])
            }} />)
          }
        }
        ]
      )
      setIsLoading(true)
    }
  }

  const handleAddDeliveryFeeRule = (values: any, setFieldValue: any) => {
    setDeliveryFeeRuleValidate(false)
    let formValue = values
    if (formValue) {
      let deliveryFeeValue = _.get(formValue, 'tier_prices') ? _.get(formValue, 'tier_prices') : []
      if (_.size(deliveryFeeValue) > 0) {
        let deliveryFeeValueSize = _.size(deliveryFeeValue)
        let lastestMaxDistanceValue = _.get(deliveryFeeValue[deliveryFeeValueSize - 1], 'max')
        let lastestMinDistanceValue = _.get(deliveryFeeValue[deliveryFeeValueSize - 1], 'min')
        if (lastestMaxDistanceValue) {
          if (Number(lastestMaxDistanceValue) > 0) {
            if (Number(lastestMinDistanceValue) >= Number(lastestMaxDistanceValue)) {
              setDeliveryFeeRuleValidateMessage(`กรุณากรอกระยะทาง Rule ${deliveryFeeRuleCount} ให้ถูกต้อง`)
              setDeliveryFeeRuleValidate(true)
            } else {
              setDeliveryFeeRuleCount(deliveryFeeRuleCount + 1)
              deliveryFeeValue.push({
                min: lastestMaxDistanceValue,
                max: '',
                price: '',
              })
              setFieldValue("tier_prices", deliveryFeeValue)
              setDeliveryFeeRuleValidate(false)
            }
          } else {
            setDeliveryFeeRuleValidateMessage(`กรุณากรอกระยะทาง Rule ${deliveryFeeRuleCount} ให้ถูกต้อง`)
            setDeliveryFeeRuleValidate(true)
          }
        } else {
          setDeliveryFeeRuleValidateMessage(`กรุณากรอกระยะทาง Rule ${deliveryFeeRuleCount} ให้ครบถ้วน`)
          setDeliveryFeeRuleValidate(true)
        }
      }
    }
  }

  const fetchCity = async (proviceId: number) => {
    const { success, result } = await getCity({ province_id: proviceId })
    if (success) {
      const { result: data } = result
      const { items } = data
      const cityOption = map(items, (item: CityInterface) => ({
        value: item.city_id,
        name: item.name_th,
      }))
      setCityList(cityOption)
    } else {
      message.error({ content: 'ไม่สามารถดึงค่าที่อยู่ได้กรุณาลองใหม่อีกครั้ง' })
    }
  }

  const fetchProvince = async () => {
    const { success, result } = await getProvince()
    if (success) {
      const { result: data } = result
      const { items } = data
      const provinceOption = map(items, (item: ProviceInterface) => ({
        value: item.province_id,
        name: item.name_th,
      }))
      setProvinceList(provinceOption)
    } else {
      message.error({ content: 'ไม่สามารถดึงค่าที่อยู่ได้กรุณาลองใหม่อีกครั้ง' })
    }
  }

  const getTierPriceDetail = async () => {
    setIsLoading(true)
    const request = {
      id: id,
      include: "location",
    }
    const { result, success } = await tierPriceList(request)
    let setInitial: initialValues = {}
    if (success && _.get(result, "data[0]")) {
      setInitial = {
        name: result.data[0].name,
        tier_prices: result.data[0].tier_prices,
        total_district: result.data[0].total_district,
        total_province: result.data[0].total_province,
        total_sub_district: result.data[0].total_sub_district,
      }

      if (_.get(result, "data[0].tier_locations")) {
        const map1 = result.data[0].tier_locations.map((x: any) => x.district_id)
        let subDistrict = await fetchSubDistrictByParam(0, map1)
        let dataDefault: any
        let dataDefaults: any = []
        let location_type: string = ""
        if (_.get(result, "data[0].tier_locations[0].location_type") == "province") {
          setAllCityLocation(true)
          setInitial.all_city = true
          location_type = "district"
        }

        result.data[0].tier_locations.forEach((element: any) => {
          let sub_district_option: any = _.filter(subDistrict, function (obj) {
            if (obj.city == element.district_id) {
              return true;
            }
          });

          var sub_district_selected = element.sub_district_id.substring(1, element.sub_district_id.length - 1).split("|").map((str: any) => Number(str))

          dataDefault = {
            province: element.province_data.name,
            province_data: element.province_data,
            province_id: element.province_id,
            city: element.district_data.name,
            city_data: element.district_data,
            city_id: element.district_id,
            location_type: location_type || element.location_type,
            sub_district: [],
            sub_district_option: sub_district_option,
            sub_district_selected: (sub_district_selected[0] !== 0 ? sub_district_selected : []),
            name: Math.floor(Math.random() * 1000).toString()
          }
          dataDefaults.push(dataDefault)
        });
        setMockData(dataDefaults)
        setColumn(
          [{
            title: 'แขวง',
            dataIndex: 'sub_district',
            align: 'center',
            render: (text: any, record: any) => {
              return (<Field
                key={record.id}
                component={Select}
                mode="multiple"
                className="form-control round"
                onChange={async (value: number[], info: any, city_id: number = record.city_id) => {
                  let index = _.findIndex(dataDefaults, (e: any) => {
                    return e.city_id == city_id;
                  }, 0);
                  if (value.length !== 0) {
                    //renew selected list
                    dataDefaults[index].sub_district_selected = value
                    //check location_type
                    if (dataDefaults[index].sub_district_option.length !== value.length) {
                      dataDefaults[index].location_type = "sub_district"
                    } else {
                      dataDefaults[index].location_type = "district"
                    }
                    setMockData([...dataDefaults])
                  }
                  else {
                    showDeleteConfirm(dataDefaults[index].city, index, dataDefaults)
                  }
                }}
                selectOption={record.sub_district_option}
                value={record.sub_district_selected}
                name={record.name}
              />)
            },
          }, {
            title: '',
            dataIndex: '',
            align: 'center',
            render: (text: any, record: any) => {
              return (<DeleteOutlined onClick={(e: any) => {
                let index = _.findIndex(dataDefaults, (e: any) => {
                  return e.city_id == record.city_id;
                }, 0);
                dataDefaults.splice(index, 1);
                setMockData([...dataDefaults])
              }} />)
            }
          }
          ]
        )
      }
      if (_.get(result, "data[0].tier_locations[0].province_id")) {
        setInitial.province_id = result.data[0].tier_locations[0].province_id
        setParams({ sub_district_id: undefined, district_id: undefined, province_id: String(result.data[0].tier_locations[0].province_id) })
        await fetchCity(result.data[0].tier_locations[0].province_id)
      }
    }
    setInitialValues(setInitial)
    setDeliveryFeeRuleCount(result.data[0].tier_prices.length)
  }

  const showDeleteConfirm = (districtName: string, rowIndex: any, data: any[] = []) => {
    confirm({
      title: 'ยืนยันการลบ เขต',
      icon: <ExclamationCircleOutlined />,
      content: `คุณต้องการลบเขต ${districtName} ใช่ไหม`,
      okText: 'ลบ',
      okType: 'danger',
      cancelText: 'ยกเลิก',
      onOk() {
        data.splice(rowIndex, 1);
        setMockData([...data])
      }
    });
  };

  const column = [
    {
      title: 'จังหวัด',
      dataIndex: 'province',
      align: 'center',
    },
    {
      title: 'เขต',
      dataIndex: 'city',
      align: 'center',
    },
    ...selectColumn
  ]

  useEffect(() => {
    fetchProvince()
    if (id) {
      getTierPriceDetail()
    }
    return () => {
      setProvinceList([])
      setCityList([])
      setSubDistrictList([])
      setSubDistrciData([])
    }
  }, [id])

  return (
    <MainLayout>
      <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={Schema} enableReinitialize={true}>
        {({ values, resetForm, setFieldValue }) => (
          <Form>
            <Row justify="space-around" align="middle">
              <Col span={8}>
                <Title level={4}>Config Delivery Fee</Title>
                <Breadcrumb style={{ margin: '16px 0' }}>
                  <Breadcrumb.Item>ค่าส่งตามระยะทาง</Breadcrumb.Item>
                  <Breadcrumb.Item>ค่าส่งตามระยะทางทั้งหมด</Breadcrumb.Item>
                </Breadcrumb>
              </Col>
              <Col span={8} offset={4} style={{ textAlign: 'end' }}></Col>
              <Col className="gutter-row" span={4} style={{ textAlign: 'end' }}>
                <Button
                  style={{ width: '120px', marginTop: '31px' }}
                  type="primary"
                  size="middle"
                  htmlType="submit"
                >
                  บันทึก
                </Button>
              </Col>
            </Row>
            <Card>
              <Row gutter={24}>
                <Col className="gutter-row" span={24}>
                  <Field
                    label={{ text: "ชื่อ Tier Price" }}
                    name="name"
                    type="text"
                    component={Input}
                    rows={2}
                    className="form-control round"
                    id="name" />
                </Col>

                <Col className="gutter-row" span={24}
                  style={{
                    borderTop: "2px solid #f2f2f2",
                    paddingTop: "15px",
                    paddingBottom: "15px"
                  }}>
                  {renderDeliveryFeeRule(values, setFieldValue)}
                  <Row gutter={16}>
                    <Button
                      style={{ width: '100px', marginBottom: '10px', marginLeft: '10px' }}
                      size="middle"
                      onClick={() => handleAddDeliveryFeeRule(values, setFieldValue)}
                      onBlur={() => {
                        setDeliveryFeeRuleValidate(false)
                      }}
                    >
                      เพิ่ม Rule
                    </Button>
                  </Row>
                </Col>
                <Col className="gutter-row" span={24}
                  style={{
                    borderTop: "2px solid #f2f2f2",
                    paddingTop: "15px",
                    paddingBottom: "15px"
                  }}>
                </Col>
                <span>พื้นที่ใช้งาน<span style={{ color: "red" }}>(สามารถระบุได้ 1 จังหวัดเท่านั้น)</span></span>

                <Col span={24}>
                  <Field
                    onChange={
                      async (value: number) => {
                        setParams({ ...params, sub_district_id: undefined, district_id: undefined, province_id: String(value) })

                        if (setFieldValue) {
                          setFieldValue("province_id", value)
                          setFieldValue("all_city", false)
                          setFieldValue('district_id', null)
                          setFieldValue('sub_district_id', [])
                        }
                        await fetchCity(value)
                      }}
                    component={Select}
                    className="form-control round"
                    label={{ text: 'จังหวัด' }}
                    placeholder="เลือกจังหวัด"
                    name="province_id"
                    selectOption={provinceList}
                  />
                </Col>
                <Col className="gutter-row" span={24}>
                  <div style={{}}>
                    <Field
                      label={{ text: "ครอบคลุมพื้นที่ทั้งจังหวัด" }}
                      name="all_city"
                      component={CheckBox2}
                      disabled={!params.province_id}
                      onChange={(e: any) => {
                        let value = e.target.checked
                        setAllCityLocation(value)
                        setFieldValue("all_city", value)
                        setParams({ ...params, sub_district_id: undefined, district_id: undefined })
                        setFieldValue('district_id', null)
                        setFieldValue('sub_district_id', [])
                      }}
                      className="form-control round"
                      id="all_city"
                    />
                  </div>
                </Col>
                <Col span={12}>
                  <Field
                    disabled={(!params.province_id || values.all_city) && cityList}
                    onChange={async (value: number) => {
                      setParams({ ...params, sub_district_id: undefined, district_id: String(value) })
                      if (setFieldValue) {
                        setFieldValue('district_id', value)
                        setFieldValue('sub_district_id', [])
                      }
                      await fetchSubDistrict(value)
                    }}
                    component={Select}
                    className="form-control round"
                    label={{ text: 'เขต/อำเภอ' }}
                    placeholder="เลือกเขต/อำเภอ"
                    name="district_id"
                    selectOption={cityList}
                  />
                </Col>
                <Col span={12}>
                  <Field
                    onChange={async (value: number) => {
                      setParams({ ...params, sub_district_id: String(value) })
                      if (setFieldValue) {
                        setFieldValue('sub_district_id', value)
                      }
                    }}
                    component={Select}
                    disabled={(!params.district_id || values.all_city) && subDistrictList}
                    mode="multiple"
                    className="form-control round"
                    label={{ text: 'แขวง/ตำบล' }}
                    placeholder="เลือก แขวง/ตำบล ทั้งหมด"
                    name="sub_district_id"
                    selectOption={subDistrictList}
                  />
                </Col>
              </Row>
              <Row gutter={16}>
                <Button
                  style={{ width: '120px', marginBottom: '10px', marginLeft: '10px' }}
                  size="middle"
                  disabled={!values.all_city && !params.district_id}
                  onClick={handleAddlocation}
                >
                  + เพิ่มพื้นที่ใช้งาน
                </Button>
                <Button
                  style={{ width: '120px', marginBottom: '10px', marginLeft: '10px' }}
                  size="middle"
                  disabled={!(mockData.length > 0)}
                  onClick={handleClaerlocation}
                >
                  เคลียร์
                </Button>
              </Row>
              {showError && renderErrorMessage(values, setFieldValue)}
              <Table
                config={{
                  dataTableTitle: 'รายการพื้นที่ใช้งานที่เพิ่ม',
                  loading: false,
                  tableName: 'config',
                  tableColumns: column,
                  dataSource: mockData,
                  handelDataTableLoad: [],
                  pagination: false,
                  isShowRowNumber: true
                }}
              />

            </Card>
          </Form>
        )}
      </Formik>
    </MainLayout>
  )
}

