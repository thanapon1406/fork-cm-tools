import CustomSelect from '@/components/SelectOutlet';
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Checkbox, Col, Divider, Modal, Row } from 'antd';
import { Field, FieldArray } from 'formik';
import { forEach, get, isEmpty, size } from 'lodash';

const { confirm } = Modal;

interface Props {
  setFieldValue: any;
  userSelectedOutlet: any;
  brandList: any;
  handleChange: any;
  formValue: any;
  disabled: any;
  selectedList: any;
  isEdit: boolean;
}

export default function OutletSelecter({
  setFieldValue,
  userSelectedOutlet,
  brandList,
  handleChange,
  formValue,
  disabled,
  selectedList = [],
  isEdit,
}: Props) {
  return (
    <Row gutter={{
      xs: 24,
      sm: 24,
      md: 24,
      lg: 24
    }}>
      {!isEmpty(brandList) && (
        <FieldArray
          name="brands"
          render={(arrayHelpers) => (
            <>
              {brandList.map((brand: any, index: any) => (
                <>
                  {index > 0 && index % 2 === 0 && <Divider />}
                  <Col key={`brand-${index}`} className="gutter-row" xs={24} sm={24} md={12} lg={12} >
                    <div className="col">
                      <div>
                        <Field
                          name={`brands.${index}.id`}
                          type="hidden"
                          value={brand.id}
                        />
                        {/* <label className="control-inline fancy-checkbox"> */}
                        <Checkbox
                          name={`brands.${index}.is_selected`}
                          disabled={disabled}
                          checked={get(formValue, `brands.${index}.is_selected`)}
                          onChange={() => {
                            if (isEdit) {
                              confirm({
                                title: 'มีการเปลี่ยนแปลงจำนวนร้านค้า',
                                icon: <ExclamationCircleOutlined />,
                                content: `ต้องการยืนยันหรือไม่`,
                                okText: 'ตกลง',
                                okType: 'danger',
                                cancelText: 'ยกเลิก',
                                onOk() {
                                  let isChecked = !get(formValue, `brands.${index}.is_selected`)
                                  setFieldValue(`brands.${index}.id`, brand.id)
                                  setFieldValue(`brands.${index}.is_selected`, isChecked)
                                  if (isChecked) {
                                    setFieldValue(`brands.${index}.type`, "all")
                                    setFieldValue(`brands.${index}.outlets`, [])
                                  }
                                }
                              })
                            } else {
                              let isChecked = !get(formValue, `brands.${index}.is_selected`)
                              setFieldValue(`brands.${index}.id`, brand.id)
                              setFieldValue(`brands.${index}.is_selected`, isChecked)
                              if (isChecked) {
                                setFieldValue(`brands.${index}.type`, "all")
                                setFieldValue(`brands.${index}.outlets`, [])
                              }
                            }

                          }}> <span> {brand.name.th} <span className="display-none">({brand.id})</span></span>
                        </Checkbox>
                        {/* <Field
                            name={`brands.${index}.is_selected`}
                            type="checkbox"
                            disabled={disabled}
                            onChange={() => {
                              let isChecked = !get(formValue, `brands.${index}.is_selected`)
                              setFieldValue(`brands.${index}.id`, brand.id)
                              setFieldValue(`brands.${index}.is_selected`, isChecked)
                              if (isChecked) {
                                setFieldValue(`brands.${index}.type`, "all")
                                setFieldValue(`brands.${index}.outlets`, [])
                              }
                            }}
                          />
                          <span> {brand.name.th} <span className="display-none">({brand.id})</span></span> */}
                        {/* </label> */}
                      </div>
                      {get(formValue, `brands.${index}.is_selected`) &&
                        <div style={{ marginLeft: 20 }}>
                          <div style={{ marginTop: 10 }}>
                            <div>
                              <label className="fancy-radio custom-color-green">
                                <Field
                                  disabled={disabled}
                                  type="radio"
                                  name={`brands.${index}.type`}
                                  value="all"
                                  onChange={(e: any) => {
                                    isEdit && console.log(`brands.${index}.type`)

                                    if (isEdit) {
                                      confirm({
                                        title: 'มีการเปลี่ยนแปลงจำนวนร้านค้า',
                                        icon: <ExclamationCircleOutlined />,
                                        content: `ต้องการยืนยันหรือไม่`,
                                        okText: 'ตกลง',
                                        okType: 'danger',
                                        cancelText: 'ยกเลิก',
                                        onOk() {
                                          setFieldValue(`brands.${index}.type`, "all")
                                          setFieldValue(`brands.${index}.outlets`, [])
                                        }
                                      })
                                    } else {
                                      setFieldValue(`brands.${index}.type`, "all")
                                      setFieldValue(`brands.${index}.outlets`, [])
                                    }
                                  }}
                                />
                                <span>
                                  <i></i> ทุกสาขา{' '}
                                </span>
                              </label>
                            </div>
                            {size(get(brand, 'outlets')) > 0 &&
                              <label className="fancy-radio custom-color-green">
                                <Field
                                  disabled={disabled}
                                  type="radio"
                                  name={`brands.${index}.type`}
                                  value="specific"
                                />
                                <span>
                                  <i></i> เลือกสาขา{' '}
                                </span>
                              </label>
                            }
                          </div>
                          <div key={`outlet${index}`} style={{ marginTop: 10 }}>
                            <Field
                              customChange={(newValue: any) => {
                                let fieldName = `brands.${index}.outlets`

                                if (newValue.includes('all')) {
                                  let outletList: any = []
                                  forEach(brand.outlets, (item) => {
                                    outletList.push(item.id)
                                  })
                                  setFieldValue(fieldName, outletList)
                                } else if (size(newValue) === 0) {
                                  setFieldValue(fieldName, [])
                                } else {
                                  setFieldValue(fieldName, newValue)
                                }


                              }}
                              isDisabled={disabled || (get(formValue, `brands.${index}.type`) == "all")}
                              name={`brands.${index}.outlets`}
                              key={`brands.${index}.outlets`}
                              brandId={brand.id}
                              brandList={brandList}
                              isEdit={isEdit}
                              optionList={brand.outlets}
                              selectedList={() =>
                                selectedList(userSelectedOutlet, brand.outlets, brand.id)
                              }
                              component={CustomSelect}
                            />
                          </div>
                        </div>
                      }
                    </div>
                  </Col>
                </>
              ))}
            </>
          )
          }
        />
      )}
    </Row >
  )
}

