import { useState } from 'react';

import AccountItemsSection from '../../sections/accountItemsSection/accountItemsSection';

import makeAuthorizedRequest from "../../utils/makeAuthorizedRequest";

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