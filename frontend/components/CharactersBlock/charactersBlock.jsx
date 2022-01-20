import { useState, useEffect } from 'react';

import Container from '../Container/container';
import Modal from '../Modal/modal';
import CharacterCreationForm from '../Forms/characterCreationForm/characterCreationForm';
import Button from '../Button/button';
import CharacterCard from '../Cards/CharacterCard/characterCard';

import { useStore } from '../../store/provider';

import style from './charactersBlock.module.scss';

function CharacterModal({toggleCharacterModal, formCallback, characterInfo = null}) {
  function successFormCallback(data) {
    formCallback(data);
    toggleCharacterModal();
  }

   return (
     <Modal closeCallback={toggleCharacterModal}>
      <CharacterCreationForm 
        formCallback={successFormCallback}
        isEditForm={false}
        characterData={characterInfo}
      />
     </Modal>
   )
}


export default function CharactersBlock({characters = [], dm = null}){
  const [showCharacterModal, setShowCharacterModal] = useState(false);
  const [charactersToShow, setCharactersToShow] = useState(characters)
  const [currentCharacterData, setCurrentCharacterData] = useState(null);

  const { state } = useStore();
  const { accountDetails } = state


  function toggleCharacterModal() {
    setShowCharacterModal(!showCharacterModal)
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
  
  function editShownCharacter(characterInfo){
    const currentCharacters = [...charactersToShow];
    const editedCharIndex = currentCharacters.findIndex(char => char.id === characterInfo.id);
    currentCharacters[editedCharIndex] = characterInfo
    setCharactersToShow(currentCharacters)
    //We don't have to reset isEditing & CurrentCharacterInfo because that is handled by the modal toggle.
  }

  function deleteCallback(id) {
    if(!id) return
    const newShownCharacters = [...charactersToShow];
      const indexOfChar = newShownCharacters.findIndex(char => char.id === id);
      newShownCharacters.splice(indexOfChar, 1);
      setCharactersToShow(newShownCharacters);
  }

  return (
    <div>
      {showCharacterModal && <CharacterModal 
        toggleCharacterModal={toggleCharacterModal} 
        formCallback={(data) => addCharacterToShown(data)}
        characterInfo={currentCharacterData}
        /> 
      }
      <Container containerClass={style.cardContainer}>
        {charactersToShow.map(character => {
          const { username } = accountDetails || null
          const mayEditCharacter = username && (username === character.author || username === dm)
          const mayDeleteCharacter = username && username === character.author
          return (
              <CharacterCard 
                id={character.id}
                name={character.name}
                characterClass={character.class}
                race={character.race}
                alignment={character.alignment}
                bio={character.bio}
                authorname={character.author}
                key={character.name}
                allowedToEdit={mayEditCharacter}
                allowedToDelete={mayDeleteCharacter}
                editCallback={editShownCharacter}
                deleteCallback={deleteCallback}
              />
          )
        }
        )}
        <Button callBack={toggleCharacterModal} buttonClass={style.addCharacterButton}>
          Add Character 
        </Button>
      </Container>
    </div>
  )
}