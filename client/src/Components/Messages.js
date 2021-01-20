import React,{useEffect, useContext} from 'react'
import { ImageLoader } from './ImageLoader'
import Axios from 'axios'
import '../Css/Messages.css'
import { DataContext } from '../Context/AppContext'
import {ConvertDate} from './Friends'

function Message(props) {
  console.log(props.message.date,"DATE")
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
          {props.IsRead > 0 ?<div className="MessageCountNewMessage">{props.IsRead}</div>:null}
        </div>
      </div>
    </div>
  )
}
function Messages(props) {
  const ctx = useContext(DataContext)
  function getUserIndex(messages,UserName)
  {
    let index = -1
    if (messages.length > 0)
      messages.map((item,idx) => index = item.UserName === UserName ? idx : index)
    return (index)
  }
  function sortMessages(messages)
  {
    const result = messages.sort((a,b)=>{
      if (a.messages && b.messages && a.messages[a.messages.length - 1] === 'limit' && b.messages[b.messages.length - 1] === 'limit')
        return (0)
      else if (a.messages && a.messages[a.messages.length - 1] === 'limit')
        return (1)
      else if (b.messages && b.messages[b.messages.length - 1] === 'limit')
        return (-1)
      else if(a.messages&&b.messages)
        return ((Date.now()-Date.parse(a.messages[a.messages.length - 1].date))-(Date.now()-Date.parse(b.messages[b.messages.length - 1].date)))
      return (0)
    })
    return(result)
  }
  useEffect(()=>{
    Axios.get('/Messages').then(data=>{
      if (data.data !== "Messages Not Found")
      {
        if (ctx.messagesData.length > 0)
        {
          data.data.map(item=>{
            const index = getUserIndex(ctx.messagesData,item.UserName)
            if (index > -1)
              ctx.messagesData[index].messages = item.messages.length > ctx.messagesData[index].messages.length ? item.messages : ctx.messagesData[index].messages
            else
              ctx.messagesData = {...ctx.messagesData,item}
          })
          ctx.messagesData = sortMessages(ctx.messagesData)
        }
        else
          ctx.messagesData = [...data.data]
        props.changeMessages([...ctx.messagesData])
      }
    })// eslint-disable-next-line
  },[])
  return (
    <div className="Messages" style={props.style ? props.style : {}}>
      {props.messages.length > 0 ? props.messages.map(obj => {
        console.log("OB",obj)
        if (obj.messages && (obj.messages[0] !== 'limit' || obj.messages.length > 1))
          return (<Message
            key={obj.IdUserOwner}
            message={obj.messages ? obj.messages[obj.messages.length - 1]:{Content:"",date:'2021-01-18T19:15:37.000Z',myMessage:0}}
            IsRead={obj.IsRead}
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
