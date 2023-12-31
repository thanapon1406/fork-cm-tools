import { Collapse } from 'antd'
import styled from 'styled-components'

const { Panel } = Collapse

interface CustomPanelProps {
  status?: string
}

// export const CustomPanel = styled(Panel)`
const CustomPanel = styled(Panel)`
  .ant-collapse-header {
    background: ${({ status }: CustomPanelProps) =>
      status === 'approved'
        ? '#52e04a'
        : status === 'uploaded'
        ? '#e0b34a'
        : status === 'rejected'
        ? '#de3e3e'
        : ''};
  }
`
export default CustomPanel
