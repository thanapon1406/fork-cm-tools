import { atom } from 'recoil';
interface Person{
  username:string;
  email?:string
}
export const personState = atom({
  key: 'personState',
  default: {
    username: '',
    email:''
  } as Person,
});