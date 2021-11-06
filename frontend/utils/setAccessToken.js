import Cookies from 'js-cookie';

export default function setAccessToken(token){
  if(!token) return null;
  Cookies.set('accessToken', token, {expires: 1})
}