import { DatePicker as DatePickers, Form, Typography } from "antd";
import { ErrorMessage } from "formik";
import moment from "moment";
import React, { ReactElement } from "react";
import { FormikProps } from "./props";
const { RangePicker } = DatePickers;
const { Text } = Typography;

interface Props extends FormikProps {
  id: string | undefined;
  type: string;
  className: string | undefined;
  placeholder: string | undefined;
  autoComplete: string | undefined;
  label: {
    text: string | undefined;
    className: string;
  };
}

export default function DatePicker({
  label,
  field,
  ...props
}: Props): ReactElement {
  if (field.value) {
    field.value = moment(field.value);
  }

  const handleChange = (e: any) => {
    let value: string = "";
    if (e) {
      value = e.format();
    }
    props.form.setFieldValue(field.name, value);
  };

  return (
    <div className="ant-form ant-form-vertical">
      <Form.Item label={label?.text}>
        {/* {label?.text != undefined &&
                <label htmlFor={field.name} className={label.className}>{label.text}</label>
            } */}
        <DatePickers
          style={{ width: "100%" }}
          {...field}
          {...props}
          name={field.name}
          onChange={handleChange}
        />

        <Text type="danger">
          <div >
            <ErrorMessage
              name={field.name}
              component="div"
              className="validate-error"
            />
          </div>
        </Text>
      </Form.Item>
    </div>
  );
}
