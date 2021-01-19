import React,{useState,useEffect, useContext} from 'react'
import { ImageLoader } from './ImageLoader'
import Axios from 'axios'
import '../Css/Messages.css'
import { DataContext } from '../Context/AppContext'
import {ConvertDate} from './Friends'

function Message(props) {
  return (
    <div className="Message" onClick={props.onClick}>
      <ImageLoader className="MessageImage" src={props.img} alt={props.name} />
      <div className="MessageColumn">
        <div className="MessageRow">
          <div className="MessageNameFriend">{props.name}</div>
          <div className="MessageDateLastMessage">
            {ConvertDate(props.message.date)}
          </div>
        </div>
        <div className="MessageRow">
          <div className="MessageLastMessage">
            {props.message.Content}
          </div>
          {props.message.IsRead > 0 ?<div className="MessageCountNewMessage">{props.message.IsRead}</div>:null}
        </div>
      </div>
    </div>
  )
}
function Messages(props) {
  const ctx = useContext(DataContext)
  useEffect(()=>{
    console.log("MESSG",{...props.messages})
    ctx.socket.current.on('message',(obj)=>{
      const {Content,UserName,date} = JSON.parse(obj)
      props.changeMessages(oldValue=>{
        oldValue[UserName].messages.push({Content,date,isRead:0,myMessage:0})
        const newObj = {[UserName]:oldValue[UserName],...oldValue}
        ctx.messagesData = newObj
        return (newObj)
      })
    })
    function sortMessages(messages)
    {
      const newObj = {}
      const result = Object.values(messages).sort((a,b)=>{
        if (a.messages[a.messages.length - 1] === 'limit' && b.messages[b.messages.length - 1] === 'limit')
          return (0)
        else if (a.messages[a.messages.length - 1] === 'limit')
          return (1)
        else if (b.messages[b.messages.length - 1] === 'limit')
          return (-1)
        return ((Date.now()-Date.parse(a.messages[a.messages.length - 1].date))-(Date.now()-Date.parse(b.messages[b.messages.length - 1].date)))
      })
      result.map(item=>newObj[item.UserName] = item)
      return(newObj)
    }
    Axios.get('/Messages').then(data=>{
      if (data.data !== "Messages Not Found")
      {
        ctx.messagesData = sortMessages({...data.data,...ctx.messagesData})
        props.changeMessages({...ctx.messagesData})
      }
    })// eslint-disable-next-line
  },[])
  return (
    <div className="Messages" style={props.style ? props.style : {}}>
      {Object.values(props.messages) && Object.values(props.messages).length > 0 ? Object.values(props.messages).map((obj,index) => {
        if (obj.messages[0] !== 'limit' || obj.messages.length > 1)
          return (<Message
            key={index}
            message={obj.messages ? obj.messages[obj.messages.length - 1]:{Content:"",date:'2021-01-18 19:15:37',IsRead:1,myMessage:0}}
            name={obj.UserName}
            img={obj.Images}
            onClick={() => props.changeChatUserInfo({IdUserOwner:obj.IdUserOwner,UserName:obj.UserName,Images:obj.Images})}
          />)
        return null
      }):null}
    </div>
  )
}
export { Messages, ConvertDate }
