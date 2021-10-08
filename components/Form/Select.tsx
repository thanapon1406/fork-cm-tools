import React, { ReactElement } from 'react'
import { Select as Selects, Typography, Form } from 'antd'
import { FormikProps } from './props'
import { ErrorMessage } from 'formik'
const { Text } = Typography
const { Option } = Selects

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
}

interface SelectOption {
  name: string
  value: string
  disabled: boolean
}

function Select({ label, field, selectOption, ...props }: Props): ReactElement {
  const handleChange = (e: any) => {
    let value = e
    props.form.setFieldValue(field.name, value)
  }
  const onChangeHandle = () => {
    if (props.onChange) {
      return props.onChange
    } else {
      return handleChange
    }
  }

  return (
    <div className="ant-form ant-form-vertical">
      <Form.Item label={label?.text}>
        <Selects {...field} {...props} onChange={onChangeHandle()}>
          {selectOption.map((val: SelectOption) => {
            return (
              <Option disabled={val.disabled} key={val.value} value={val.value}>
                {val.name}
              </Option>
            )
          })}
        </Selects>
        <Text type="danger">
          <div>
            <ErrorMessage name={field.name} component="div" className="validate-error" />
          </div>
        </Text>
      </Form.Item>
    </div>
  )
}

export default Select
