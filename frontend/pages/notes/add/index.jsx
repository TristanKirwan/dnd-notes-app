import cookies from 'next-cookies';
import checkTokenOnProtectedRoute from '../../../utils/checkTokenOnProtectedRoute';

import PageTitle from '../../../components/PageTitle/pageTitle';

import NoteForm from '../../../components/Forms/NoteForm/noteform';
import makeAuthorizedRequest from '../../../utils/makeAuthorizedRequest';

export async function getServerSideProps(context) {
  const { accessToken } = cookies(context)
  const { res, query } = context

  const hasRedirected = checkTokenOnProtectedRoute(accessToken, res);
  if(hasRedirected) { 
    return {props: {}}
  }

  const campaignId = query.campaignId
  const campaignInformation = await makeAuthorizedRequest(`campaign/${campaignId}`, null, accessToken, 'GET')
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

  //This can be expanded to include tags that are used for notes in this campaign.
  const tagRecommendations = []
  campaignInformation.characters.map(character => { tagRecommendations.push(character.name.toUpperCase()); });

  return {props: {tagRecommendations: tagRecommendations}}
}



export default function AddNotePage({tagRecommendations}){
  return (
    <div>
      <PageTitle></PageTitle>
      <NoteForm recommendedTags={tagRecommendations} />
    </div>
  )
}