import { useState, useEffect } from 'react';
import clsx from 'clsx'

import style from '../Input/input.module.scss';

export default function TextArea({
  name = null,
  id = null,
  required = false,
  placeholderText = '',
  passedRef = null,
  hasLabel = false,
  labelText = '',
  error = null,
  passedClass = '',
  inputCallBack = null,
  rows = 10,
  defaultValue = null
}){
  const [shouldShowError, setShouldShowError] = useState(false)

  useEffect(() => {
    if(error !== null) {
      setShouldShowError(true)
    }
  }, [error])

  function onInputTouch(){
    if(error && shouldShowError) setShouldShowError(false)
    if(inputCallBack) inputCallBack();
  }

  return (
    <>
      {hasLabel && labelText && id && <label htmlFor={id}>{labelText}</label> }
      <textarea
        name={name}
        id={id}
        required={required}
        placeholder={placeholderText}
        ref={passedRef}
        className={clsx([style.input, shouldShowError && style.hasError, passedClass, style.textArea])}
        onFocus={onInputTouch}
        rows={rows}
        defaultValue={defaultValue ? defaultValue : ''}
        >
        </textarea>
      {shouldShowError && <span className={style.errorText}>
        {error.text}
        {Array.isArray(error.listItems) && error.listItems.length > 0 && <ul>
          {error.listItems.map((item) => <li key={`error-list-${item}`}>{item}</li>)}
        </ul>}
      </span>}
    </>
  )
}