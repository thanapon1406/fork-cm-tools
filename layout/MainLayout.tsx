import React, { ReactElement } from "react";
import Router, { useRouter } from "next/router";
import HeaderContent from "./HeaderContent";
import Sidebar from "./Sidebar";
import Head from "next/head";

import { Layout, Breadcrumb } from "antd";
const { Header, Content, Footer, Sider } = Layout;

interface Props {
  children: any;
}

export default function MainLayout({ children }: Props) {
  const router = useRouter();
  let authToken: any = false;
  if (typeof window !== "undefined") {
    authToken = localStorage.getItem("token");
    if (!authToken) {
      Router.replace("/login");
      return <></>;
    }
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Head>
        <title>CM Tool</title>
      </Head>
      <Sidebar />
      <Layout className="site-layout">
        <HeaderContent />
        <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            {/* <Breadcrumb.Item>User</Breadcrumb.Item>
                        <Breadcrumb.Item>Bill</Breadcrumb.Item> */}
          </Breadcrumb>
          {children}
        </Content>
        <Footer style={{ textAlign: "center" }}>Footer Layout</Footer>
      </Layout>
    </Layout>
  );
}
