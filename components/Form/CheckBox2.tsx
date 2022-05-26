import { Checkbox as Checkboxs, Form, Typography } from 'antd'
import { ErrorMessage } from 'formik'
import React, { ReactElement } from 'react'
import { FormikProps } from './props'
const { Text } = Typography

interface Props extends FormikProps {
  id: string | undefined
  type: string
  className: string | undefined
  placeholder: string | undefined
  autoComplete: string | undefined
  label: {
    text: string | undefined
    className: string
  }
  selectOption: Array<SelectOption>
  onChange?: any
  disabled?: boolean | false
}

interface SelectOption {
  name: string
  value: string
  disabled: boolean
}

function CheckBox({ label, field, selectOption, ...props }: Props): ReactElement {

  const handleChange = (e: any) => {
    let value = e.target.checked
    props.form.setFieldValue(field.name, value)
  }
  const onChangeHandle = (e: any) => {
    if (props.onChange) {
      return props.onChange
    } else {
      return handleChange(e)
    }
  }

  return (
    <div className="ant-form ant-form-vertical">
      {/* <Form.Item label={label?.text}> */}
      <Form.Item>
        <Checkboxs
          onChange={onChangeHandle}
          checked={field.value}
          disabled={props.disabled}
        >
          {label?.text}
        </Checkboxs>
        <Text type="danger">
          <div>
            <ErrorMessage name={field.name} component="div" className="validate-error" />
          </div>
        </Text>
      </Form.Item>
    </div>
  )
}

export default CheckBox
