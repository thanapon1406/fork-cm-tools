import { Select } from 'antd'
import React from 'react'
import styled from 'styled-components'
const { Option } = Select

const StyledSelect = styled(Select)`
  .ant-select-selector {
    color: #000 !important;
  }
  .ant-select-selection-search-input {
    color: #000 !important;
  }
`
interface Props {
  optionList: any;
  selectedList: any;
  brandId: any;
  brandList: any;
  isDisabled: any;
  onChange: any;
  field: any;
  form: any;
  customChange: any;
}

export default function CustomSelect({
  optionList = [],
  selectedList = [],
  brandId,
  brandList = [],
  isDisabled = false,
  onChange,
  field,
  form,
  ...props
}: Props) {
  const options = []
  const allValue: any = []
  brandList.forEach((element: any) => {
    let outlet = []

    const outletEle: any = element["outlets"]
    if (
      outletEle !== undefined &&
      outletEle !== 'undefined' &&
      outletEle.length > 0
    ) {
      outlet = outletEle.map((v: any) => v.id)
    }

    allValue[element["id"]] = outlet
  })

  options.push({
    className: 'outlet-select-class',
    label: 'เลือกทั้งหมด',
    value: 'all',
  })
  optionList.forEach((element: any) => {
    options.push({
      className: 'outlet-select-class',
      label: element["name"]["th"],
      value: element["id"],
    })
  })

  function handleChange(newValue: any, options: any) {
    if (newValue.includes('all') && newValue.length === allValue[brandId].length + 1) {
      form.setFieldValue(field.name, [])
    } else if (newValue.includes('all')) {
      form.setFieldValue(field.name, allValue[brandId])
      form.setFieldValue(`brands[${brandId}]`, `${brandId}`)
    } else {
      form.setFieldValue(field.name, newValue)
      form.setFieldValue(`brands[${brandId}]`, `${brandId}`)
    }

    if (typeof props.customChange == 'function') {
      props.customChange(newValue, options)
    }
  }

  return (
    <>
      <StyledSelect
        mode={'multiple'}
        style={{
          width: '100%',
        }}
        value={field.value}
        options={options}
        onChange={handleChange}
        placeholder={'เลือกสาขา'}
        maxTagCount={'responsive'}
        optionLabelProp={'label'}
        optionFilterProp={'label'}
        disabled={isDisabled}
      >
        <Option key="all" value="all">
          เลือกทั้งหมด
        </Option>
      </StyledSelect>
    </>
  );
}
