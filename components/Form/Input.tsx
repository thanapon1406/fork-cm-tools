import { ErrorMessage } from 'formik'
import { Input, Form } from 'antd';
import { FormikProps } from './props'
import { Typography } from 'antd';
const { Text } = Typography;

interface InputProps extends FormikProps {
    id: string | undefined
    type: string
    className: string | undefined
    placeholder: string | undefined
    autoComplete: string | undefined
    label: {
        text: string | undefined
        className: string
    }
}

const CustomInput = ({ label, field, ...props }: InputProps) => {
    const handleChange = (e: any) => {
        let value = e?.target?.value
        props.form.setFieldValue(field.name, value)
    }

    return (
        <>
            {label?.text != undefined &&
                <label htmlFor={field.name} className={label.className}>{label.text}</label>
            }
            <Input
                id={props.id}
                type={props.type}
                name={field.name}
                className={props.className}
                placeholder={props.placeholder}
                onChange={handleChange}
                autoComplete={props.autoComplete}
            />
            <Text type="danger">
                <div style={{ minHeight: "25px" }}>
                    <ErrorMessage
                        name={field.name}
                        component="div"
                        className="validate-error"
                    />
                </div>
            </Text>
        </>
    )
}

export default CustomInput