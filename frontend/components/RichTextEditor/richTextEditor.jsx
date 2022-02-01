import { useState, useCallback, useRef } from 'react';
import isHotkey from 'is-hotkey'
import { Editable, withReact, Slate} from 'slate-react';
import {
  Editor,
  createEditor} from 'slate';
import { withHistory } from 'slate-history';

import Toolbar from './Toolbar/toolbar';
import { toggleMark, isBlockActive, toggleBlock } from '../../utils/richTextEditorFunctions';


import style from './richTextEditor.module.scss';

const initialEditorValue = [
  {
    type: 'paragraph',
    children: [
      { text: 'You can start writing your notes here, you can make your text '},
      { text: 'bold, ', bold: true},
      { text: 'italicized '},
    ]
  }, {
    type: 'paragraph',
    children: [
      {text: 'You can even create lists! Why would you want to do that?'},
    ]
  },
  {
    type: 'bulleted-list',
    children: [
      { text: 'Because '},
      { text: 'it'},
      { text: 'is'},
      { text: 'awesome?'}
    ]
  }
]

const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
}

export default function RichTextEditor() {
  const [value, setValue] = useState(initialEditorValue);
  const renderElement = useCallback(props => <Element {...props} />, []);
  const renderLeaf = useCallback(props => <Leaf {...props} />, [])
  const editorRef = useRef();
  if(!editorRef.current) {
    editorRef.current = withHistory(withReact(createEditor()));
  }
  const editor = editorRef.current

  function handleKeyDown(e) {
    console.log(editor.selection)
    for(const hotkey in HOTKEYS){
      if(isHotkey(hotkey, e)) {
        e.preventDefault();
        const mark = HOTKEYS[hotkey];
        toggleMark(editor, mark)
      }
    }
    //If we press enter in a bulleted-list, and the current line is a bullet list without any text we want to turn it off
    // if(e.keyCode === 13 && isBlockActive(editor, 'bulleted-list')) {

    //   if(editor.selection.anchor.offset === 0) {
    //     toggleBlock(editor, 'bulleted-list');
    //   }
    // }
  }

  const Element = ({ attributes, children, element }) => {
    switch(element.type) {
      case 'heading': 
        return <h3>{children}</h3>
      case 'bulleted-list':
        return <ul {...attributes}>{children.map((child, i) => <li key={i}>{child}</li>)}</ul>
      default:
        return <p {...attributes}>{children}</p>
    }
  }

  const Leaf = ({ attributes, children, leaf}) => {
    if(leaf.bold) {
      children = <strong>{children}</strong>
    }
    if(leaf.italic) {
      children = <em>{children}</em>
    }
    if(leaf.underline) {
      children = <u>{children}</u>
    }
    if(leaf.code) {
      children = <code>{children}</code>
    }

    return <span {...attributes}>{children}</span>
  }

  return (
    <div className={style.richTextEditorContainer}>
      <Slate editor={editor} value={value} onChange={v => setValue(v)}>
        <Toolbar />
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          autoFocus
          onKeyDown={e => handleKeyDown(e)}
          className={style.test}
        >

        </Editable>
      </Slate>
    </div>
  )
}