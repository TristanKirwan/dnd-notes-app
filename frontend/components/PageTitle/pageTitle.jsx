import Container from '../Container/container'

import style from './pageTitle.module.scss'

export default function pageTitle(props){
  return (
    <Container>
      <h1 className={style.title}>{props.children}</h1>
    </Container>
  )
}