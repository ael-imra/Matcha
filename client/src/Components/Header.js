import React, { useContext } from 'react'
import '../Css/header.css'
import logo from '../Images/logo.svg'
import { DataContext } from '../Context/AppContext'
import { Toggle } from './Switch'
import { language } from '../Data/language/language'
import { useLocation } from 'react-router-dom'
import { useHistory } from 'react-router-dom'
import Axios from 'axios'

const Header = (props) => {
  let location = useLocation()
  let history = useHistory()
  const ctx = useContext(DataContext)
  return (
    <div className="header">
      <div className="logo">
        <img src={logo} alt="..." />
        <p
          style={{
            color: ctx.Mode === 'Dark' ? 'white' : 'black',
          }}
        >
          Matcha
        </p>
      </div>
      <div className="menu">
        <Toggle
          list={['Light', 'Dark']}
          active={ctx.Mode}
          switch={() => {
            ctx.changeMode((oldValue) => (oldValue === 'Light' ? 'Dark' : 'Light'))
          }}
          colors={['#03a9f1', '#292f3f']}
        />
        <button
          className="ft_btn"
          style={{ height: '33px' }}
          onClick={() => {
            if (location.pathname.includes('/step')) {
              try {
                Axios.get('/Authentication/Logout').then((result) => {
                  if (result.data === `You're now logout`) {
                    localStorage.removeItem('token')
                    localStorage.removeItem('userInfo')
                    history.push('/')
                  }
                })
              } catch (error) {}
            } else {
              history.push('/')
              props.dataHome.StateHome === 3 ? props.dataHome.ChangeHome(2) : props.dataHome.ChangeHome(3)
            }
          }}
        >
          {location.pathname.includes('/step') ? 'logout' : props.dataHome.StateHome === 3 ? language[ctx.Lang].singup2 : language[ctx.Lang].singin}
        </button>
      </div>
    </div>
  )
}

export default Header
