import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './Components/App'
import axios from 'axios'

axios.defaults.baseURL = 'http://'+window.location.hostname+':5000/'
axios.defaults.headers.common['Authorization'] = `token ${localStorage.getItem('token')}`
ReactDOM.render(<App />, document.getElementById('root'))
