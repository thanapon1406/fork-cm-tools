import React, { ReactElement } from "react";
import { Dropdown, Menu, Button, PageHeader, Table as Tables } from "antd";
import { uniqueId } from "@/utils/helpers";
import { useRouter } from "next/router";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";

interface Props {
  config: Config;
}

interface Config {
  dataTableTitle: string;
  tableColumns: Array<any>;
  dataSource: Array<any>;
  tableName: string;
  action?: Array<"view" | "edit" | "delete">;
  loading: boolean;
  handelDataTableLoad: any;
  pagination: any;
}

export default function Table({ config }: Props): ReactElement {
  const { dataTableTitle, action, dataSource, loading, tableName, handelDataTableLoad } = config;
  let { tableColumns, pagination } = config;
  const Router = useRouter();
  if (action) {
    const View = (path: any) => {
      Router.push(`/${tableName}/view?id=87`);
    };
    const Edit = () => {};
    const Delete = () => {};
    const actionElement = (
      <Menu style={{ width: 130 }}>
        {action.map((action) => {
          if (action === "view") {
            return (
              <Menu.Item
                key={`${uniqueId()}`}
                icon={<EyeOutlined />}
                onClick={View}
              >
                View
              </Menu.Item>
            );
          }

          if (action === "edit") {
            return (
              <Menu.Item
                key={`${uniqueId()}`}
                icon={<EditOutlined />}
                onClick={Edit}
              >
                Edit
              </Menu.Item>
            );
          }

          if (action === "delete") {
            return (
              <Menu.Item
                key={`${uniqueId()}`}
                icon={<DeleteOutlined />}
                onClick={Delete}
              >
                Delete
              </Menu.Item>
            );
          }
          return;
        })}
      </Menu>
    );
    tableColumns = [
      ...tableColumns,
      {
        title: "",
        render: (row: any) => {
          if (action.length === 1) {
            return actionElement;
          } else {
            return (
              <Dropdown overlay={actionElement} trigger={["click"]}>
                <EllipsisOutlined
                  style={{ cursor: "pointer", fontSize: "24px" }}
                />
              </Dropdown>
            );
          }
        },
      },
    ];
  }

  return (
    <>
      <PageHeader title={dataTableTitle} ghost={false}></PageHeader>
      <Tables
        columns={tableColumns}
        rowKey={(item) => item.id}
        dataSource={dataSource}
        pagination={pagination}
        loading={loading}
        onChange={handelDataTableLoad}
      />
    </>
  );
}
