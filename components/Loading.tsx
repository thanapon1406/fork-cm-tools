import React, { ReactChildren } from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

interface Props {
    isLoading: boolean;
    children: ReactChildren
}

export default function Loading({ isLoading, children }: Props) {
    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

    return (
        <Spin indicator={antIcon} spinning={isLoading}>
            {children}
        </Spin>
    );
}
