import { ErrorMessage } from "formik";
import { Input, Form } from "antd";
import { FormikProps } from "./props";
import { Typography } from "antd";
const { Text } = Typography;

interface InputProps extends FormikProps {
  id: string | undefined;
  type: string;
  className: string | undefined;
  placeholder: string | undefined;
  autoComplete: string | undefined;
  label: {
    text: string | undefined;
    className: string;
  };
  disabled:boolean | false;
}

const CustomInput = ({ label, field, ...props }: InputProps) => {
  const handleChange = (e: any) => {
    let value = e?.target?.value;
    props.form.setFieldValue(field.name, value);
  };

  return (
    <div className="ant-form ant-form-vertical">
      <Form.Item label={label?.text}>
        <Input
          id={props.id}
          type={props.type}
          name={field.name}
          className={props.className}
          value={field.value}
          placeholder={props.placeholder}
          onChange={handleChange}
          autoComplete={props.autoComplete}
          disabled={props.disabled}
        />
        <Text type="danger">
          <div>
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
};

export default CustomInput;
