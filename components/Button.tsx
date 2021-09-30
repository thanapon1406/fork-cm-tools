import React, { ReactElement } from 'react'
import { Button as Buttons } from 'antd'
type sizeType = Parameters<typeof Buttons>[0]['size'];
type ButtonType = Parameters<typeof Buttons>[0]['type'];

interface Props {
    htmlType?: "button" | "submit" | "reset" | undefined;
    type?: ButtonType;
    children: string | ReactElement;
    icon?: ReactElement;
    size?: sizeType;
    block?:any;
    style?:any;
    onClick?:any;
}


function Button({ children, type = "primary", htmlType, icon, size = "middle",...Props }: Props): ReactElement {
    return (
        <Buttons {...Props} type={type} htmlType={htmlType} icon={icon} size={size}>
            {children}
        </Buttons>
    )
}

export default Button
