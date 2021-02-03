import React, { useContext, useEffect } from 'react'
import '../Css/ft-input.css'
import { Validate } from './Validate'
import { DataContext } from '../Context/AppContext'

const FtInput = (props) => {
  let ArrError = props.checkError.findError
  const ctx = useContext(DataContext)
  let blue = (e) => {
    ctx.Mode === 'Light' ? (e.target.className = 'Input input-light') : (e.target.className = 'Input input-dark')
    let ArrayError = props.checkError.findError
    if (!Validate(props.name, e.target.value)) {
      ArrayError[props.index] = e.target.value.length === 0 ? 'the input is empty' : `${props.name} not valid`
    } else ArrayError[props.index] = Validate(props.name, e.target.value)
    props.checkError.ChangeError([...ArrayError])
  }
  let focus = (e) => {
    if (e.target.className === 'Input input-error') e.target.placeholder = ''
    ctx.Mode === 'Light' ? (e.target.className = 'Input input-active-light') : (e.target.className = 'Input input-active-dark')
  }
  useEffect(() => {
    if (ArrError[props.index] === '') ArrError[props.index] = 'the input is empty'
    props.checkError.ChangeError([...ArrError])
    // eslint-disable-next-line
  }, [])
  return <input type={props.type} onBlur={blue} onFocus={focus} className={ctx.Mode === 'Light' ? 'Input input-light' : 'Input input-dark'} ref={(el) => (props.Ref.current[props.index] = el)} />
}

export default FtInput
