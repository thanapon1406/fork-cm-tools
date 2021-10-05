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

export default function DateRangePicker({
  label,
  field,
  ...props
}: Props): ReactElement {
  let defaultValue: any;

  if (field.value?.start && field.value?.end) {
    defaultValue = [moment(field.value.start), moment(field.value.end)];
  }else{
    defaultValue=null
  }

  const handleChange = (e:any):void => {
    let value: any = {
      start: "",
      end: "",
    };
    if (e) {
      value.start = e[0].startOf('day').format();
      value.end = e[1].endOf('day').format()
    }
    props.form.setFieldValue(field.name, value);
  };

  return (
    <div className="ant-form ant-form-vertical">
      <Form.Item label={label?.text}>
        {/* {label?.text != undefined &&
                <label htmlFor={field.name} className={label.className}>{label.text}</label>
            } */}
        <RangePicker
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
