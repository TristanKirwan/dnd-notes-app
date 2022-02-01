import Container from '../../components/Container/container';
import { useState } from 'react';

import NoteModal from '../Modal/NoteModal/noteModal';
import Button from '../Button/button';


import style from './notesBlock.module.scss';


export default function NotesBlock({notes}){
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);

  function toggleNoteModal(){
    setIsNoteModalOpen(!isNoteModalOpen);
  }

  return (
    <div>
      {isNoteModalOpen && <NoteModal closeModalCallback={toggleNoteModal}>
      </NoteModal>}
      <Container containerClass={style.notesContainer}>
        <h2 className={style.sectionHeading}>Notes</h2>
        {Array.isArray(notes) && notes.map(note => note.title)}
        <Button callBack={toggleNoteModal} buttonClass={style.addCharacterButton}>
          Add Note
        </Button>
      </Container>
    </div>
  )
}