import React, { useState } from "react";

import { Layout, Avatar, Menu, Dropdown, Button, Drawer } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import Sidebar from './Sidebar'

const { Header } = Layout;

export default function HeaderContent() {
  const [visible, setVisible] = useState(false);
  return (
    <Header
      className="site-layout-sub-header-background"
      style={{ padding: 0}}
    >
    </Header>
  );
}
