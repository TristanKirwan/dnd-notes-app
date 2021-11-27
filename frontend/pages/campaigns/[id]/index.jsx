import cookies from 'next-cookies';
import jwt from 'jsonwebtoken'

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

  const decodedJWT = jwt.decode(accessToken);
  const username = decodedJWT.username
  const isUserDm = campaignResult.dm && campaignResult.dm === username

  return {props: {
    ...campaignResult,
    isUserDm
  }}
}

export default function CampaignPage(props) {
  console.log(props)
  return (
    <>
      <CampaignDetailSection {...props}/>
    </>
  )
}