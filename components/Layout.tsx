import { Layout } from 'antd';
const { Content } = Layout;

type Props = {
};
const CustomLayout: React.FC<Props> = ({
  children,
}) => (
  <Layout>
    <Content>
      {children}
    </Content>
  </Layout>
);

export default CustomLayout