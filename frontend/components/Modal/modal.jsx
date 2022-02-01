import { useEffect, useRef } from 'react';

import DeleteCircle from '../DeleteCircle/deleteCircle'

import detectOutsideClick from '../../utils/detectOutsideClick';

import style from './modal.module.scss';

export default function Modal({title, closeCallback, children, shouldDetectOutsideClick = true}) {
  const modalRef = useRef(null)

  useEffect(() => {
    if(shouldDetectOutsideClick) {
      window.addEventListener('click', (e) => detectOutsideClick(e, modalRef, closeCallback))
    }
    return () => {
      if(shouldDetectOutsideClick) {
        window.removeEventListener('click', (e) => detectOutsideClick(e, modalRef, closeCallback))
      }
    }
  }, [])

  return (
    <div className={style.modalWrapper}>
      <div className={style.background}></div>
      <div className={style.modalContent} ref={modalRef}>
        <DeleteCircle onClick={closeCallback} className={style.deleteButton}/>
        <div>
          {children}
        </div>
      </div>
    </div>
  )
}