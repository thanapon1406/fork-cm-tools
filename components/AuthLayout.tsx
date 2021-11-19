import { Col, Layout, Row } from 'antd';
const { Content } = Layout;

type Props = {
};
const AuthLayout: React.FC<Props> = ({
  children,
}) => (
  <Layout>
    <Content>
      <Row justify="center" align="middle" style={{ height: "100vh" }}>
        <Col span={24} style={{ textAlign: "center" }}>
          {children}
        </Col>
      </Row>
    </Content>
  </Layout>
);

export default AuthLayout