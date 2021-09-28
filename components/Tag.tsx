import React, { ReactElement } from "react";
import { Tag as Tags, Divider } from "antd";

interface Props {
  type?: string;
  children: string | ReactElement;
}

export default function Tag({
  children,
  type = "primary",
}: Props): ReactElement {
    const mapping:any = {
        "primary":"#17c2d",
        "success":"success",
        "error":"error",
        "warning":"warning",
    }
    const color = mapping[type] ||  type
  return <Tags color={color}>{children}</Tags>;
}
