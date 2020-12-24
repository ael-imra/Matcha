import React, { useContext, useRef, useState, useEffect } from 'react'
import '../Css/sing_up.css'
import Input from './Input'
import { DataContext } from '../Context/AppContext'
import { language } from '../Data/language/language'
import SingSocialMedia from './SingSocialMedia'
import Line from './Line'
import { useWindowSize } from './UseWindowSize'
import Axios from 'axios'

const SingUp = (props) => {
  const width = useWindowSize()
  const ctx = useContext(DataContext)
  const [findError, ChangeError] = useState(['', '', '', '', ''])
  const [dataUsers, ChangeDataUsers] = useState([])
  const inputRef = useRef([])
  inputRef.current = new Array(5)

  let insertUser = () => {
    try {
      Axios.post('http://localhost:5000/users/insert', {
        useName: inputRef.current[2].value,
        lastName: inputRef.current[1].value,
        firstName: inputRef.current[0].value,
        password: inputRef.current[3].value,
        email: inputRef.current[4].value,
      })
        .then((result) => {
          if (result.data === 'successful') props.dataHome.ChangeHome(5)
        })
        .catch((error) => {
          ctx.ChangeErrorMessages({
            error: '',
            warning: 'Error: Network Error',
            success: '',
          })
        })
    } catch (error) {
      console.log('health check error')
    }
  }

  useEffect(() => {
    let getUsers = () => {
      try {
        Axios.get('http://localhost:5000/users')
          .then((result) => {
            ChangeDataUsers(result.data)
          })
          .catch((error) => {
            ctx.ChangeErrorMessages({
              error: '',
              warning: 'Error: Network Error',
              success: '',
            })
          })
      } catch (error) {
        console.log('health check error')
      }
    }
    getUsers()
    // eslint-disable-next-line
  }, [])
  return (
    <div className="sing">
      <p
        className="t1"
        style={{ color: ctx.Mode === 'Dark' ? 'white' : 'black' }}
      >
        {language[ctx.Lang].SignuptoMatcha}
      </p>
      <SingSocialMedia titre={language[ctx.Lang].singUpINfb} />
      <Line str="Or" color={ctx.Mode} />
      <div className="form-sing">
        <div className="inline-group">
          <div className="form-group">
            <p
              className="t1"
              style={{ color: ctx.Mode === 'Dark' ? 'white' : 'black' }}
            >
              {language[ctx.Lang].FirstName}
            </p>
            <Input
              SizeGrow={1}
              type="text"
              name="Name"
              checkError={{ findError, ChangeError }}
              Ref={inputRef}
              index={0}
            />
          </div>
          <div className="form-group">
            <p
              style={{
                color: ctx.Mode === 'Dark' ? 'white' : 'black',
              }}
            >
              {language[ctx.Lang].LastName}
            </p>
            <Input
              SizeGrow={1}
              type="text"
              name="Name"
              checkError={{ findError, ChangeError }}
              Ref={inputRef}
              index={1}
            />
          </div>
        </div>
        <div className="inline-group">
          <div className="form-group">
            <p
              style={{
                color: ctx.Mode === 'Dark' ? 'white' : 'black',
              }}
            >
              {language[ctx.Lang].UseName}
            </p>
            <Input
              SizeGrow={1}
              type="text"
              name="Username"
              checkError={{ findError, ChangeError }}
              Ref={inputRef}
              index={2}
            />
          </div>
          <div className="form-group">
            <p
              style={{
                color: ctx.Mode === 'Dark' ? 'white' : 'black',
              }}
            >
              {language[ctx.Lang].password}
            </p>
            <Input
              SizeGrow={1}
              type="password"
              name="Password"
              checkError={{ findError, ChangeError }}
              Ref={inputRef}
              index={3}
            />
          </div>
        </div>
        <div className="form-group" style={{ width: '100%' }}>
          <p
            style={{
              color: ctx.Mode === 'Dark' ? 'white' : 'black',
            }}
          >
            Email
          </p>
          <Input
            SizeGrow={2}
            type="email"
            name="Email"
            checkError={{ findError, ChangeError }}
            Ref={inputRef}
            index={4}
          />
        </div>
        <button
          onClick={() => {
            let i = 0
            findError.forEach((item, key) => {
              if (item !== true) {
                inputRef.current[key].value = ''
                inputRef.current[key].className = 'Input input-error'
                inputRef.current[key].placeholder = findError[key]
                i = 1
              }
            })
            dataUsers.forEach((user) => {
              if (user.Email === inputRef.current[4].value) {
                inputRef.current[4].value = ''
                inputRef.current[4].className = 'Input input-error'
                inputRef.current[4].placeholder = 'Email is ready exist'
                i = 1
              }
              if (user.UserName === inputRef.current[2].value) {
                inputRef.current[2].value = ''
                inputRef.current[2].className = 'Input input-error'
                inputRef.current[2].placeholder = 'User Name is ready exist'
                i = 1
              }
            })
            if (i === 0) insertUser()
          }}
          className="ft_btn"
          style={{
            paddingLeft: '25px',
            paddingRight: '25px',
            marginTop: width <= 885 ? '35px' : '20px',
            backgroundColor: '#03a9f1',
          }}
        >
          {language[ctx.Lang].CreateAccount}
        </button>
        <p
          style={{
            color: ctx.Mode === 'Dark' ? 'white' : 'black',
          }}
        >
          {language[ctx.Lang].AlreadyAMember}?
          <span
            onClick={() => {
              props.dataHome.ChangeHome(3)
            }}
          >
            {language[ctx.Lang].singup2}
          </span>
        </p>
      </div>
    </div>
  )
}

export default SingUp
