import Modal from '../modal';
import RichTextEditor from '../../RichTextEditor/richTextEditor';

export default function NoteModal({closeModalCallback}){

  return (
    <Modal
        closeCallback={closeModalCallback}
        shouldDetectOutsideClick={false}
      >
        <p style={{fontSize: '2rem', marginBottom: '4rem'}}>INSERT TITLE INPUT FIELD</p>
        <RichTextEditor />
    </Modal>
  )
}