import React, { ReactElement } from "react";
import { Layout, Menu, Avatar, Dropdown, Typography, Space } from "antd";

const { Text } = Typography;

import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  PieChartOutlined,
  DesktopOutlined,
} from "@ant-design/icons";
const { Sider } = Layout;
const { SubMenu } = Menu;
import Link from "next/link";
import { useRouter } from "next/router";
interface Props {}

export default function Sidebar({}: Props): ReactElement {
  const Router = useRouter();
  const { asPath, pathname } = Router
  let activePath = pathname.split("/")[1] || "dashboard";
  const logout= ()=>{
    console.log(`logout`)
    Router.replace("/login")
  }
  const menu = (
    <Menu>
      <Menu.Item>
        <UserOutlined />
        Profile
      </Menu.Item>
      <Menu.Item onClick={()=>logout()}>
        <LogoutOutlined />
        logout
      </Menu.Item>
    </Menu>
  );
  return (
    <Sider breakpoint="lg" collapsedWidth="0">
      <div className="logo" />
      <Space style={{ padding: "15px" }}>
        <Avatar style={{ backgroundColor: "#87d068" }}>A</Avatar>
        <Dropdown overlay={menu}>
          <Text type="warning">
            Anukoon{" "}
            <SettingOutlined style={{ cursor: "pointer", fontSize: "18px" }} />
          </Text>
        </Dropdown>
      </Space>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={[activePath]}
        defaultOpenKeys={[""]}
        style={{ borderRight: 0 }}
      >
        <Menu.Item key="dashboard" icon={<PieChartOutlined />}>
          <Link href="/">
            <a> Dashboard</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="merchant" icon={<DesktopOutlined />}>
          <Link href="/merchant">
            <a> Merchant</a>
          </Link>
        </Menu.Item>
        {/* <SubMenu key="sub1" icon={<UserOutlined />} title="subnav 1">
          <Menu.Item key="1">option1</Menu.Item>
          <Menu.Item key="2">option2</Menu.Item>
          <Menu.Item key="3">option3</Menu.Item>
          <Menu.Item key="4">option4</Menu.Item>
        </SubMenu> */}
      </Menu>
    </Sider>
  );
}
