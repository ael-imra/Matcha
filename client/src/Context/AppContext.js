import React, { useState, createContext,useEffect,useRef } from 'react';
import axios from 'axios'
import io from 'socket.io-client'
import Axios from 'axios';
import { useHistory } from 'react-router-dom';

export const DataContext = createContext();
export default function AppContext(props) {
  let history = useHistory();
  const [Mode, changeMode] = useState('Light');
  const [Lang, changeLang] = useState(0);
  const [isLogin,changeIsLogin] = useState('')
  const [userInfo, changeUserInfo] = useState({});
  const [ErrorMessages, ChangeErrorMessages] = useState({
    error: '',
    warning: '',
    success: '',
  })
  const cache = {
    friends:{},
    users:[],
    notifications:{
      data:[],
      IsRead:0
    },
    IsRead:{
      messages:0,
      notifications:0
    },
    chatUserInfo:{},
    filterData:{
      list: [],
      name: '',
      age: [18, 88],
      rating: [0, 5],
      location: [0, 1000],
      updated: false,
    },
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
      else if (hours > 0) return `${hours}h`
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
    readMessages:(UserName)=>{
      if (UserName)
      {
        Axios.get(`Messages/readMessages/${UserName}`).then((data)=>{
            if (cache.friends[UserName])
              cache.friends[UserName].IsRead = 0
            ref.countIsRead()
        })
      }
    },
    readNotifications:()=>{
        Axios.get(`Notifications/readNotifications`).then(()=>{
          cache.notifications.IsRead = 0
          ref.countIsRead()
        })
    },
    removeDeplicate:(array1,array2)=>{
      return ([...array1.filter(item1=>{
        let find = true
        array2.map(item2=>find = item1.IdUserOwner === item2.IdUserOwner ? false:find)
        return (find)
      }),...array2])
    },
    getUsers: (start,length)=> {
        if (ref.changeUsersLoader)
          ref.changeUsersLoader(true)
      axios.post(`Users`, { ...cache.filterData, start,length }).then(data=>{
        cache.users = ref.removeDeplicate(cache.users,data.data)
        if (ref.changeUsers)
        {
          ref.changeUsers([...cache.users])
          ref.changeUsersLoader(false)
        }
      })
    },
    getMessages: (user) => {
      let oldHeight = null
      if (ref.ChatContent)
        oldHeight = ref.ChatContent.current.scrollHeight
      if (ref.changeHideLoader)
        ref.changeHideLoader(false)
      axios.get(`Messages/${user.UserName}/${user.messages.length}`).then(data=>{
        if (cache.friends[user.UserName])
          cache.friends[user.UserName].messages = [...data.data,...cache.friends[user.UserName].messages]
        else
          cache.friends[user.UserName] = {...user,messages:data.data}
        if (ref.changeFriends)
          ref.changeFriends({...cache.friends})
        if (ref.changeHideLoader)
          ref.changeHideLoader(true)
        if (oldHeight && ref.ChatContent)
          ref.ChatContent.current.scrollTop = ref.ChatContent.current.scrollHeight - oldHeight
        ref.countIsRead()
      })
    },
    getNotifications:()=>{
      if (ref.changeHideLoader)
        ref.changeHideLoader(false)
      axios.get(`Notifications/${cache.notifications.data.length}`).then(data=>{
        if (data.data!== "None" && data.data !== 'Bad request')
        {
          cache.notifications.data.push(...data.data.data)
          cache.notifications.IsRead = data.data.IsRead
          if (ref.changeNotifications)
            ref.changeNotifications({...cache.notifications})
          if (ref.changeHideLoader)
            ref.changeHideLoader(true)
          ref.countIsRead()
        }
      })
    },
    addFriend:(user)=>{
      cache.friends[user.UserName] = {...user}
      if (ref.changeFriends)
        ref.changeFriends({...cache.friends})
    },
    removeFriend:(userName)=>{
      if (ref.changeChatUserInfo)
        ref.changeChatUserInfo({})
      if (cache.friends[userName])
      {
        delete cache.friends[userName]
        if (ref.changeFriends)
          ref.changeFriends({...cache.friends})
      }
    },
    removeNotification:(userName)=>{
      if (cache.notifications.data.length > 0)
      {
        cache.notifications.data.map((item,index)=>{
          if (item.UserName === userName)
            delete cache.notifications.data[index]
          return (item)
        })
        if (ref.changeNotifications)
          ref.changeNotifications({...cache.notifications})
      }
    },
    countIsRead:()=>{
      setTimeout(()=>{
        let countMessages = 0
        Object.values(cache.friends).map(value=>value.IsRead > 0?countMessages++:0)
        cache.IsRead.messages = countMessages
        cache.IsRead.notifications = cache.notifications.IsRead
        if (ref.changeIsRead)
          ref.changeIsRead({...cache.IsRead})
      },500)
    },
    search:(search,type)=>{
      if (search && ref.changeNotifications && type==='notifications')
        ref.changeNotifications({data:[...cache.notifications.data.filter(item=>item.UserName.indexOf(search)>-1)],IsRead:cache.notifications.IsRead})
      else if (search && ref.changeFriends)
      {
        ref.changeFriends((oldValue)=>{
          const newObject = {}
          Object.keys(oldValue).map(key=>{
            if (key.indexOf(search) > -1)
              newObject[key] = oldValue[key]
            return key
          })
          return (newObject)
        })
      }
      else if (ref.changeFriends)
        ref.changeFriends({...cache.friends})
    },
    reconfigAxios:()=>{
      Axios.defaults.baseURL = 'http://'+window.location.hostname+':5000/'
      Axios.defaults.headers.common['Authorization'] = `token ${localStorage.getItem('token')}`;
    }
  }
  const socket = useRef(null)
  useEffect(()=>{
    ref.reconfigAxios()
    try {
      Axios.get('/users')
        .then((result) => {
          if (result.data.IsActive === 2) 
            history.push('/step');
          changeIsLogin(result.data.IsActive === 1 ? 'Login' : result.data.IsActive === 2 ? 'Step' : 'Not login')
        })
        .catch((error) => {});
    } catch (error) {}// eslint-disable-next-line
  },[])
  useEffect(()=>{
    ref.reconfigAxios()
    if (isLogin && isLogin === 'Login')
    {
      try{
        socket.current = io(`http://${window.location.hostname}:5000`)
        socket.current.on('connect',()=>{
          socket.current.emit('token',localStorage.getItem('token'))
          ref.getMessage = messageObject=>{
            function makeID(messages)
            {
              if (messages.length > 0 && messages[messages.length - 1] !== 'limit')
                return (messages[messages.length - 1].id + 1)
              return (1)
            }
            const {message,user} = JSON.parse(messageObject)
            const myInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')):{}
            const friend = cache.friends[user.UserName]
            if (friend)
              friend.messages.push({...message,id:makeID(friend.messages)})
            else
              cache.friends[user.UserName] = {...user,messages:[{...message,id:makeID(friend.messages)}]}
            cache.friends[user.UserName].IsRead = myInfo.IdUserOwner !== message.IdUserOwner ? cache.friends[user.UserName].IsRead + 1 : cache.friends[user.UserName].IsRead
            if (cache.chatUserInfo.UserName)
              ref.readMessages(cache.chatUserInfo.UserName)
            if(ref.changeFriends)
              ref.changeFriends({...cache.friends})
            setTimeout(()=>ref.scrollDown(),0)
            ref.countIsRead()
          }
          socket.current.on('message',(obj)=>{
            ref.getMessage(obj)
          })
          socket.current.on('notice',(noticeObject)=>{
            const {user,Type,IdNotification,DateCreation} = JSON.parse(noticeObject)
            if (Type === "LikedBack")
              ref.addFriend(user)
            cache.notifications.data = [{IdNotification,Type,DateCreation,UserName:user.UserName,Images:user.Images},...cache.notifications.data]
            cache.notifications.IsRead = cache.notifications.IsRead + 1
            if (ref.changeNotifications)
            {
              ref.readNotifications()
              ref.changeNotifications({...cache.notifications})
            }
            ref.countIsRead()
          })
          socket.current.on('status',(statusObject)=>{
            const {Active,date,UserName} = JSON.parse(statusObject)
            if (cache.friends[UserName])
            {
              cache.friends[UserName].Active = Active
              cache.friends[UserName].LastLogin = date
              if (ref.changeFriends)
                ref.changeFriends({...cache.friends})
            }
          })
        })
      }catch(err){}
      ref.sendMessage = messageObject=> {
        socket.current.emit('message',JSON.stringify(messageObject))
        // ref.getMessage(JSON.stringify(messageObject))
      }
      ref.scrollDown = ()=>{
        if (ref.ChatContent && ref.ChatContent.current)
          ref.ChatContent.current.scrollTop = ref.ChatContent.current.scrollHeight
      }
      ref.getNotifications()
      Axios.get('Friends').then(data=>{
        if (data.data !== "bad request" && data.data !== 'You Need At lest One Image to do This Action')
        {
          cache.friends = data.data
          setTimeout(()=>{
            if (ref.changeFriends)
            ref.changeFriends({...cache.friends})
          },0)
          ref.countIsRead()
        }
      })
    }// eslint-disable-next-line
  },[isLogin])

  return (
    <DataContext.Provider
      value={{
        Mode,
        Lang,
        changeLang,
        changeMode,
        ErrorMessages,
        ChangeErrorMessages,
        userInfo,
        changeUserInfo,
        socket,
        ref,
        cache,
        isLogin,
        changeIsLogin:(params)=>{
          ref.reconfigAxios()
          changeIsLogin(params)
        }
      }}>
      {props.children}
    </DataContext.Provider>
  );
}
