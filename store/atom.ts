import { atom } from 'recoil'
interface Person {
  username: string
  email?: string
}
export const personState = atom({
  key: 'personState',
  default: {
    username: '',
    email: '',
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
