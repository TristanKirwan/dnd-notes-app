import cookies from 'next-cookies';

import CampaignDetailSection from '../../../sections/campaignDetailSection/campaignDetailSection';

import checkTokenOnProtectedRoute from "../../../utils/checkTokenOnProtectedRoute"
import makeAuthorizedRequest from "../../../utils/makeAuthorizedRequest";

export async function getServerSideProps(context) {

  const { accessToken } = cookies(context)
  const { res, params } = context

  const hasRedirected = checkTokenOnProtectedRoute(accessToken, res);
  if(hasRedirected) { 
    return {props: {}}
  }

  const campaignId = params.id

  // Get campaign information
  const campaignResult = await makeAuthorizedRequest(`campaign/${campaignId}`, null, accessToken, 'GET')
  .then(res => {
    return res.data
  })
  .catch(err => {
    res.writeHead(307, {
      Location: '/404',
    })
    res.end();

    return {props:{}}
  })

  return {props: campaignResult}
}

export default function CampaignPage(props) {
  return (
    <>
      <CampaignDetailSection {...props}/>
    </>
  )
}