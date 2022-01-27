import { Badge } from "antd";
import styled from 'styled-components';

// export const CustomPanel = styled(Panel)`
const CustomBadge = styled(Badge)`
  .ant-badge-status-dot {
    position: relative;
    top: -1px;
    display: inline-block;
    width: 12px;
    height: 12px;
    vertical-align: middle;
    border-radius: 50%;
  }
`
export default CustomBadge
