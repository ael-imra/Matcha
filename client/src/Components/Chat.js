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
  const [chatTextValue,changeChatTextValue] = useState("")
  const UserName = props.chatUserInfo.UserName
  function getMessages(UserName) {
    const length = (Object.entries(props.messages).length > 0 && props.messages[UserName])? props.messages[UserName].messages.length : 0
    Axios.get(`/Messages/${UserName}/${length}`).then(data=>
    {
      const oldHeight = ChatContent.current.scrollHeight
      if (ctx.messagesData[UserName] && ctx.messagesData[UserName].messages)
        ctx.messagesData = {...ctx.messagesData,[UserName]:{...ctx.messagesData[UserName],messages:[...data.data,...ctx.messagesData[UserName].messages]}}
      else
        ctx.messagesData = {...ctx.messagesData,[UserName]:{...props.chatUserInfo,messages:[...data.data]}}
      props.changeMessages({...ctx.messagesData})
      changeHideLoader(true)
      setTimeout(() => ChatContent.current.scrollTop = ChatContent.current.scrollHeight - oldHeight, 0)
    })
  }
  useEffect(() => {
    ctx.socket.current.on('message',(obj)=>{
      const oldHeight = ChatContent.current.scrollHeight
          const {Content,UserName,date} = JSON.parse(obj)
          props.changeMessages(oldValue=>{
            const msgObj = {Content,date,myMessage:false,IsRead:1}
            if (Object.entries(oldValue).length > 0 && oldValue[UserName])
              ctx.messagesData[UserName].messages.push(msgObj)
            else
              ctx.messagesData[UserName] = {UserName:props.chatUserInfo.UserName,Images:props.chatUserInfo.Images,messages:[msgObj]}
            return ({...ctx.messagesData})
          })
        setTimeout(() => ChatContent.current.scrollTop = oldHeight, 0)
    })
    if (!ctx.messagesData[UserName] || ctx.messagesData[UserName].messages.length === 0 || (ctx.messagesData[UserName].messages.length === 1 && ctx.messagesData[UserName].messages[0] !== "limit"))
    {
      changeHideLoader(false)
      getMessages(UserName)
    } // eslint-disable-next-line
  }, [])
  function ShowScrollDown() {
    const { offsetHeight, scrollHeight, scrollTop } = ChatContent.current
    if (scrollHeight - (scrollTop + offsetHeight) > 30)
      changeHideScrollDown(true)
    else changeHideScrollDown(false)
    if (scrollTop === 0 && ctx.messagesData[UserName] && !ctx.messagesData[UserName].messages[0] === "limit") {
      changeHideLoader(false)
      getMessages(UserName)
    }
  }
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
  return (
    <div className="Chat" style={props.style ? props.style : {}}>
      <div
        className="ChatHeader"
      > 
        <div className="ChatImage" style={props.chatUserInfo.Active ? {'--color-online':'#44db44'} :{'--color-online':'#a5a5a5'}}>
          <ImageLoader src={props.chatUserInfo.Images} alt={props.chatUserInfo.UserName}/>
          {/* <img src={props.chatUserInfo.Images} alt={props.chatUserInfo.UserName} /> */}
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
        {UserName && ctx.messagesData[UserName]?ctx.messagesData[UserName].messages.map((msg, index) => {
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
          <input type="text" placeholder="Enter Message" value={chatTextValue} onChange={(event)=>changeChatTextValue(event.target.value)} />
        </div>
        <div className="ChatSendButton">
          <IconSendMessage width={24} height={24} fill="#6e97ee" onClick={()=>{
            if (chatTextValue.trim() !== "")
            {
              ctx.socket.current.emit('message',JSON.stringify({UserName:props.chatUserInfo.UserName,message:chatTextValue}))
              const obj = {myMessage:1,date:new Date().toISOString().slice(0, 19).replace('T', ' '),Content:chatTextValue,IsRead:1}
              props.changeMessages(oldValue=>{
                  if ((Object.entries(oldValue).length > 0 && UserName && oldValue[UserName]))
                    oldValue[UserName].messages =['limit',...oldValue[UserName].messages.filter(item=>item!=='limit'),obj]
                  else
                    oldValue = {[UserName]:{UserName:props.chatUserInfo.UserName,Images:props.chatUserInfo.Images,messages:['limit',obj]}}
                  oldValue = sortMessages(oldValue)
                  console.log("OLD",{...oldValue})
                  ctx.messagesData = {...oldValue}
                  return {...oldValue}
                })
                changeChatTextValue("")
                setTimeout(() => ChatContent.current.scrollTop = ChatContent.current.scrollHeight, 0)
            }
            }} />
        </div>
      </div>
    </div>
  )
}
export { Chat }
