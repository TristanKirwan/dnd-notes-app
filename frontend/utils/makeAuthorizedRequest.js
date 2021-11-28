import axios from 'axios'
import getAccessToken from './getAccessToken'

export default function makeAuthorizedRequest(path, body, passedToken = null, method = 'POST'){
  const token = passedToken || getAccessToken();
  if(token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }
  switch(method){
    case 'POST': 
      return axios.post(`${process.env.NEXT_PUBLIC_API_URL}/${path}`, body);
    case 'GET': 
      return axios.get(`${process.env.NEXT_PUBLIC_API_URL}/${path}`);
    case 'PUT':
      return axios.put(`${process.env.NEXT_PUBLIC_API_URL}/${path}`, body);
    case 'DELETE':
      return axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/${path}`)
  }
}