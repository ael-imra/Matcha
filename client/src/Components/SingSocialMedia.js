import React, { useContext } from 'react'
import fb from '../Images/fb-logo-dark.png'
import gmailDark from '../Images/gmail-dr.png'
import gmailLight from '../Images/gmail-lg.png'
import '../Css/singSocialMedia.css'
import { DataContext } from '../Context/AppContext'

const SingSocialMedia = (props) => {
  const ctx = useContext(DataContext)
  return (
    <div className="sing-social-media">
      <div className="sing-fb">
        <img src={fb} alt="..." /> <p>{props.titre}</p>
      </div>
      <div
        className="sing-gmail"
        style={{
          backgroundColor: ctx.Mode === 'Dark' ? '#373e4e' : '#eef2fe',
        }}
      >
        <img src={ctx.Mode === 'Dark' ? gmailDark : gmailLight} alt="..." />
      </div>
    </div>
  )
}

export default SingSocialMedia
