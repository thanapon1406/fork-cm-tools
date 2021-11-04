import { BrandDetail } from '@/interface/brand'
import { atom } from 'recoil'
interface Person {
  username: string
  id: string
  email?: string
}
export const personState = atom({
  key: 'personState',
  default: {
    username: '',
    email: '',
    id: '',
  } as Person,
})

export const merchantState = atom({
  key: 'merchantState',
  default: {
    personal: {
      email: '',
      first_name: '',
      last_name: '',
      ssoid: '',
      tel: '',
    },
  },
})

export const brandState = atom({
  key: 'brandState',
  default: {} as BrandDetail,
})
