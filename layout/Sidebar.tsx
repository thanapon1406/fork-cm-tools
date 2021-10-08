import { findUser, logout } from "@/services/login";
import { personState } from "@/store";
import {
  CarOutlined, DesktopOutlined, LogoutOutlined, PieChartOutlined, SettingOutlined, SolutionOutlined, TeamOutlined, UserOutlined
} from "@ant-design/icons";
import { Avatar, Dropdown, Layout, Menu, Space, Typography } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { ReactElement, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
const profileColor: Array<string> = [
  "87d068",
  "d06868",
  "c068d0",
  "6897d0",
  "cad068",
  "d09d68",
];

const { Text } = Typography


const { Sider } = Layout;
const { SubMenu } = Menu;
interface Props { }

export default function Sidebar({ }: Props): ReactElement {
  const Router = useRouter();
  const [avatarColor, setAvatarColor] = useState("87d068");
  const [userObject, setUserState] = useRecoilState(personState);
  const { asPath, pathname } = Router;
  let activePath = pathname.split("/")[1] || "dashboard";
  const logoutClick = () => {
    logout();
    Router.replace("/login");
  };

  useEffect(() => {
    findUserData();
  }, []);

  const findUserData = async () => {
    const { result, success } = await findUser();
    if (success) {
      const { firstname = "", lastname = "" } = result.data;
      const asciiCode = firstname.charCodeAt(0);
      setAvatarColor(profileColor[asciiCode % 6]);
      setUserState({
        username: `${firstname}  ${lastname}`,
      });
    }
  };

  const menu = (
    <Menu>
      <Menu.Item>
        <UserOutlined />
        Profile
      </Menu.Item>
      <Menu.Item onClick={() => logoutClick()}>
        <LogoutOutlined />
        logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Sider breakpoint="lg" collapsedWidth="0">
      <div className="logo" />
      <Space style={{ padding: "15px" }} size="middle">
        <Avatar shape="square" style={{ backgroundColor: `#${avatarColor}` }}>
          {" "}
          {userObject.username[0]?.toUpperCase()}
        </Avatar>
        {/* <Text type="warning">Welcome</Text> */}
        <Dropdown overlay={menu}>
          <Text type="warning">
            <Space>
              {userObject.username}
              {/* <CaretDownOutlined /> */}
              <SettingOutlined
                style={{ cursor: "pointer", fontSize: "17px" }}
              />
            </Space>
          </Text>
        </Dropdown>
      </Space>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={[activePath]}
        defaultOpenKeys={['']}
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
        {/* <Menu.Item key="consumer" icon={<TeamOutlined />}>
          <Link href="/consumer">
            <a> Consumer</a>
          </Link>
        </Menu.Item> */}

        <SubMenu
          key="consumerList"
          icon={<TeamOutlined />}
          title="User Consumer"
        >
          <Menu.Item key="consumer">
            <Link href="/consumer">Consumer Profile</Link>
          </Menu.Item>
        </SubMenu>

        <Menu.Item key="rider" icon={<CarOutlined />}>
          <Link href="/rider">
            <a> Rider</a>
          </Link>
        </Menu.Item>
        <SubMenu
          key="userProfile"
          icon={<TeamOutlined />}
          title="User Profile"
        >
          <Menu.Item key="riderProfile">
            <Link href="/userprofile/rider">Rider Profile</Link>
          </Menu.Item>
        </SubMenu>
        <Menu.Item key="ekyc" icon={<SolutionOutlined />}>
          <Link href="/ekyc">
            <a> E-KYC</a>
          </Link>
        </Menu.Item>
      </Menu>
    </Sider>
  )
}
