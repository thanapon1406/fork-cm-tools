import Tag from '@/components/Tag'
import { outletStatus } from '@/constants/textMapping'
import React from 'react'

export const StatusMapping: any = {
  active: <Tag type="success">{outletStatus['active']}</Tag>,
  inactive: <Tag type="error">{outletStatus['inactive']}</Tag>,
  closed: <Tag type="error">{outletStatus['closed']}</Tag>,
}
