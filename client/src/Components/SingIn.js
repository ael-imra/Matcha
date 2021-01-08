import React, { useContext, useRef, useState, useEffect } from 'react'
import SingSocialMedia from './SingSocialMedia'
import { language } from '../Data/language/language'
import { DataContext } from '../Context/AppContext'
import Input from './Input'
import Line from './Line'
import Axios from 'axios'
import { useWindowSize } from './UseWindowSize'
const SingIn = (props) => {
  const ctx = useContext(DataContext)
  const [findError, ChangeError] = useState(['', ''])
  const [DataInput, saveDataInput] = useState([])
  const inputRef = useRef([])
  inputRef.current = new Array(2)
  const width = useWindowSize()
  useEffect(() => {
    saveDataInput(inputRef.current)
    inputRef.current[0].focus()
  }, [])
  return (
    <div className="sing">
      <p
        className="t1"
        style={{ color: ctx.Mode === 'Dark' ? 'white' : 'black' }}
      >
        Sing in To matcha
      </p>
      <SingSocialMedia titre={language[ctx.Lang].LoginINfb} />
      <Line str={'Or'} color={ctx.Mode} />
      <div className="form-sing">
        <div className="form-group" style={{ width: '100%' }}>
          <p
            style={{
              color: ctx.Mode === 'Dark' ? 'white' : 'black',
            }}
          >
            Email
          </p>
          <Input
            type="email"
            name="Email"
            checkError={{ findError, ChangeError }}
            index={0}
            Ref={inputRef}
          />
        </div>
        <div className="form-group" style={{ width: '100%' }}>
          <p
            style={{
              color: ctx.Mode === 'Dark' ? 'white' : 'black',
            }}
          >
            Password
          </p>
          <Input
            type="password"
            name="Password"
            checkError={{ findError, ChangeError }}
            index={1}
            Ref={inputRef}
          />
        </div>
        <div
          style={{
            width: '100%',
            height: '30px',
            position: 'relative',
          }}
        >
          <p
            style={{
              position: 'absolute',
              right: '15px',
              cursor: 'pointer',
              top: '5px',
              color: ctx.Mode === 'Dark' ? 'white' : 'black',
            }}
            onClick={() => {
              props.dataHome.ChangeHome(4)
            }}
            className="t2"
          >
            {language[ctx.Lang].forgotPassword}?
          </p>
        </div>
        <button
          onClick={() => {
            try {
              Axios.post('Authentication/Login', {
                Password: DataInput[1].value,
                Email: DataInput[0].value,
              })
                .then((result) => {
                  findError.forEach((item, key) => {
                    if (item !== true) {
                      DataInput[key].value = ''
                      DataInput[key].className = 'Input input-error'
                      DataInput[key].placeholder = findError[key]
                    }
                  })
                  if (
                    Object.prototype.toString.call(result.data) ===
                    '[object Object]'
                  ) {
                    localStorage.setItem('token', result.data.accessToken)
                    localStorage.setItem('data', JSON.stringify(result.data.data))
                    if (result.data.data.IsActive) {
                      props.dataHome.ChangeIsLogin(0)
                    }
                  } else {
                    DataInput[0].value = ''
                    DataInput[1].value = ''
                    if (result.data === 'account is not active')
                      ctx.ChangeErrorMessages({
                        error: '',
                        warning:
                          'This account is deactivated please visit your email',
                        success: '',
                      })
                    else
                      ctx.ChangeErrorMessages({
                        error:
                          'We couldn’t find an account matching the Email and password you entered.Please check your Email and password and try again.',
                        warning: '',
                        success: '',
                      })
                  }
                })
                .catch((error) => {
                  ctx.ChangeErrorMessages({
                    error: '',
                    warning: error,
                    success: '',
                  })
                })
            } catch (error) {}
          }}
          className="ft_btn"
          style={{
            paddingLeft: '25px',
            paddingRight: '25px',
            marginTop: width <= 885 ? '35px' : '20px',
            backgroundColor: '#03a9f1',
          }}
        >
          {language[ctx.Lang].login}
        </button>
        <p
          style={{
            color: ctx.Mode === 'Dark' ? 'white' : 'black',
          }}
        >
          Already a member?
          <span
            onClick={() => {
              props.dataHome.ChangeHome(2)
            }}
          >
            Sing in
          </span>
        </p>
      </div>
    </div>
  )
}

export default SingIn
