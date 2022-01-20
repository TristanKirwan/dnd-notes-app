import { useState } from 'react'
import clsx from 'clsx';
import { useRouter } from 'next/router';


import GenericCard from "../genericCard";
import Modal from '../../Modal/modal';
import Icon from '../../Icon/icon';
import CharacterCreationForm from '../../Forms/characterCreationForm/characterCreationForm';
import DeleteModal from '../../Modal/deleteModal/deleteModal';

import getClassIcon from '../../../utils/getClassIcon';
import truncateString from '../../../utils/truncateString';
import makeAuthorizedRequest from '../../../utils/makeAuthorizedRequest';


import alignmentTypes from '../../../databaseTypes/alignmentTypes';
import style from './characterCard.module.scss';


export default function CharacterCard({id = null, name = '', characterClass = 'fighter', race = 'Human', alignment = 'trueNeutral', authorName = 'DM', bio = '', allowedToEdit = false, allowedToDelete = false, editCallback = null, deleteCallback = null}){
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteCharacterError, setDeleteCharacterError] = useState(null)

  const router = useRouter();

  const correctAlignmentObject = alignmentTypes.find(a => {
    if(a.value === alignment){
      return a
    }
  });

  const humanReadableAlignmentString = correctAlignmentObject.title || ''

  const extraContent = <div className={style.extraContentContainer}>
    <div className={style.extraContentRow}>
      <span className={style.iconContainer}><Icon type="d20" /></span>
      <span>{authorName}</span>
    </div>
    <div className={style.extraContentRow}>
      <span className={style.iconContainer}><Icon type="scroll" /></span>
      <span>{race}</span>
    </div>
    <div className={style.extraContentRow}>
      <span className={style.iconContainer}><Icon type="scroll" /></span>
      <span>{humanReadableAlignmentString}</span>
    </div>
    {(allowedToEdit || allowedToDelete) &&
      <div className={clsx([style.extraContentRow, style.addedMargin])}>
        {allowedToEdit && <button className={clsx([style.halfRow, style.modifyCharacterContainer])} onClick={() => toggleEditModal()}>
          <span className={style.iconContainer}><Icon type="spanner" /></span>
          <span className={style.modifyCharacterText}>Edit Character</span>     
        </button>}
        {allowedToDelete && <button className={clsx([style.halfRow, style.modifyCharacterContainer])} onClick={() => toggleDeleteModal()}>
          <span className={style.iconContainer}><Icon type="trash" /></span>
          <span className={style.modifyCharacterText}>Delete Character</span>
        </button>}
      </div>
    }
  </div>

  const iconType = getClassIcon(characterClass)
  const shortenedBio = truncateString(bio)

  const condensedCharacterInfo = {
    name,
    race,
    class: characterClass,
    alignment,
    bio,
    id
  }

  function toggleEditModal(){
    setIsEditModalOpen(!isEditModalOpen);
  }

  function toggleDeleteModal(){
    setIsDeleteModalOpen(!isDeleteModalOpen)
  }

  function editFormCallBack(data){
    setIsEditModalOpen(false);
    if(editCallback) {
      editCallback(data)
    }
  }

  function deleteCharacter(){
    setDeleteCharacterError(null)
    if(!id) {
      setDeleteCharacterError('Something went trying to delete this character, please refresh the page and try again');
      return;
    }

    const requestBody = {
      campaignId: router.query.id || ''
    }

    makeAuthorizedRequest(`characters/${id}`, requestBody, null, 'DELETE')
    .then((res) => {
      setIsDeleteModalOpen(false);
      const { id } = res.data;
      if(deleteCallback) {
        deleteCallback(id)
      }
    })
    .catch(err => {
      const message = err?.response?.data?.message || "Something went wrong while deleting this character. Please try again later."
      setDeleteCharacterError(message)
      return
    })
  }

  const deleteModalHeader = "Are you sure you want to delete"
  const deleteModalItemName = name ? name : '';
  const deleteModalText = "This action may only be performed by the author of the character, and cannot be undone."

  return(
    <>
      {isEditModalOpen && <Modal closeCallback={toggleEditModal}>
      <CharacterCreationForm 
        formCallback={editFormCallBack}
        isEditForm={true}
        characterData={condensedCharacterInfo}
      />
     </Modal>}
     {isDeleteModalOpen && <DeleteModal 
        toggleDeleteModal={toggleDeleteModal}
        deleteFunction={deleteCharacter}
        deleteError={deleteCharacterError}
        headerText={deleteModalHeader}
        itemName={deleteModalItemName}
        bodyText={deleteModalText}
      />
      }      
      <GenericCard title={name} icon={iconType} extraContent={extraContent} link={``} description={shortenedBio}/>
    </>
  )
}