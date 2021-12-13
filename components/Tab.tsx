import { Tabs } from 'antd'
import React, { ReactElement } from 'react'
const { TabPane: tabPans } = Tabs
type TabType = Parameters<typeof Tabs>[0]
interface Props extends TabType {
  defaultActiveKey?: string
  children: any
  callback?: () => void
}

function Tab({ children, defaultActiveKey = '1', callback, ...props }: Props): ReactElement {
  return (
    <>
      <Tabs {...props} defaultActiveKey={defaultActiveKey} onChange={callback}>
        {children}
      </Tabs>
    </>
  )
}

Tab.TabPane = tabPans
var _default = Tab
export default _default
