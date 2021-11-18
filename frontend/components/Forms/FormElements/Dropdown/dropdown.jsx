import style from './dropdown.module.scss';

export default function Dropdown({options, label = '', id = '', required = false, name = ''}){
  return (
    <>
    {label &&  id && <label htmlFor={id} className={style.label}>{label}</label>}
      <select className={style.select} id={id} required={required} name={name}>
        {options.map((option) => <option value={option.value} className={style.option} key={option.value}>{option.title}</option>)}
      </select>
    </>
  )
}