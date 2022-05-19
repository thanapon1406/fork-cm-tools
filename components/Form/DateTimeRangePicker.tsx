import { DatePicker as DatePickers, Form, Typography } from "antd";
import { ErrorMessage } from "formik";
import { get } from "lodash";
import moment, { Moment } from "moment";
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
  minDate?: Moment;
  maxDate?: Moment;
  disabled?: boolean;
}

export default function DateTimeRangePicker({
  disabled,
  label,
  field,
  minDate,
  maxDate,
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
      start: get(props, `form.values.${field.name}.start`) ? get(props, `form.values.${field.name}.start`) : "",
      end: get(props, `form.values.${field.name}.end`) ? get(props, `form.values.${field.name}.end`) : "",
    };
    if (e) {
      value.start = dateString[0]//e[0].startOf('day').format();
      value.end = dateString[1]//e[0].endOf('day').format()
    } else {
      value.start = ""
      value.end = ""
    }
    props.form.setFieldValue(field.name, value);
  };

  const disabledDate = (d: Moment) => {
    if (!d) {
      return false;
    }
    return (
      (minDate != null && d.isBefore(minDate) && !d.isSame(minDate, 'day')) ||
      (maxDate != null && d.isAfter(maxDate) && !d.isSame(maxDate, 'day'))
    );
  }

  return (
    <div className="ant-form ant-form-vertical">
      <Form.Item label={label?.text}>
        <RangePicker
          disabled={disabled}
          showTime={{ format: 'HH:mm' }}
          format="YYYY-MM-DD HH:mm"
          value={defaultValue}
          style={{ width: "100%" }}
          name={field.name}
          onChange={handleChange}
          onCalendarChange={handleChange}
          disabledDate={disabledDate}
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
