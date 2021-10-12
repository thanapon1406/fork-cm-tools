import Card from '@/components/Card'
import MainLayout from '@/layout/MainLayout'
import { consumerList } from '@/services/consumer'
import { Breadcrumb, Typography } from 'antd'
import { useRouter } from 'next/router'
import React, { ReactElement, useEffect, useState } from 'react'
import Ekyc from '../ekyc/component'

const { Title } = Typography

interface Props { }

export default function View({ }: Props): ReactElement {
    const router = useRouter()
    const id = router.query.id as string
    let [initialValues, setInitialValues] = useState({
        outlet_name: '124',
        outlet_type: '',
        tax_id: '',
        email: '',
        address: '',
        verify_status: '',
        verify_detail: [],
        sso_id: "",
    })

    const [ssoId, setssoId] = useState("")

    useEffect(() => {
        console.log(`useEffect`, id)
        if (id) {
            getConsumerList()
        }
    }, [id])

    const getConsumerList = async () => {
        const request = {
            id: id,
        }
        const { result, success } = await consumerList(request)
        if (success) {
            const { data: [data] } = result
            console.log(`data`, data)
            if (data) {
                setInitialValues({
                    ...initialValues,
                    outlet_name: data.sso_id,
                    outlet_type: data.outlet_type,
                    tax_id: data.tax_id,
                    email: data.email,
                    address: data.address,
                })
                setssoId(data.sso_id)
            }
        }
    }

    return (
        <MainLayout>
            <Title level={4}>อนุมัติผลการละทะเบียนเข้าใช้ระบบ</Title>
            <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>User Consumer</Breadcrumb.Item>
                <Breadcrumb.Item>Consumer Profile</Breadcrumb.Item>
                <Breadcrumb.Item>Consumer Details</Breadcrumb.Item>
            </Breadcrumb>
            <Card>
                <div>
                    <Ekyc sso_id={ssoId} />
                </div>
            </Card>
        </MainLayout>
    )
}
