import React, { ReactElement } from "react";
import { DatePicker as DatePickers, Typography, Form } from "antd";
const { RangePicker } = DatePickers;
import { FormikProps } from "./props";
import moment from "moment";
const { Text } = Typography;
import { ErrorMessage } from "formik";

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

export default function DateTimeRangePicker({
  label,
  field,
  ...props
}: Props): ReactElement {
  let defaultValue: any;

  if (field.value?.start && field.value?.end) {
    defaultValue = [moment(field.value.start), moment(field.value.end)];
  } else {
    defaultValue = null
  }

  const handleChange = (e: any, dateString: any): void => {
    let value: any = {
      start: "",
      end: "",
    };
    if (e) {
      value.start = dateString[0]//e[0].startOf('day').format();
      value.end = dateString[1]//e[0].endOf('day').format()
    }
    props.form.setFieldValue(field.name, value);
  };

  return (
    <div className="ant-form ant-form-vertical">
      <Form.Item label={label?.text}>
        <RangePicker
          showTime={{ format: 'HH:mm' }}
          format="YYYY-MM-DD HH:mm"
          value={defaultValue}
          style={{ width: "100%" }}
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
