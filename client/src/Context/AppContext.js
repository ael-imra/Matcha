import React, { useState, createContext,useEffect,useRef } from 'react';
import axios from 'axios'
import io from 'socket.io-client'

export const DataContext = createContext();
export default function AppContext(props) {
  const [Mode, changeMode] = useState('Light');
  const [Lang, changeLang] = useState(0);
  const [userInfo, changeUserInfo] = useState({});
  const [ErrorMessages, ChangeErrorMessages] = useState({
    error: '',
    warning: '',
    success: '',
  })
  let filterData = {
    list: [],
    name: '',
    age: [18, 88],
    rating: [0, 5],
    location: [0, 1000],
    updated: false,
  }
  const friendsList = []
  const usersData = []
  const messagesData = {}
  const chatUserInfo = [null]
  const socket= useRef(null)
  function getUsersData(start,length) {
    return axios.post(`Users`, { ...filterData, start,length })
  }
  console.log("inside Context")
  useEffect(()=>{
    const token = localStorage.getItem('token')
    if (token)
    {
      socket.current = io('http://localhost:5000')
      // socket.current.on('message',(obj)=>console.log("message 111"))
      socket.current.on('connect',()=>socket.current.emit('token',token))
    }
  },[])

  return (
    <DataContext.Provider
      value={{
        Mode,
        changeMode,
        Lang,
        changeLang,
        ErrorMessages,
        ChangeErrorMessages,
        userInfo,
        changeUserInfo,
        filterData,
        usersData,
        getUsersData,
        messagesData,
        friendsList,
        chatUserInfo,
        socket
      }}>
      {props.children}
    </DataContext.Provider>
  );
}
