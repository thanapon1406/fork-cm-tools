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
    authToken = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiIxIiwiZXhwIjoxNjMzNTAyMjYwLCJqdGkiOiIyZjBlZmZlMi0wNjc3LTQ0Y2MtOWE3Ni1hNjQ5YTZlY2RlYTEiLCJpYXQiOjE2MzM0MTU4NjAsImlzcyI6IkZ1bGwgVGVhbSBTbWFydCBQT1MiLCJuYmYiOjE2MzM0MTU4NjAsInN1YiI6IjEiLCJlbWFpbCI6InRoYW5ha3JpdC5uYXdAZnVsbHRlYW0udGVjaCIsIm5hbWUiOiLguIvguKHguIvguLLguJnguYDguJfguIQiLCJsYXN0X25hbWUiOiLguYDguJfguITguYLguJnguYLguKXguKLguLUiLCJ0eXBlIjoiY21zIiwicGVybWlzc2lvbnMiOm51bGwsImRhdGEiOnsiYnJhbmRfY29kZSI6IiIsImJyYW5kX2lkIjowLCJvdXRsZXRfY29kZSI6IiIsIm91dGxldF9pZCI6MCwidGVybWluYWxfY29kZSI6IiIsInRlcm1pbmFsX2lkIjowLCJ1c2VyX2ZpcnN0X25hbWUiOiLguIvguKHguIvguLLguJnguYDguJfguIQiLCJ1c2VyX2xhc3RfbmFtZSI6IuC5gOC4l-C4hOC5guC4meC5guC4peC4ouC4tSIsInVzZXJfdHlwZSI6InN1cGVyYWRtaW4ifX0.j0dLeIefZPGnbGyTWbV7LXEhblfWapattTnw5W5ERNsCwd1PpDfBNqOjHde2PhZeusNfFwYB8g2-UGzsg1E_C19V294Hf63UgrGu9d7J4jR36-kKnJUv-1Ex0aPZuCo3EvrXYxSmifedMyFarPOnWYGbntu4YxQ2nL0LV6DA8kX8NzKWEpDzASwKmgFne1jKhKGJNhd0rdCJarkgWQLhozFLYoudLPpocZQnK6Z7VxC3hBSEQX6Rf9ia-GLp3QSrUIsQa9kkKBUc-i9uSREcRNgvS4JJOSj3qkIAueWgcGQCg-rgCt1iDIZdzdugk3C4Bs0By-_mjpEV7huBEI3xPA"
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
