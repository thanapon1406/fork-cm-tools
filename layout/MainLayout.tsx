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
    authToken = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiIxIiwiZXhwIjoxNjMzNTg4OTk5LCJqdGkiOiJmMjBlYzFkNC05YjIwLTRhNWQtYmRjNS01NDU0Njk4NWJhZTMiLCJpYXQiOjE2MzM1MDI1OTksImlzcyI6IkZ1bGwgVGVhbSBTbWFydCBQT1MiLCJuYmYiOjE2MzM1MDI1OTksInN1YiI6IjEiLCJlbWFpbCI6InRoYW5ha3JpdC5uYXdAZnVsbHRlYW0udGVjaCIsIm5hbWUiOiLguIvguKHguIvguLLguJnguYDguJfguIQiLCJsYXN0X25hbWUiOiLguYDguJfguITguYLguJnguYLguKXguKLguLUiLCJ0eXBlIjoiY21zIiwicGVybWlzc2lvbnMiOm51bGwsImRhdGEiOnsiYnJhbmRfY29kZSI6IiIsImJyYW5kX2lkIjowLCJvdXRsZXRfY29kZSI6IiIsIm91dGxldF9pZCI6MCwidGVybWluYWxfY29kZSI6IiIsInRlcm1pbmFsX2lkIjowLCJ1c2VyX2ZpcnN0X25hbWUiOiLguIvguKHguIvguLLguJnguYDguJfguIQiLCJ1c2VyX2xhc3RfbmFtZSI6IuC5gOC4l-C4hOC5guC4meC5guC4peC4ouC4tSIsInVzZXJfdHlwZSI6InN1cGVyYWRtaW4ifX0.AQZK7fqR1H4wlvYV9DzqLSEse7jVEClxj69eK-R_M1fv2KQ3trk6KVxQKINV2pw82s-SZ0sEQPh2QYabbkvfFl0FYFQWhkzuhVQvmZ9jnbdpJSJQ45ji7ZZwBr8CBO6vRoWRgr5fEODiN6GwtH9qsh4glGUtCReuW87muY7aKtqdCS86eWCmPpUuuOAflF4WbMJ5mVIes8J-PwVQKG7XQc6may5fx9TpSEmZ38pcacfMZB7J3N-MrFnIHUmPIySlY67zykNVq_D6FJdqkMfd796sk0AZfTFjThiL2k3aISuk0cUML81rtADJCzkuD85weTf7csGGBJ8q-zhZ-Jl4Bg"
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
          {children}
        </Content>
        <Footer style={{ textAlign: "center" }}>Footer Layout</Footer>
      </Layout>
    </Layout>
  );
}
