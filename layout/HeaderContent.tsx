import { BrandDetail } from '@/interface/brand'
import { getBrandList } from '@/services/pos-profile'
import { brandState } from '@/store'
import { Layout, Select } from 'antd'
import { filter } from 'lodash'
import React, { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
const { Header } = Layout

export default function HeaderContent() {
  const [visible, setVisible] = useState(false)
  const [brandObject, setBrandState] = useRecoilState(brandState)
  const [brands, setBrand] = useState<Array<BrandDetail>>([])
  const { Option } = Select

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

  useEffect(() => {
    getBrand()
  }, [])

  return (
    <Header className="site-layout-sub-header-background" style={{ padding: 0, color: '#fff' }}>
      <Select
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
      </Select>
    </Header>
  )
}
