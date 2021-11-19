import axios from 'axios'
import fetch from './fetch'
import { retrieveToken } from './fetch/auth'
import errorHandler from './handler/errorHandler'
import successHandler from './handler/successHandler'
const host_rest = process.env.POS_WAPI
interface queryList {
  id?: string
  rider_name?: string
  type?: string
  created_at?: object
  partner_name?: string
}

interface filterObject {
  rider_name?: string
  type?: string
  created_at?: object
  partner_order_id?: string
  partner_name: string
}

interface excel {
  key?: string
}

interface queryById {
  id?: string
}

interface response {
  success: boolean
  result: any
}

interface IQueryWalletSetting {
  partner_name: string
}

interface IWalletSettingDetail {
  id?: string;
  min_alert_balance?: number;
  min_alert_email?: string;
  min_alert_status?: boolean;
  top_up_alert_email?: string;
  top_up_alert_status?: boolean;
}

interface IUpdateWalletSettingDetail {
  data: IWalletSettingDetail
}

const getLalamoveWallet = async (body: queryList) => {
  try {
    const result = await fetch.post(`/api/wallet-transaction/find`, body)
    return successHandler(result)
  } catch (error) {
    return errorHandler(error)
  }
}


const getEnv = async () => {
  try {
    const result = await fetch.get(`/api/env/get-env-rest`)
    return successHandler(result)
  } catch (error) {
    return errorHandler(error)
  }
}

const generateRepoertWalletTransaction = async (req: filterObject) => {
  try {
    const result = await fetch.get(`/api/wallet-transaction/report`, { params: req })
    return successHandler(result)
  } catch (error) {
    return errorHandler(error)
  }
}

const getWalletExcel = async (req: excel) => {
  try {
    const token = retrieveToken()
    const { result } = await getEnv()
    const res = await axios({
      url: result.data + '/report-service/download-report/' + req.key,
      method: 'GET',
      responseType: 'blob',
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
    return res.data
  } catch (error) {
    return errorHandler(error)
  }
}




const getWalletBalanceSetting = async (req: IQueryWalletSetting) => {
  try {
    const result = await fetch.post(`/api/wallet-balance/find`, req)
    return successHandler(result)
  } catch (error) {
    return errorHandler(error)
  }
}

const saveWalletBalanceSetting = async (req: IUpdateWalletSettingDetail) => {
  try {
    const result = await fetch.post(`/api/wallet-balance/update`, req)
    return successHandler(result)
  } catch (error) {
    return errorHandler(error)
  }
}

export { getLalamoveWallet, getWalletBalanceSetting, saveWalletBalanceSetting, getWalletExcel, generateRepoertWalletTransaction }

