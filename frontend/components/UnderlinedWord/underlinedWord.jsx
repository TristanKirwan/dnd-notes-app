import style from './underlinedWord.module.scss';

export default function UnderlinedWord(props){
  return <span className={style.word}>{props.children}</span>
}