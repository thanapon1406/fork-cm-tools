import Tag from '@/components/Tag'
import { onlineStatus, outletStatus } from '@/constants/textMapping'
import React from 'react'

export const StatusMapping: any = {
  active: <Tag type="success">{outletStatus['active']}</Tag>,
  inactive: <Tag type="error">{outletStatus['inactive']}</Tag>,
  closed: <Tag type="error">{outletStatus['closed']}</Tag>,
}

export const OnlineStatusMapping: any = {
  online: <Tag type="success">{onlineStatus['online']}</Tag>,
  offline: <Tag type="error">{onlineStatus['offline']}</Tag>,
}
