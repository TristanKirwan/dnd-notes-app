import cookies from 'next-cookies';

import PageTitle from '../../../components/PageTitle/pageTitle'
import CampaignOverviewSection from '../../../sections/campaignOverviewSection/campaignOverviewSection';

import checkTokenOnProtectedRoute from "../../../utils/checkTokenOnProtectedRoute"
import makeAuthorizedRequest from "../../../utils/makeAuthorizedRequest";

export async function getServerSideProps(context) {
  const { accessToken } = cookies(context)
  const { res } = context

  const hasRedirected = checkTokenOnProtectedRoute(accessToken, res);
  if(hasRedirected) { 
    return {props: {}}
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


export default function AccountCampaignsPage(props) {

  return (
    <>
      <PageTitle>My campaigns</PageTitle>
      <CampaignOverviewSection campaigns={props.campaigns} />
    </>
  )
}