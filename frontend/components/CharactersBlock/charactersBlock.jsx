import { useState, useEffect } from 'react';

import Container from '../Container/container';
import Button from '../Button/button';
import Modal from '../Modal/modal';
import CharacterCreationForm from '../Forms/characterCreationForm/characterCreationForm';

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
  const [showCharacterModal, setShowCharacterModal] = useState(null);
  const [charactersToShow, setCharactersToShow] = useState(characters)
  const [isEditingCharacter, setIsEditingCharacter] = useState(false);
  const [currentCharacterData, setCurrentCharacterData] = useState(null);

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

  return (
    <div>
      {showCharacterModal && <CharacterModal 
        toggleCharacterModal={toggleCharacterModal} 
        formCallback={(data) => !isEditingCharacter ? addCharacterToShown(data) : editShownCharacter(data)}
        isEditModal={isEditingCharacter}
        characterInfo={currentCharacterData}
        /> 
      }
      <Container>
        {charactersToShow.map(character => {
          const { username } = accountDetails || null
          const mayEditCharacter = username && (username === character.author || username === dm)
          // const mayDeleteCharacter = username && username === character.author
          return (
            <span key={character.id}>This is character: {character.name}
              <button style={{display: 'block'}} onClick={() => mayEditCharacter ? onEditCharacter(character) : null}>{mayEditCharacter ? "Edit character" : "Not allowed to edit"}</button>
              {/* <button style={{display: 'blok'}} onClick={() => mayDeleteCharacter ? onEditCharacter(character) : null}>{mayDeleteCharacter ? "Delete character" : "Not allowed to delete"}</button> */}
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