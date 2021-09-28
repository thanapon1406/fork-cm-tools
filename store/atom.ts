import { atom } from 'recoil';
export const personState:any = atom({
  key: 'personState',
  default: {
    user: '1234',
    pass: '5678'
  }
});