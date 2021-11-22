import Tag from '@/components/Tag'
import { BrandDetail } from '@/interface/brand'
import { findUser, logout } from '@/services/login'
import { getBrandList } from '@/services/pos-profile'
import { brandState, personState } from '@/store'
import { LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { Col, Dropdown, Layout, Menu, Row, Select, Space, Typography } from 'antd'
import Avatar from 'antd/lib/avatar/avatar'
import { filter } from 'lodash'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
const { Header } = Layout
const { Text } = Typography
const { Sider } = Layout
const { SubMenu } = Menu
export default function HeaderContent() {
  const [visible, setVisible] = useState(false)
  const [brandObject, setBrandState] = useRecoilState(brandState)
  const [brands, setBrand] = useState<Array<BrandDetail>>([])
  const { Option } = Select
  let APP_ENV = process.env.NEXT_PUBLIC_APP_ENV || ''
  const [userObject, setUserState] = useRecoilState(personState)
  const Router = useRouter()

  const getBrand = async () => {
    var params = {
      page: 1,
      per_page: 1000,
    }

    const { result, success } = await getBrandList(params)

    if (success) {
      const { meta, data } = result
      setBrand(data)
    }
  }

  const onChange = (value: any) => {
    let selectedBrands = filter(brands, function (v) {
      return v.id == value
    })

    if (selectedBrands.length) {
      setBrandState(selectedBrands[0])
    }
  }

  const logoutClick = () => {
    logout()
    Router.replace('/login')
  }

  useEffect(() => {
    findUserData()
  }, [])

  const appendBadgeRender = () => {
    APP_ENV = APP_ENV.toUpperCase()
    return <>{APP_ENV && <Tag type="#f50">{APP_ENV}</Tag>}</>
  }

  const findUserData = async () => {
    const { result = {}, success = false } = await findUser()
    if (success) {
      const { id, firstname = '', lastname = '' } = result.data
      const asciiCode = firstname.charCodeAt(0)
      setUserState({
        id: `${id}`,
        username: `${firstname}  ${lastname}`,
      })
    }
  }

  const profileMenu = (
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
  )

  return (
    <Header className="site-layout-sub-header-background" style={{ padding: 0, color: '#fff' }}>
      {/* <Select
        showSearch
        style={{ width: 500 }}
        placeholder="Select Brand"
        optionFilterProp="children"
        onChange={onChange}
      >
        {brands.map((v, k) => (
          <Option key={k} value={v.id} label={v.name.th}>
            {v.brand_id}
            {v.brand_id != '' ? '-' : ''}
            {v.name.th}
          </Option>
        ))}
      </Select> */}
      <div>
        <Row>
          <Col span="12">{appendBadgeRender()}</Col>
          <Col span="12" style={{ textAlign: 'end' }}>
            <Space style={{ padding: '0px 15px' }} size="middle">
              <Dropdown overlay={profileMenu} trigger={['click']}>
                <a>
                  <Space>
                    <Avatar style={{ backgroundColor: `#87d068` }}>
                      {' '}
                      {userObject.username[0]?.toUpperCase()}
                    </Avatar>
                    <Text type="warning">{userObject.username}</Text>
                  </Space>
                </a>

                {/* 
                  <Space>
                   
                    <SettingOutlined style={{ cursor: 'pointer', fontSize: '17px' }} />
                  </Space>
                </Text> */}
              </Dropdown>
            </Space>
          </Col>
        </Row>
      </div>
    </Header>
  )
}
