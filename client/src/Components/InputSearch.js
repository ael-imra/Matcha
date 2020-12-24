import React, { useRef, useContext } from 'react'
import '../Css/InputSearch.css'
import { DataContext } from '../Context/AppContext'

const InputSearch = (props) => {
  const ctx = useContext(DataContext)
  const RefSearch = useRef()
  let focus = () => {
    ctx.Mode === 'Light'
      ? (RefSearch.current.classList.value = 'search search-active input-light')
      : (RefSearch.current.classList.value = 'search search-active input-dark')
    //  = '';
    RefSearch.current.children[0].placeholder = 'Add Language'
    RefSearch.current.children[1].classList.add('AnimationBtn')
  }
  let blur = () => {
    ctx.Mode === 'Light'
      ? (RefSearch.current.classList.value = 'search input-light')
      : (RefSearch.current.classList.value = 'search input-dark')
    RefSearch.current.children[1].classList.remove('AnimationBtn')
  }
  let click = () => {
    let arry = props.language.arr
    if (
      props.filter.includes(
        RefSearch.current.children[0].value.toLowerCase()
      ) &&
      !props.language.arr.includes(RefSearch.current.children[0].value) &&
      props.language.arr.length < 3
    ) {
      arry.push(RefSearch.current.children[0].value)
      RefSearch.current.children[0].value = ''
      props.changeLang({ arr: arry })
      RefSearch.current.children[0].focus()
    } else {
      RefSearch.current.children[0].focus()
      RefSearch.current.children[0].value = ''
      RefSearch.current.classList.value = 'search error'
      RefSearch.current.classList.add('AnimationBtn')
      RefSearch.current.children[0].placeholder = 'something is wrong'
    }
  }
  return (
    <div
      className={`search ${
        ctx.Mode === 'Light' ? 'input-light' : 'input-dark'
      }`}
      ref={RefSearch}
    >
      <input
        type="text"
        className="search-input"
        placeholder="Add Language"
        onFocus={focus}
        onBlur={blur}
      />
      <button className="search-button" onClick={click}>
        Add
      </button>
    </div>
  )
}

export default InputSearch
