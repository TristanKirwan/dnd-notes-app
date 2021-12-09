import clsx from 'clsx';

import style from './dropdown.module.scss';

export default function Dropdown({options, label = '', id = '', required = false, name = '', defaultValue = null, onChangeCallback = null, dropdownClass = null}){
  return (
    <>
    {label &&  id && <label htmlFor={id} className={style.label}>{label}</label>}
      <select className={clsx([style.select, dropdownClass])} id={id} required={required} name={name} onChange={(e) => onChangeCallback ? onChangeCallback(e.target.value) : null} defaultValue={defaultValue}>
        {options.map((option) => <option value={option.value} className={style.option} key={option.value}>{option.title}</option>)}
      </select>
    </>
  )
}