import { useState } from 'react';

import Container from '../Container/container';
import Button from '../Button/button';
import Modal from '../Modal/modal';
import CharacterCreationForm from '../Forms/characterCreationForm/characterCreationForm';


function CharacterModal({toggleCharacterModal, successfulAddCallback}) {
  function successFormCallback(data) {
    successfulAddCallback(data);
    toggleCharacterModal();
  }

   return (
     <Modal closeCallback={toggleCharacterModal}>
       <CharacterCreationForm formCallback={successFormCallback}/>
     </Modal>
   )
}

export default function CharactersBlock({characters = []}){
  const [showCharacterModal, setShowCharacterModal] = useState(null);
  const [charactersToShow, setCharactersToShow] = useState(characters)
  
  function toggleCharacterModal() {
    setShowCharacterModal(!showCharacterModal)
  }

  function addCharacterToShown(data){
    const currentlyShownCharacters = [...charactersToShow];
    currentlyShownCharacters.push(data);
    setCharactersToShow(currentlyShownCharacters);
  }

  return (
    <div>
      {showCharacterModal && <CharacterModal toggleCharacterModal={toggleCharacterModal} successfulAddCallback={(data) => addCharacterToShown(data)}/> }
      <Container>
        {charactersToShow.map(character => <span>This is character: {character.name}</span>)}
        <Button callBack={toggleCharacterModal}>
          Add Character 
        </Button>
      </Container>
    </div>
  )
}