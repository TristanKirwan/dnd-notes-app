import { useEffect, useState } from 'react';
import clsx from 'clsx';

import style from './input.module.scss';

export default function Input({
  type,
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
  onKeyPressFunction = null
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

  function onKeyDown(e){
    if(shouldShowError) setShouldShowError(false);
    if(onKeyPressFunction) onKeyPressFunction(e);
    return;
  }

  return (
    <>
      {hasLabel && labelText && id && <label htmlFor={id}>{labelText}</label> }
      <input type={type} 
        name={name}
        id={id}
        required={required}
        placeholder={placeholderText}
        ref={passedRef}
        className={clsx([style.input, shouldShowError && style.hasError, passedClass])}
        onFocus={onInputTouch}
        onKeyDown={(e) => onKeyDown(e)}
        ></input>
      {shouldShowError && <span className={style.errorText}>
        {error.text}
        {Array.isArray(error.listItems) && error.listItems.length > 0 && <ul>
          {error.listItems.map((item) => <li key={`error-list-${item}`}>{item}</li>)}
        </ul>}
      </span>}
    </>
  )
}