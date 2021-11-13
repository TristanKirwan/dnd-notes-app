import { useState } from 'react';
import cookies from 'next-cookies';
import jsonwebtoken from 'jsonwebtoken';

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

  // Get connected campaigns of this account :)

  return {props: {}}
}


export default function Account() {
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
    <div>
    <h1>Add note</h1>
    <form onSubmit={testFunction}>
      <input type="text" name="text">

      </input>
     <button type="submit">Add</button>
    </form>
    <h1>Add Campaign</h1>
    <form onSubmit={addCampaign}>
      <input type="text" name="title" value="Boys in the mines">

      </input>
     <button type="submit">Add</button>
    </form>
    {addCampaignMessage && <span>{addCampaignMessage}</span>}
    </div>
  )
}