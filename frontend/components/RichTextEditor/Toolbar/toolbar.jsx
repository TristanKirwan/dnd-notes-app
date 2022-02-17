import { useSlate } from 'slate-react'
import clsx from 'clsx';

import Icon from '../../Icon/icon';
import { isMarkActive, toggleMark, isBlockActive, toggleBlock } from '../../../utils/richTextEditorFunctions';

import style from './toolbar.module.scss';

const BlockButton = ({ format, iconType }) => {
  const editor = useSlate()
  return (
    <button
    className={clsx([style.toolbarButton, isBlockActive(editor, format) && style.active])}
      onMouseDown={event => {
        event.preventDefault()
        toggleBlock(editor, format)
      }}
      aria-label={`Insert a new block of text of type ${format}`}
    >
      <Icon type={iconType} />
    </button>
  )
}

const MarkButton = ({ format, iconType }) => {
  const editor = useSlate()
  return (
    <button
      className={clsx([style.toolbarButton, isMarkActive(editor, format) && style.active])}
      aria-label={`Change the current selection, or make the coming text of type ${format}`}
      onMouseDown={event => {
        event.preventDefault()
        toggleMark(editor, format)
      }}
    >
      <Icon type={iconType} />
    </button>
  )
}


export default function Toolbar({children}){
  return (
    <div className={style.toolbar}>
      <div className={style.buttonGroup}>
        <MarkButton format="bold" iconType={"bold"}></MarkButton>
        <MarkButton format="italic" iconType={"italic"}></MarkButton>
        <MarkButton format="underline" iconType={"underline"}></MarkButton>
        <MarkButton format="code" iconType={"code"}></MarkButton>
      </div>
      <div className={style.buttonGroup}>
        <BlockButton format="bulleted-list" iconType={"bulletList"}></BlockButton>
        <BlockButton format="numbered-list" iconType={"numberedList"}></BlockButton>
        <BlockButton format="heading" iconType={"heading"}></BlockButton>
      </div>
    </div>
  )
}