import DeleteCircle from '../DeleteCircle/deleteCircle';

import style from './singleUserContainer.module.scss';

export default function SingleUserContainer({user, deleteOnClick, disabled}){

  return (
    <span className={style.singleUserCotainer}>
      <span className={style.name}>{user}</span>
      <DeleteCircle onClick={deleteOnClick} className={style.deleteIcon} disabled={disabled}/>
    </span>
  )
}