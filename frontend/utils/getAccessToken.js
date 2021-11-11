import Cookies from 'js-cookie';

export default function getAccessToken(){
  const token = Cookies.get('accessToken')
  return token
}