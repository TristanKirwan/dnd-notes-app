import { useEffect, useState } from 'react';

import PageTitle from '../../components/PageTitle/pageTitle';
import BackButton from '../../components/Backbutton/backButton';
import Container from '../../components/Container/container';
import CampaignCreationForm from '../../components/Forms/campaignCreationForm/campaignCreationForm';
import CampaignDetailBlock from '../../components/CampaignDetailBlock/campaignDetailBlock'

import style from './campaignDetailSection.module.scss';

export default function CampaignDetailSection(campaign) {
  const [isEditing, setIsEditing] = useState(false)
  const [campaignToShow, setCampaignToShow] = useState(null)

  useEffect(() => {
    setCampaignToShow(campaign)
  }, [])

  // TODO: Add related notes, tags, characters!

  function editSuccessCallback(campaignInfo){
    setIsEditing(false)
    setCampaignToShow({...campaign, ...campaignInfo})
  }

  return (
    <section>
      {isEditing ? <Container containerClass={style.container}>
            <PageTitle>Editing: {campaignToShow.title}</PageTitle>
            <BackButton callBack={() => setIsEditing(false)}/>
            <CampaignCreationForm successCallBack={editSuccessCallback} isEditForm campaignData={campaignToShow}/>
          </Container>:
      <CampaignDetailBlock campaign={campaignToShow} editCallBack={() => setIsEditing(true)}/>}
    </section>
  )
}