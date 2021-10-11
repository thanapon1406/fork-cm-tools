import React, { ReactElement, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import MainLayout from '@/layout/MainLayout'

import Card from '@/components/Card'
import { Row, Col, Typography, Breadcrumb, Divider } from 'antd'
const { Title } = Typography

interface Props { }

export default function View({ }: Props): ReactElement {
    const router = useRouter()
    const { id } = router.query

    return (
        <MainLayout>
            <Title level={4}>User Profile</Title>
            <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>User Profile</Breadcrumb.Item>
                <Breadcrumb.Item>Rider Profile</Breadcrumb.Item>
                <Breadcrumb.Item>ข้อมูล</Breadcrumb.Item>
            </Breadcrumb>
            <Card>
                {id}
            </Card>
        </MainLayout>
    )
}