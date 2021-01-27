import React, { useContext } from 'react';
import '../Css/textarea.css';
import { DataContext } from '../Context/AppContext';
const Textarea = (props) => {
  const ctx = useContext(DataContext)
  let focus = (e) => {
    ctx.Mode === 'Light'
      ? (e.target.className = 'textarea Input input-active-light')
      : (e.target.className = 'Input input-dark')
  }
  let blue = (e) => {
    ctx.Mode === 'Light'
      ? (e.target.className = 'Input input-light textarea')
      : (e.target.className = 'Input input-dark textarea')
  }
  let changeDataDescribeYourself = (e) => {
    let DataStep = props.InfoStep
    DataStep.step4.DescribeYourself = e.target.value
    props.ChangeInfoStep({ ...DataStep })
  }
  return (
    <div className="input-textarea">
      <textarea
        className={`${
          ctx.Mode === 'Light' ? 'input-light' : 'input-dark'
        } Input textarea`}
        placeholder="Describe yourself ? ..."
        maxLength="100"
        onFocus={focus}
        onBlur={blue}
        value={props.InfoStep.step4.DescribeYourself}
        onChange={changeDataDescribeYourself}
      ></textarea>
    </div>
  )
}

export default Textarea;
