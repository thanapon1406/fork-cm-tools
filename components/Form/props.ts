interface FormikProps {
    field: {
        name: string
        value: any
        onChange: any
        onBlur: any
    },
    form: {
        values: { [field: string]: any }
        errors: { [field: string]: any }
        initialValues: object
        setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void
        setFieldError: (field: string, errorMsg: string) => void
        isValid: boolean
        isValidating: boolean
        isSubmitting: boolean
        dirty: boolean
        touched: { [field: string]: any }
    }
}

export type {
    FormikProps
}