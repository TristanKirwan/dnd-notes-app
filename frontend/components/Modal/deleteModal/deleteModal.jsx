import clsx from 'clsx';

import Modal from '../modal';
import Button from '../../Button/button';

import style from './deleteModal.module.scss'

export default function DeleteModal({
  toggleDeleteModal,
  deleteFunction,
  deleteError,
  headerText,
  itemName,
  bodyText
  }){

  return(
    <Modal closeCallback={toggleDeleteModal}>
        <span className={style.deleteModalHeader}>{headerText} 
          <span className={style.modalCampaignTitle}> {itemName}</span>?
        </span>
        <p className={style.modalBody}>
          {bodyText}
        </p>
        {deleteError && <p className={style.modalError}>{deleteError}</p>}
        <div className={style.modalButtonContainer}>
          <Button callBack={toggleDeleteModal} buttonClass={clsx([style.modalButton, style.cancelButton])}>
            Cancel
          </Button>
          <Button buttonClass={clsx([style.deleteButton, style.modalButton])} callBack={deleteFunction}>
            Delete
          </Button>
        </div>
      </Modal>
  )
}
