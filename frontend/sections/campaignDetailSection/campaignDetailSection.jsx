import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import PageTitle from '../../components/PageTitle/pageTitle';
import BackButton from '../../components/Backbutton/backButton';
import Container from '../../components/Container/container';
import CampaignCreationForm from '../../components/Forms/campaignCreationForm/campaignCreationForm';
import CampaignDetailBlock from '../../components/CampaignDetailBlock/campaignDetailBlock'
import CharactersBlock from '../../components/CharactersBlock/charactersBlock';
import DeleteModal from '../../components/Modal/deleteModal/deleteModal';

import makeAuthorizedRequest from '../../utils/makeAuthorizedRequest';

import style from './campaignDetailSection.module.scss';

export default function CampaignDetailSection(campaign) {
  const [isEditing, setIsEditing] = useState(false)
  const [campaignToShow, setCampaignToShow] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [deleteModalError, setDeleteModalError] = useState(null)
  const router = useRouter();

  useEffect(() => {
    setCampaignToShow(campaign)
  }, [])

  // TODO: Add related notes, tags, characters!

  function editSuccessCallback(campaignInfo){
    setIsEditing(false)
    setCampaignToShow({...campaign, ...campaignInfo})
  }

  function toggleDeleteModal() {
    setShowDeleteModal(!showDeleteModal)
  }

  function deleteCampaign(){
    setDeleteModalError(null)
    makeAuthorizedRequest(`campaign/${campaignToShow.id}`, null, null, 'DELETE')
    .then(() => {
      setShowDeleteModal(false);
      router.push('/account/campaigns')
    })
    .catch(() => {
      setDeleteModalError('Something went wrong while deleting the campaign. Please try again later.')
      console.error('Something went wrong while deleting the campaign.')
    })
  }

  const deleteModalHeaderText = "Are you sure you want to delete";
  const deleteModalItemName = campaignToShow ? campaignToShow.title : '';
  const deleteModalText = "This action cannot be undone and can only be performed by the dungeon master of the campaign."


  return (
    <section className={style.campaignDetailSection}>
      {showDeleteModal && <DeleteModal 
        toggleDeleteModal={toggleDeleteModal}
        deleteFunction={deleteCampaign}
        deleteError={deleteModalError}
        headerText={deleteModalHeaderText}
        itemName={deleteModalItemName}
        bodyText={deleteModalText}
      />}
      {isEditing ? <Container containerClass={style.container}>
            <PageTitle>Editing: {campaignToShow.title}</PageTitle>
            <BackButton callBack={() => setIsEditing(false)}/>
            <CampaignCreationForm successCallBack={editSuccessCallback} isEditForm campaignData={campaignToShow}/>
          </Container> 
        :
          <>
            <CampaignDetailBlock 
              campaign={campaignToShow} 
              mayEditCampaign={campaign.isUserDm}
              mayEditCampaign={true}
              editCallBack={() => setIsEditing(true)} 
              deleteCallBack={toggleDeleteModal}
            />
            <CharactersBlock {...campaignToShow} />
          </>}
    </section>
  )
}