import DeleteCircle from '../DeleteCircle/deleteCircle';
import style from './tag.module.scss';

export default function Tag({tag, showDelete, deleteFunction, showAdd, addFunction}){
  return (
    <span className={style.tag}>
      <span>
        {tag}
      </span>
      {showDelete && deleteFunction && <DeleteCircle onClick={deleteFunction} className={style.deleteIcon} invertedColors />}
      {showAdd && addFunction && <DeleteCircle onClick={addFunction} className={style.addIcon} invertedColors />}
    </span>
  )
}