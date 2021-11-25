import clsx from 'clsx';

import Link from '../Link/link'; 

import style from './backButton.module.scss';

export default function BackButton({callBack}){
  return (
    <Link onClick={callBack} linkClass={style.backToOverviewButton}>
      <i className={clsx(["fas fa-long-arrow-alt-left", style.arrow])}></i>Go back
    </Link>
  )
}