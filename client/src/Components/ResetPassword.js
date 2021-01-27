import React, { useContext, useRef, useState, useEffect } from 'react'
import { useWindowSize } from './UseWindowSize'
import { DataContext } from '../Context/AppContext'
import Input from './Input'
import { useHistory, useParams } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import ImageForgetPassword from '../Images/forgot-password-animate.svg'
import Axios from 'axios'
const ResetPassword = () => {
  const width = useWindowSize()
  const ctx = useContext(DataContext)
  const [findError, ChangeError] = useState(['', ''])
  const [DataInput, saveDataInput] = useState([])
  const inputRef = useRef([])
  let history = useHistory()
  let { token } = useParams()
  inputRef.current = new Array(2)
  useEffect(() => {
    saveDataInput(inputRef.current)
    inputRef.current[0].focus()
  }, [])
  useEffect(() => {
    try {
      Axios.get(`/user/verifierToken/${token}`)
        .then((result) => {
          if (result.data[0].Count === 0) {
            ctx.ChangeErrorMessages({
              error: 'Token not found',
              warning: '',
              success: '',
            })
            history.push(`/`)
          }
        })
        .catch((error) => {})
    } catch (error) {
      console.log('health check error')
    }
    // eslint-disable-next-line
  }, [])
  let UpdatePassword = () => {
    let i = -1
    findError.forEach((item, key) => {
      if (item !== true) {
        i = 1
        DataInput[key].value = ''
        DataInput[key].className = 'Input input-error'
        DataInput[key].placeholder = findError[key]
      }
    })
    if (DataInput[0].value !== DataInput[1].value) {
      DataInput[1].value = ''
      DataInput[1].className = 'Input input-error'
      DataInput[1].placeholder = 'password not match'
    } else if (i === -1)
      try {
        Axios.post('http://localhost:5000/user/ResetPassword', {
          password: DataInput[0].value,
          confirm: DataInput[1].value,
          token: token,
        })
          .then((result) => {
            ctx.ChangeErrorMessages({
              error: '',
              warning: '',
              success: 'Your password has been reset successfully!',
            })
            history.push(`/`)
          })
          .catch((error) => {
            ctx.ChangeErrorMessages({
              error: '',
              warning: 'Error: Network Error',
              success: '',
            })
          })
      } catch (error) {
        console.log(error)
      }
  }
  return (
    <div className="Step">
      <div
        style={{
          width: '580px',
          height: '550px',
          transform: 'translateY(-30px)',
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <p
          className="t3"
          style={{
            marginBottom: '37px',
            marginTop: '0px',
            color: ctx.Mode === 'Dark' ? 'white' : 'black',
            fontSize: width <= 885 ? '18px' : '28px',
          }}
        >
          Reset Password
        </p>
        <div className="form-group" style={{ width: '100%' }}>
          <p
            style={{
              color: ctx.Mode === 'Dark' ? 'white' : 'black',
            }}
          >
            New password
          </p>
          <Input
            type="password"
            name="Password"
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
            New password
          </p>
          <Input
            type="password"
            name="Password"
            checkError={{ findError, ChangeError }}
            index={1}
            Ref={inputRef}
          />
        </div>
        <Button
          variant="contained"
          color="primary"
          onClick={UpdatePassword}
          style={{
            fontWeight: '900',
            borderRadius: '8px',
            backgroundColor: '#03a9f1',
            marginTop: '20px',
          }}
        >
          Create New Password
        </Button>
      </div>
      <div className="Image-step">
        <img src={ImageForgetPassword} alt="..." />
      </div>
    </div>
  )
}

export default ResetPassword
