import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Modal, Select } from 'antd';
import styled from 'styled-components';
const { Option } = Select
const { confirm } = Modal;

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
  isEdit: boolean;
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
  isEdit,
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

  const handleChange = (isEdit: boolean) => async (newValue: any, options: any) => {
    // console.log("isEdit: ", isEdit)
    if (isEdit) {
      confirm({
        title: 'มีการเปลี่ยนแปลงจำนวนร้านค้า',
        icon: <ExclamationCircleOutlined />,
        content: `ต้องการยืนยันหรือไม่`,
        okText: 'ตกลง',
        okType: 'danger',
        cancelText: 'ยกเลิก',
        onOk() {
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
            // console.log(options)
            props.customChange(newValue, options)
          }
        }
      })

    } else {
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
        // console.log(options)
        props.customChange(newValue, options)
      }
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
        onChange={handleChange(isEdit)}
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
