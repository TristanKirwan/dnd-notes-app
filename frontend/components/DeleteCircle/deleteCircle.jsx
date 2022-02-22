import clsx from 'clsx';

import style from './deleteCircle.module.scss';

export default function DeleteCircle({onClick, className, disabled = false, invertedColors = false}) {
  return (
    <span className={clsx([style.deleteCircle, className, disabled && style.disabled, invertedColors && style.inverted])} onClick={disabled ? null : onClick}>
      <span className={style.circle}></span>
      <span className={clsx([style.line, style.left])}></span>
      <span className={clsx([style.line, style.right])}></span>
    </span>
  )
}