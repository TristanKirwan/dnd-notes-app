import axios from 'axios'
import getAccessToken from './getAccessToken'

export default function makeAuthorizedRequest(path, body){
  const token = getAccessToken();
  if(token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }
  return axios.post(`${process.env.NEXT_PUBLIC_API_URL}/${path}`, body)
}