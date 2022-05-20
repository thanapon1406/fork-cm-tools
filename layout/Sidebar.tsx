import { findUser, logout } from '@/services/login'
import { personState } from '@/store'
import {
  FileTextOutlined,
  LogoutOutlined,
  NotificationOutlined,
  SolutionOutlined,
  TeamOutlined,
  UserOutlined,
  WalletOutlined,
} from '@ant-design/icons'
import { Layout, Menu, Typography } from 'antd'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { ReactElement, useEffect } from 'react'
import { useRecoilState } from 'recoil'
import logoImg from '../public/cmt_logo.png'
const profileColor: Array<string> = ['87d068', 'd06868', 'c068d0', '6897d0', 'cad068', 'd09d68']
const { Text } = Typography
const { Sider } = Layout
const { SubMenu } = Menu
interface Props {}

interface MenuItem {
  index: number
  title: string
  icon: any | undefined
  key: string
  link: string
  sub: Array<SubMenuItem>
}

interface SubMenuItem {
  key: string
  link: string
  title: string
}

export default function Sidebar({}: Props): ReactElement {
  const Router = useRouter()
  const [userObject, setUserState] = useRecoilState(personState)
  const { asPath, pathname, query } = Router
  let activePath = pathname
  if (Object.keys(query).length !== 0) {
    let getPath = pathname.split('/')
    getPath.pop()
    activePath = getPath.join('/')
  }

  const logoutClick = () => {
    logout()
    Router.replace('/login')
  }

  useEffect(() => {}, [])

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

  const routingPath: Array<MenuItem> = [
    {
      index: 1,
      title: 'Dashboard',
      icon: <SolutionOutlined />,
      key: 'dashboard',
      link: '/',
      sub: [],
    },
    {
      index: 2,
      title: 'อนุมัติผลการลงทะเบียน',
      icon: <SolutionOutlined />,
      key: 'register',
      link: '/',
      sub: [
        {
          title: 'ลงทะเบียนร้านค้า',
          link: '/merchant',
          key: '/merchant',
        },
        {
          title: 'ลงทะเบียนคนขับ',
          link: '/rider',
          key: '/rider',
        },
        {
          title: 'ลงทะเบียน E-KYC',
          link: '/ekyc',
          key: '/ekyc',
        },
      ],
    },
    {
      index: 3,
      title: 'User Profile',
      icon: <TeamOutlined />,
      key: 'userProfile',
      link: '/userprofile',
      sub: [
        {
          title: 'Consumer Profile',
          link: '/consumer',
          key: '/consumer',
        },
        {
          title: 'Rider Profile',
          link: '/userprofile/rider',
          key: '/userprofile/rider',
        },
        {
          title: 'Merchant Profile',
          link: '/userprofile/merchant',
          key: '/userprofile/merchant',
        },
        {
          title: 'Staff Profile',
          link: '/userprofile/staff',
          key: '/userprofile/staff',
        },
      ],
    },
    {
      index: 4,
      title: 'การจัดการออเดอร์',
      icon: <FileTextOutlined />,
      key: 'order',
      link: '/order',
      sub: [
        {
          title: 'ออเดอร์ทั้งหมด',
          link: '/orderhistory',
          key: '/orderhistory',
        },
        {
          title: 'ดาวน์โหลดไฟล์รายการออเดอร์',
          link: '/download-order',
          key: '/download-order',
        },
      ],
    },
    {
      index: 5,
      title: 'การจัดการเครดิตร้านค้า',
      icon: <TeamOutlined />,
      key: 'credit',
      link: '/credit',
      sub: [
        {
          title: 'การเติมเครดิตร้านค้าทั้งหมด',
          link: '/credit/topup',
          key: '/credit/topup',
        },
        {
          title: 'การใช้เครดิตร้านค้าทั้งหมด',
          link: '/credit/transaction',
          key: '/credit/transaction',
        },
        {
          title: 'ข้อมูลบัญชีร้านค้า',
          link: '/credit/merchant-account',
          key: '/credit/merchant-account',
        },
      ],
    },
    {
      index: 6,
      title: 'กระเป๋าตังค์',
      icon: <WalletOutlined />,
      key: 'wallet',
      link: '/wallet',
      sub: [
        {
          title: 'LALAMOVE',
          link: '/wallet/lalamove',
          key: '/wallet/lalamove',
        },
        {
          title: 'PANDAGO',
          link: '/wallet/pandago',
          key: '/wallet/pandago',
        },
      ],
    },
    {
      index: 7,
      title: 'โปรโมชั่น',
      icon: <FileTextOutlined />,
      key: 'promotion',
      link: '/promotion',
      sub: [
        {
          title: 'รายงานโปรโมชั่น',
          link: '/promotion/report',
          key: '/promotion/report',
        },
      ],
    },
    {
      index: 7,
      title: 'Notifications',
      icon: <NotificationOutlined />,
      key: 'notifications',
      link: '/notifications',
      sub: [
        {
          title: 'Broadcast News ',
          link: '/notifications/broadcast_news',
          key: '/notifications/broadcast_news',
        },
      ],
    },
  ]

  return (
    <Sider
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
      }}
      // breakpoint="lg"
      collapsedWidth="0"
      width="220px"
    >
      <div className="logo">
        <Image src={logoImg} alt="" />
      </div>
      <br />
      {/* <Space style={{ padding: '15px' }} size="middle">
        <Avatar shape="square" style={{ backgroundColor: `#87d068` }}>
          {' '}
          {userObject.username[0]?.toUpperCase()}
        </Avatar>
        <Dropdown overlay={profileMenu} trigger={['click']}>
          <Text type="warning">
            <Space>
              {userObject.username}
              <SettingOutlined style={{ cursor: 'pointer', fontSize: '17px' }} />
            </Space>
          </Text>
        </Dropdown>
      </Space> */}
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={[activePath]}
        defaultOpenKeys={['register', 'userProfile', 'credit', 'order']}
        style={{ borderRight: 0 }}
      >
        {routingPath.map((path: MenuItem) => {
          const { sub = [], title, icon, key, link } = path
          if (sub.length > 0) {
            return (
              <SubMenu key={key} icon={icon} title={title}>
                {sub.map((subValue: SubMenuItem) => {
                  const { title: subTitle, link: subLink, key: subKey } = subValue
                  return (
                    <Menu.Item key={subKey}>
                      <Link href={subLink}>
                        <a>{subTitle}</a>
                      </Link>
                    </Menu.Item>
                  )
                })}
              </SubMenu>
            )
          } else {
            return (
              <Menu.Item key={key} icon={icon}>
                <Link href={link}>
                  <a> {title}</a>
                </Link>
              </Menu.Item>
            )
          }
        })}
      </Menu>
    </Sider>
  )
}
