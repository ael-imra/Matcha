import React, { useState, useEffect, useRef, useContext } from 'react'
import { Loader } from './Loader'
import { ConvertDate } from './Friends'
import { DataContext } from '../Context/AppContext'
import {
  IconSendMessage,
  IconArrowDownChat,
} from './Icons'
import '../Css/Chat.css'
import Axios from 'axios'
import { ImageLoader } from './ImageLoader'

function ChatMessage(props) {
  const [hideDeleteMessage, changeHideDeleteMessage] = useState(false)
  return (
    <div
      className="chatMessage"
      style={{
        justifyContent: props.pos === 'left' ? 'flex-start' : 'flex-end',
      }}
    >
      <div
        className="ChatMessageContent"
        style={{
          backgroundColor: props.background,
          color: props.color,
        }}
        onClick={() => changeHideDeleteMessage((oldValue) => !oldValue)}
      >
        <div className="ChatMessageText">{props.message}</div>
        <div className="ChatMessageTime">{props.time}</div>
      </div>
      <div
        className="ChatMessageDelete"
        title="delete"
        style={{
          left: props.pos === 'left' ? '85%' : '0',
          display: hideDeleteMessage ? 'block' : 'none',
        }}
      >
        <div style={{ color: 'red', fontSize: '13px', cursor: 'pointer' }}>
          delete
        </div>
      </div>
    </div>
  )
}
function Chat(props) {
  const [hideScrollDown, changeHideScrollDown] = useState(false)
  const [hideLoader, changeHideLoader] = useState(true)
  const ctx = useContext(DataContext)
  const ChatContent = useRef()
  const chatTextValue=useRef("")
  const UserName = props.chatUserInfo.UserName
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
  function getUserIndex(messages,UserName)
  {
    let index = -1
    messages.map((item,idx) => index = item.UserName === UserName ? idx : index)
    return (index)
  }
  const index = getUserIndex(ctx.messagesData,UserName)
  function getMessages(UserName) {
    const length = (props.messages.length > 0 && ctx.messagesData[index])? ctx.messagesData[index].messages.length : 0
    Axios.get(`/Messages/${UserName}/${length}`).then(data=>
    {
      const oldHeight = ChatContent.current.scrollHeight
      if (ctx.messagesData[index] && ctx.messagesData[index].messages)
        ctx.messagesData[index] = {...ctx.messagesData[index],messages:[...data.data,...ctx.messagesData[index].messages]}
      else
        ctx.messagesData = [...ctx.messagesData,{...props.chatUserInfo,messages:[...data.data]}]
      ctx.messagesData = sortMessages(ctx.messagesData)
      props.changeMessages(ctx.messagesData)
      changeHideLoader(true)
      setTimeout(() => ChatContent.current.scrollTop = ChatContent.current.scrollHeight - oldHeight, 0)
    })
  }
  useEffect(() => {
    ctx.socket.current.on('message',(obj)=>{
      const oldHeight = ChatContent.current.scrollHeight
          const {Content,UserName,date} = JSON.parse(obj)
          props.changeMessages(()=>{
            const index = getUserIndex(ctx.messagesData,UserName)
            const msgObj = {Content,date,myMessage:false,IsRead:1}
            if (ctx.messagesData[index])
              ctx.messagesData[index].messages.push(msgObj)
            else
              ctx.messagesData = [{...props.chatUserInfo,messages:[msgObj]},...ctx.messagesData]
            ctx.messagesData = sortMessages(ctx.messagesData)
            return (ctx.messagesData)
          })
        setTimeout(() => ChatContent.current.scrollTop = oldHeight, 0)
    })
    if (!ctx.messagesData[index] || (ctx.messagesData[index].messages.length === 1 && ctx.messagesData[index].messages[0] !== "limit"))
    {
      changeHideLoader(false)
      getMessages(UserName)
    } // eslint-disable-next-line
  }, [])
  function ShowScrollDown() {
    const { offsetHeight, scrollHeight, scrollTop } = ChatContent.current
    if (scrollHeight - (scrollTop + offsetHeight) > 30)
      changeHideScrollDown(oldValue => oldValue ? oldValue : true)
    else changeHideScrollDown(false)
    if (scrollTop === 0 && ctx.messagesData[index] && !ctx.messagesData[index].messages[0] === "limit") {
      changeHideLoader(false)
      getMessages(UserName)
    }
  }
  return (
    <div className="Chat" style={props.style ? props.style : {}}>
      <div
        className="ChatHeader"
      > 
        <div className="ChatImage" style={props.chatUserInfo.Active ? {'--color-online':'#44db44'} :{'--color-online':'#a5a5a5'}}>
          <ImageLoader src={props.chatUserInfo.Images} alt={props.chatUserInfo.UserName}/>
        </div>
        <div className="ChatUserInfo">
          <div className="ChatUserInfoName">{props.chatUserInfo.UserName}</div>
        </div>
      </div>
      <div
        className="ChatContent"
        ref={ChatContent}
        onScroll={ShowScrollDown}
      >
        {!hideLoader ? (
          <Loader
            style={{
              margin: 'auto',
              zIndex: 11,
            }}
          />
        ) : null}
        {UserName && ctx.messagesData[index] ? ctx.messagesData[index].messages.map((msg, index) => {
              if (msg !== "limit")
                return (
                  <ChatMessage
                    index={index}
                    key={index}
                    pos={msg.myMessage?"right":"left"}
                    background={msg.myMessage?"#E6E8F4":"#3D88B7"}
                    color={msg.myMessage?"black":"white"}
                    message={msg.Content}
                    time={ConvertDate(msg.date, 'time')}
                  />
                )
              return null
            }):null}
      </div>
      {hideScrollDown ? (
        <IconArrowDownChat
          className="ScrollDown"
          width={18}
          height={18}
          onClick={() =>
            (ChatContent.current.scrollTop = ChatContent.current.scrollHeight)
          }
        />
      ) : null}
      <div
        className="ChatSendMessage"
      >
        <div className="ChatSendMessageButton">
          <input type="text" placeholder="Enter Message" ref={chatTextValue}/>
        </div>
        <div className="ChatSendButton">
          <IconSendMessage width={24} height={24} fill="#6e97ee" onClick={()=>{
          console.dir({...chatTextValue.current})
            if (chatTextValue.current.value.trim() !== "")
            {
              ctx.socket.current.emit('message',JSON.stringify({UserName:props.chatUserInfo.UserName,message:chatTextValue.current.value}))
              const obj = {myMessage:1,date:new Date().toISOString(),Content:chatTextValue.current.value,IsRead:1}
              // console.log("OBJ",{...obj})
              if (ctx.messagesData[index])
                ctx.messagesData[index].messages.push(obj)
              else
                ctx.messagesData = [...ctx.messagesData,{...props.chatUserInfo,messages:['limit',obj]}]
              ctx.messagesData = sortMessages(ctx.messagesData)
              props.changeMessages([...ctx.messagesData])
              chatTextValue.current.value = ""
              setTimeout(() => ChatContent.current.scrollTop = ChatContent.current.scrollHeight, 0)
            }
            }} />
        </div>
      </div>
    </div>
  )
}
export { Chat }
