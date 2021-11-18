import { useState } from 'react';

import PageTitle from '../../components/PageTitle/pageTitle'
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

  return (
    <>
      <PageTitle>My Account</PageTitle>
      <AccountItemsSection />
    </>
  )
}