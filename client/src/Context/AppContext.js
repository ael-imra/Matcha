import React, { useState, createContext,useEffect,useRef } from 'react';
import axios from 'axios'
import io from 'socket.io-client'
import Axios from 'axios';

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
    friends:{},
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
      if (type && type === 'time') return new Date(date).toISOString().slice(10, 16).replace('T', ' ')
      if (type && type === 'date') return new Date(date).toISOString().slice(0,10)
      if(year > 0) return `${year}y`
      else if(month > 0) return `${month}mo`
      else if (days > 0) return `${days}d`
      else if (hours > 0) return `${hours}ho`
      else if (minutes > 0) return `${minutes}m`
      else if (seconds > 0) return `${seconds}s`
      return '1s'
    },
    sortUsesByDateMessages :(friends)=>{
      const values = [...Object.values(friends)]
      if (values.length > 0)
      {
        const result = values.sort((a,b)=>{
          if (a.messages && a.messages[a.messages.length - 1] === "limit" && b.messages.length > 1)
            return (1)
          else if (b.messages && b.messages[b.messages.length - 1] === "limit" && a.messages.length > 1)
            return (-1)
          else if (a.messages.length > 1 && b.messages.length > 1)
            return ((Date.now() - Date.parse(a.messages[a.messages.length - 1].date)) - (Date.now() - Date.parse(b.messages[b.messages.length - 1].date)))
          return (0)
        })
        result.map((item,index)=>result[index] = item.UserName)
        return(result)
      }
      return []
    },
    getUsers: (start,length)=> {
      axios.post(`Users`, { ...cache.filterData, start,length }).then(data=>{
        cache.users.push(...data.data)
        if (ref.changeUsers)
          ref.changeUsers([...cache.users])
      })
    },
    getMessages: (user) => {
        axios.get(`/Messages/${user.UserName}/${user.messages.length}`).then(data=>{
          if (cache.friends[user.UserName])
            cache.friends[user.UserName].messages.push(...data.data)
          else
            cache.friends[user.UserName] = {...user,messages:data.data}
          if (ref.changeFriends)
            ref.changeFriends({...cache.friends})
        })
      }
  }
  const socket = useRef(null)
  useEffect(()=>{
    const token = localStorage.getItem('token')
    console.log(token)
    if (token)
    {
      socket.current = io(`http://${window.location.hostname}:5000`)
      socket.current.on('connect',()=>socket.current.emit('token',token))
      ref.getMessage = messageObject=>{
        function makeID(messages)
        {
          if (message.length > 0 && message[message.length - 1] !== 'limit')
            return (message[message.length - 1].id + 1)
          return (1)
        }
        const {message,user} = JSON.parse(messageObject)
        const friend = cache.friends[user.UserName]
        if (friend)
          friend.messages.push({...message,id:makeID(friend.messages)})
        else
          cache.friends[user.UserName] = {...user,messages:[{...message,id:makeID(friend.messages)}]}
        if(ref.changeFriends)
          ref.changeFriends({...cache.friends})
        setTimeout(()=>ref.scrollDown(),0)
      }
      socket.current.on('message',(obj)=>{
        console.log("ON MEssage")
        ref.getMessage(obj)
      })
      socket.current.on('status',(statusObject)=>{
        console.log("ENTER STATUS",statusObject)
        const {Active,date,UserName} = JSON.parse(statusObject)
        cache.friends[UserName].Active = Active
        cache.friends[UserName].LastLogin = date
        if (ref.changeFriends)
          ref.changeFriends({...cache.friends})
      })
      ref.sendMessage = messageObject=> {
        socket.current.emit('message',JSON.stringify(messageObject))
        ref.getMessage(JSON.stringify(messageObject))
      }
      ref.scrollDown = ()=>{
        console.log("SCROOLL",ref.ChatContent)
        if (ref.ChatContent && ref.ChatContent.current)
        {
          console.dir(ref.ChatContent.current)
          ref.ChatContent.current.scrollTop = ref.ChatContent.current.scrollHeight
        }
      }
      Axios.get('Friends').then(data=>{
        if (data.data !== "bad request")
        {
          cache.friends = data.data
          if (ref.changeFriends)
            ref.changeFriends({...cache.friends})
        }
      })
    }// eslint-disable-next-line
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
