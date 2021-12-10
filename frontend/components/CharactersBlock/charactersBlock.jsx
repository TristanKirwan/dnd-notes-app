import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import Container from '../Container/container';
import Button from '../Button/button';
import Modal from '../Modal/modal';
import DeleteModal from '../Modal/deleteModal/deleteModal';
import CharacterCreationForm from '../Forms/characterCreationForm/characterCreationForm';

import makeAuthorizedRequest from '../../utils/makeAuthorizedRequest';
import { useStore } from '../../store/provider';


function CharacterModal({toggleCharacterModal, formCallback, isEditModal=false, characterInfo = null}) {
  function successFormCallback(data) {
    formCallback(data);
    toggleCharacterModal();
  }

   return (
     <Modal closeCallback={toggleCharacterModal}>
      <CharacterCreationForm 
        formCallback={successFormCallback}
        isEditForm={isEditModal}
        characterData={characterInfo}
      />
     </Modal>
   )
}

export default function CharactersBlock({characters = [], dm = null}){
  const [showCharacterModal, setShowCharacterModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [charactersToShow, setCharactersToShow] = useState(characters)
  const [isEditingCharacter, setIsEditingCharacter] = useState(false);
  const [currentCharacterData, setCurrentCharacterData] = useState(null);
  const [deleteCharacterError, setDeleteCharacterError] = useState(null);

  const router = useRouter();
  const { state } = useStore();
  const { accountDetails } = state


  function toggleCharacterModal() {
    setShowCharacterModal(!showCharacterModal)
    setIsEditingCharacter(false)
    setCurrentCharacterData(null);
  }

  useEffect(() => {
    setCharactersToShow(characters)
  }, [characters])

  function addCharacterToShown(data){
    const currentlyShownCharacters = [...charactersToShow];
    currentlyShownCharacters.push(data);
    setCharactersToShow(currentlyShownCharacters);
  }

  function onEditCharacter(characterInfo){
    setCurrentCharacterData(characterInfo);
    setShowCharacterModal(true)
    setIsEditingCharacter(true)
  }
  
  function editShownCharacter(characterInfo){
    const currentCharacters = [...charactersToShow];
    const editedCharIndex = currentCharacters.findIndex(char => char.id === characterInfo.id);
    currentCharacters[editedCharIndex] = characterInfo
    setCharactersToShow(currentCharacters)
    //We don't have to reset isEditing & CurrentCharacterInfo because that is handled by the modal toggle.
  }

  function openDeleteModal(character){
    toggleDeleteModal()
    setCurrentCharacterData(character);
  }

  function toggleDeleteModal(){
    setShowDeleteModal(!showDeleteModal);
  }

  function deleteCharacter(){
    setDeleteCharacterError(null)
    if(currentCharacterData === null){
      setDeleteCharacterError('Something went trying to delete this character, please refresh the page and try again');
      return
    }

    const requestBody = {
      campaignId: router.query.id || ''
    }

    makeAuthorizedRequest(`characters/${currentCharacterData.id}`, requestBody, null, 'DELETE')
    .then((res) => {
      setShowDeleteModal(false);
      const { id } = res;
      const newShownCharacters = [...charactersToShow];
      const indexOfChar = newShownCharacters.findIndex(char => char.id === id);
      newShownCharacters.splice(indexOfChar, 1);
      setCharactersToShow(newShownCharacters);
    })
    .catch(err => {
      const message = err?.response?.data?.message || "Something went wrong while deleting this character. Please try again later."
      setDeleteCharacterError(message)
      return
    })
  }
  
  const deleteModalHeader = "Are you sure you want to delete"
  const deleteModalItemName = currentCharacterData ? currentCharacterData.name : '';
  const deleteModalText = "This action may only be performed by the author of the character, and cannot be undone."

  return (
    <div>
      {showCharacterModal && <CharacterModal 
        toggleCharacterModal={toggleCharacterModal} 
        formCallback={(data) => !isEditingCharacter ? addCharacterToShown(data) : editShownCharacter(data)}
        isEditModal={isEditingCharacter}
        characterInfo={currentCharacterData}
        /> 
      }
      {showDeleteModal && <DeleteModal 
        toggleDeleteModal={toggleDeleteModal}
        deleteFunction={deleteCharacter}
        deleteError={deleteCharacterError}
        headerText={deleteModalHeader}
        itemName={deleteModalItemName}
        bodyText={deleteModalText}
      />
      }
      <Container>
        {charactersToShow.map(character => {
          const { username } = accountDetails || null
          const mayEditCharacter = username && (username === character.author || username === dm)
          const mayDeleteCharacter = username && username === character.author
          return (
            <span key={character.id} style={{display: 'block'}}>This is character: {character.name}
              <button style={{display: 'block'}} onClick={() => mayEditCharacter ? onEditCharacter(character) : null}>{mayEditCharacter ? "Edit character" : "Not allowed to edit"}</button>
              <button style={{display: 'blok'}} onClick={() => mayDeleteCharacter ? openDeleteModal(character) : null}>{mayDeleteCharacter ? "Delete character" : "Not allowed to delete"}</button>
            </span>
          )
        }
        )}
        <Button callBack={toggleCharacterModal}>
          Add Character 
        </Button>
      </Container>
    </div>
  )
}