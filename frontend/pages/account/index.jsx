import { useState } from 'react';
import cookies from 'next-cookies';
import jsonwebtoken from 'jsonwebtoken';

import AccountItemsSection from '../../sections/accountItemsSection/accountItemsSection';

import makeAuthorizedRequest from "../../utils/makeAuthorizedRequest";

export async function getServerSideProps(context) {
  const { accessToken } = cookies(context)
  const { res } = context
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET
  let shouldRedirect = false;
  if(!accessToken) {
    shouldRedirect = true
  } else {
    jsonwebtoken.verify(accessToken, accessTokenSecret, (err, user) => {
      if(err) {
        shouldRedirect = true
      }
    })
  }

  if(shouldRedirect){
    res.writeHead(307, {
      Location: '/login',
      'Set-Cookie': 'accessToken=deleted; Expires=Thu, 31 Oct 2000 07:28:00 GMT;'
    })
    res.end();
  }

  // Get connected campaigns of this account
  const campaignsRes = await makeAuthorizedRequest('getCampaigns', null, accessToken, 'GET')
  .then(res => {
    return res.data.campaigns
  })
  .catch(err => {
    console.error(err)
  })

  const propsToPass = {
    campaigns: campaignsRes
  }

  return {props: propsToPass}
}


export default function Account(props) {
  const [addCampaignMessage, setAddCampaignMessage] = useState(null)

  function testFunction(e){
    e.preventDefault();
    let actualFormData = new FormData(e.target);
    const finalFormData = {}
    for (var [key, value] of actualFormData.entries()) { 
      finalFormData[key] = value
    }
    const requestBody = {text: finalFormData.text}
    makeAuthorizedRequest('addNote', requestBody)
    .then(res => {
      console.log(res)
    })
    .catch(err => {
      console.error(err)
    })
  }

  function addCampaign(e) {
    e.preventDefault();
    let actualFormData = new FormData(e.target);
    const finalFormData = {}
    for (var [key, value] of actualFormData.entries()) { 
      finalFormData[key] = value
    }
    const requestBody = {title: finalFormData.title}
    makeAuthorizedRequest('addCampaign', requestBody)
    .then(res => {

      setAddCampaignMessage(`Successfully added campaign title: ${res.data.title} with ID: ${res.data.id}`)
      console.log(res)
    })
    .catch(err => {
      console.error('? ', err.response.data)
      if(err.response && err.response.data && err.response.data.message){
        setAddCampaignMessage(err.response.data.message)
      }
    })
  }

  return (
    <>
      <AccountItemsSection hasAccountPageTitle/>
    </>
  )
}