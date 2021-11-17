import Cookies from 'js-cookie';

export default function logout(dispatchfunction, routerObject){
  Cookies.remove('accessToken');
  dispatchfunction({type: 'LOGOUT'});
  return routerObject.push('/')
}