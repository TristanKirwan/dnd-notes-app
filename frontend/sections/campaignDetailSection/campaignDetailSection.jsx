import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useRouter } from 'next/router';

import PageTitle from '../../components/PageTitle/pageTitle';
import BackButton from '../../components/Backbutton/backButton';
import Container from '../../components/Container/container';
import CampaignCreationForm from '../../components/Forms/campaignCreationForm/campaignCreationForm';
import CampaignDetailBlock from '../../components/CampaignDetailBlock/campaignDetailBlock'
import Modal from '../../components/Modal/modal';
import Button from '../../components/Button/button';

import makeAuthorizedRequest from '../../utils/makeAuthorizedRequest';

import style from './campaignDetailSection.module.scss';

export default function CampaignDetailSection(campaign) {
  const [isEditing, setIsEditing] = useState(false)
  const [campaignToShow, setCampaignToShow] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [deleteError, setDeleteError] = useState(null)
  
  const router = useRouter();

  useEffect(() => {
    setCampaignToShow(campaign)
  }, [])

  // TODO: Add related notes, tags, characters!

  function editSuccessCallback(campaignInfo){
    setIsEditing(false)
    setCampaignToShow({...campaign, ...campaignInfo})
  }

  function deleteCampaign(){
    setDeleteError(null)
    makeAuthorizedRequest(`campaign/${campaignToShow.id}`, null, null, 'DELETE')
    .then(res => {
      setShowDeleteModal(false);
      router.push('/account/campaigns')
    })
    .catch(err => {
      setDeleteError('Something went wrong while deleting the campaign. Please try again later.')
      console.error('Something went wrong while deleting the campaign.')
    })
  }

  function toggleDeleteModal() {
    setShowDeleteModal(!showDeleteModal)
    setDeleteError(null)
  }

  return (
    <section>
      {showDeleteModal && <Modal closeCallback={toggleDeleteModal}>
        <span className={style.deleteModalHeader}>Are you sure you want to delete <span className={style.modalCampaignTitle}>{campaignToShow.title}</span>?</span>
        <p className={style.modalBody}>
          This action cannot be undone and can only be performed by the dungeon master of the campaign.
        </p>
        {deleteError && <p className={style.modalError}>{deleteError}</p>}
        <div className={style.modalButtonContainer}>
          <Button callBack={toggleDeleteModal} buttonClass={clsx([style.modalButton, style.cancelButton])}>
            Cancel
          </Button>
          <Button buttonClass={clsx([style.deleteButton, style.modalButton])} callBack={deleteCampaign}>
            Delete
          </Button>
        </div>
      </Modal>}
      {isEditing ? <Container containerClass={style.container}>
            <PageTitle>Editing: {campaignToShow.title}</PageTitle>
            <BackButton callBack={() => setIsEditing(false)}/>
            <CampaignCreationForm successCallBack={editSuccessCallback} isEditForm campaignData={campaignToShow}/>
          </Container> 
        :
          <>
            <CampaignDetailBlock 
              campaign={campaignToShow} 
              // mayEditCampaign={campaign.isUserDm}
              mayEditCampaign={true}
              editCallBack={() => setIsEditing(true)} 
              deleteCallBack={toggleDeleteModal}
            />
            <CharactersBlock characters={[]}/>
          </>}
    </section>
  )
}