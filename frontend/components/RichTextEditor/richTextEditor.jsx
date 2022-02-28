import { useState, useCallback, useRef } from 'react';
import isHotkey from 'is-hotkey'
import { Editable, withReact, Slate} from 'slate-react';
import { createEditor } from 'slate';
import { withHistory } from 'slate-history';

import Toolbar from './Toolbar/toolbar';
import { toggleMark, toggleBlock, isListBlockActive } from '../../utils/richTextEditorFunctions';


import style from './richTextEditor.module.scss';

const initialEditorValue = [
  {
    type: 'heading',
    children: [
      {text: 'Forget pen & paper'}
    ]
  },
  {
    type: 'paragraph',
    children: [
      { text: 'You can start writing your notes here, you can make your text '},
      { text: 'bold, ', bold: true},
      { text: 'italicized ', italic: true},
      { text: 'or even create lists!'}
    ]
  },
  {
    type: 'bulleted-list',
    children: [
      { type: 'list-item', children:[{text: 'Because '}]},
      { type: 'list-item', children:[{text: 'lists'}]},
      { type: 'list-item', children:[{text: 'are'}]},
      { type: 'list-item', children:[{text: 'awesome!'}]}
    ]
  },
  {
    type: 'paragraph',
    children: [
      {text: "We have ranked note-taking methods for you"}
    ]
  },
  {
    type: 'numbered-list',
    children: [
      {type: 'list-item', children:[{text: 'Dungeons & Notes'}]},
      {type: 'list-item', children:[{text: 'Other note-taking apps.'}]}
    ]
  }
]

const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
}

export default function RichTextEditor({getEditorData}) {
  const [value, setValue] = useState(initialEditorValue);
  const renderElement = useCallback(props => <Element {...props} />, []);
  const renderLeaf = useCallback(props => <Leaf {...props} />, [])
  const editorRef = useRef();
  if(!editorRef.current) {
    editorRef.current = withHistory(withReact(createEditor()));
  }
  const editor = editorRef.current

  function handleKeyDown(e) {
    for(const hotkey in HOTKEYS){
      if(isHotkey(hotkey, e)) {
        e.preventDefault();
        const mark = HOTKEYS[hotkey];
        toggleMark(editor, mark)
      }
    }   
    
    //If we press enter in a bulleted-list, and the current line is a bullet list without any text we want to turn it off
    const listIsActive = isListBlockActive(editor)
    if(e.keyCode === 13 && listIsActive) {
      const currentPath = editor.selection.anchor.path;
      if(!Array.isArray(currentPath)) return;

      let currentNode = value;
      let currentNodeHasChanged = false;

      currentPath.forEach(index => {
        //In the first loop, the currentNode will be an array (all possible nodes), after it will be an object with text/children
        if(Array.isArray(currentNode)) {
          currentNode = currentNode[index]
        } else {
          currentNode = currentNode.children[index];
        }
        currentNodeHasChanged = true;
      })


      if(currentNode.text === '' && currentNodeHasChanged) {
        e.preventDefault();
        toggleBlock(editor, 'paragraph');
      }
      return;
    }
  }

  const Element = ({ attributes, children, element }) => {
    switch(element.type) {
      case 'heading':
        return <h3 {...attributes}>{children}</h3>
      case 'bulleted-list':
        return <ul {...attributes}>{children}</ul>
      case 'numbered-list':
        return <ol {...attributes}>{children}</ol>
      case 'list-item':
        return <li {...attributes}>{children}</li>
      default:
        return <p {...attributes}>{children}</p>
    }
  }

  const Leaf = ({ attributes, children, leaf}) => {
    if(leaf.bold) {
      children = <strong {...attributes}>{children}</strong>
    }
    if(leaf.italic) {
      children = <em {...attributes}>{children}</em>
    }
    if(leaf.underline) {
      children = <u {...attributes}>{children}</u>
    }
    if(leaf.code) {
      children = <code {...attributes}>{children}</code>
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
          className={style.editableElement}
          onBlur={() => getEditorData(value)}
        >

        </Editable>
      </Slate>
    </div>
  )
}