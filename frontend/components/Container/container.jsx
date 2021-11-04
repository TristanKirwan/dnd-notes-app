import clsx from 'clsx';

import style from './container.module.scss';

export default function Container(props){

  return (
    <div className={clsx([style.container, props.size && style[size], props.containerClass && props.containerClass])}>
      {props.children}
    </div>
  )
}