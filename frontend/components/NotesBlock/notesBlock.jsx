import Container from '../../components/Container/container';

import Button from '../Button/button';


import style from './notesBlock.module.scss';


export default function NotesBlock({notes, campaignId}){

  return (
    <div>
      <Container containerClass={style.notesContainer}>
        <h2 className={style.sectionHeading}>Notes</h2>
        {Array.isArray(notes) && notes.map(note => note.title)}
        <Button isLink href={`/notes/add?campaignId=${campaignId}`} buttonClass={style.addCharacterButton}>
          Add Note
        </Button>
      </Container>
    </div>
  )
}