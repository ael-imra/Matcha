import React, { useState, createContext,useEffect,useRef } from 'react';
import axios from 'axios'
import io from 'socket.io-client'
import Axios from 'axios';
import createMixins from '@material-ui/core/styles/createMixins';

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
  const cache = {
    friends:[],
    users:[],
    chatUserInfo:{},
    filterData:{
      list: [],
      name: '',
      age: [18, 88],
      rating: [0, 5],
      location: [0, 1000],
      updated: false,
    }
  }
  const ref = {
    ConvertDate: (date,type)=> {
      const cmp = Math.abs(Date.now() - Date.parse(new Date(date)))
      const year = Math.floor(cmp / 31104000000)
      const month = Math.floor(cmp / 2592000000)
      const days = Math.floor(cmp / 86400000)
      const hours = Math.floor(cmp / 3600000)
      const minutes = Math.floor(cmp / 60000)
      const seconds = Math.floor(cmp / 1000)
      console.log(cmp,year,month,days,hours,minutes,seconds,"CMP")
      if (type && type === 'time') return new Date(date).toISOString().slice(10, 16).replace('T', ' ')
      if (type && type === 'date') return new Date(date).toISOString().slice(0,10)
      if(year > 0) return `${year} day${year !== 1 ? 's' : ''} ago`
      else if(month > 0) return `${month} day${month !== 1 ? 's' : ''} ago`
      else if (days > 0) return `${days} day${days !== 1 ? 's' : ''} ago`
      else if (hours > 0) return `${hours} hour${hours !== 1 ? 's' : ''} ago`
      else if (minutes > 0) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`
      else if (seconds > 0) return `${seconds} second${seconds !== 1 ? 's' : ''} ago`
    },
    sortUsesByDateMessages :(friends)=>{
      const values = Object.values(friends)
      if (values.length > 0)
      {
        const result = values.sort((a,b)=>{
          if (a.messages && b.messages && a.messages.length === 0 && b.messages.length === 0)
            return (0)
          else if (a.messages && a.messages[a.messages.length - 1] === "limit")
            return (1)
          else if (b.messages && b.messages[b.messages.length - 1] === "limit")
            return (-1)
          else if (a.messages.length > 0 && b.messages.length > 0)
            return ((Date.now() - Date.parse(a.messages[a.messages.length - 1])) - (Date.now() - Date.parse(b.messages[b.messages.length - 1])))
        })
        result.map((item,index)=>result[index] = item.UserName)
        return(result)
      }
      return []
    }
  }
  const socket = useRef(null)
  useEffect(()=>{
    const token = localStorage.getItem('token')
    if (token)
    {
      socket.current = io('http://localhost:5000')
      socket.current.on('connect',()=>socket.current.emit('token',token))
      ref.getMessage = messageObject=>{
        const {message,user} = messageObject
        if (cache.friends[user.UserName])
          cache.friends[user.UserName].messages.push(message)
        else
          cache.friends[user.UserName] = {...user,messages:[message]}
        if(ref.changeFriends)
          ref.changeFriends([...cache.friends])
      }
      socket.current.on('message',ref.getMessage)
      socket.current.on('status',(statusObject)=>{
        const {Active,date,UserName} = statusObject
        cache.friends[UserName].Active = Active
        cache.friends[UserName].LastLogin = date
        if (ref.changeFriends)
          ref.changeFriends([...cache.friends])
      })
      ref.sendMessage = messageObject=> {
        socket.current.emit('message',JSON.stringify(messageObject))
        ref.getMessage(messageObject)
      }
      ref.getUsers = (start,length)=> {
        axios.post(`Users`, { ...cache.filterData, start,length }).then(data=>{
          cache.users.push(...data.data)
          if (ref.changeUsers)
            ref.changeUsers([...cache.users])
        })
      }
      ref.getMessages = (user) => {
        axios.get(`/Messages/${user.UserName}/${user.messages.length}`).then(data=>{
          if (cache.friends[user.UserName])
            cache.friends[user.UserName].messages.push(...data.data)
          else
            cache.friends[user.UserName] = {...user,messages:data.data}
          if (ref.changeFriends)
            ref.changeFriends({...cache.friends})
        })
      }
      ref.scrollDown = ()=>{
        if (ref.chatContent && ref.chatContent.current)
          ref.chatContent.scrollTop = ref.chatContent.scrollHeight
      }
    }
    Axios.get('Friends').then(data=>cache.friends = data.data)
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
        socket,
        cache,
        ref
      }}>
      {props.children}
    </DataContext.Provider>
  );
}
