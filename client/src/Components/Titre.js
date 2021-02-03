import React, { useContext } from 'react'
import { DataContext } from '../Context/AppContext'
import '../Css/titre.css'
import { language } from '../Data/language/language'

const Titre = (props) => {
  const ctx = useContext(DataContext)
  return (
    <div className="titre">
      <p style={{ color: ctx.Mode === 'Dark' ? 'white' : 'black' }}>{language[ctx.Lang].titre_home}</p>
      <button
        className="ft_btn"
        onClick={() => {
          props.dataHome.ChangeHome(2)
        }}
      >
        {language[ctx.Lang].singup}
      </button>
    </div>
  )
}

export default Titre
