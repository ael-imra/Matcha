import React, { useState, useEffect, useRef, useContext } from 'react'
import { Loader, Countdown } from './Loader'
import { ConvertDate } from './Messages'
import { DataContext } from '../Context/AppContext'
import {
  IconSettings,
  IconUploadImage,
  IconSendMessage,
  IconSearch,
  IconArrowDownChat,
} from './Icons'
import '../Css/Chat.css'
import Axios from 'axios'

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
  const [messagesData,changeMessagesData] = useState({...ctx.messagesData})
  const ChatContent = useRef()
  const [chatTextValue,changeChatTextValue] = useState("")
  const IdUserOwner = props.chatUserInfo.IdUserOwner
  function getMessages(IdUserOwner) {
    const length = (Object.entries(messagesData).length > 0 && messagesData[IdUserOwner])? messagesData[IdUserOwner].length : 0
    Axios.get(`/Messages/${IdUserOwner}/${length}`).then(data=>
    {
      console.log('OK')
      const oldHeight = ChatContent.current.scrollHeight
      changeMessagesData(()=>{
      ctx.messagesData[IdUserOwner] = Object.entries(ctx.messagesData).length > 0 && ctx.messagesData[IdUserOwner] ? [...data.data,...ctx.messagesData[IdUserOwner]]:data.data
      return ({...ctx.messagesData})
      })
      changeHideLoader(true)
      setTimeout(() => ChatContent.current.scrollTop = ChatContent.current.scrollHeight - oldHeight, 0)
    })
  }
  useEffect(()=>{
    let unmount = false
    if (!unmount)
      ctx.socket.current.on('message',(obj)=>{
      const oldHeight = ChatContent.current.scrollHeight
          const {Content,IdUserOwner,date} = JSON.parse(obj)
          changeMessagesData(oldValue=>{
            const msgObj = {Content,date,myMessage:false}
            if (Object.entries(oldValue).length > 0 && oldValue[IdUserOwner])
              ctx.messagesData[IdUserOwner].push(msgObj)
            else
              ctx.messagesData[IdUserOwner] = [msgObj]
            return ({...ctx.messagesData})
          })
        setTimeout(() => ChatContent.current.scrollTop = oldHeight, 0)
    })
    return ()=>unmount = true
  },[])
  useEffect(() => {
    if (Object.entries(messagesData).length === 0 || !messagesData[IdUserOwner])
    {
      changeHideLoader(false)
      getMessages(IdUserOwner)
    } // eslint-disable-next-line
  }, [])
  function ShowScrollDown() {
    const { offsetHeight, scrollHeight, scrollTop } = ChatContent.current
    if (scrollHeight - (scrollTop + offsetHeight) > 30)
      changeHideScrollDown(true)
    else changeHideScrollDown(false)
    if (scrollTop === 0 && messagesData[IdUserOwner] && !messagesData[IdUserOwner][0].limit) {
      console.log("Scroll")
      changeHideLoader(false)
      getMessages(IdUserOwner)
    }
  }
  return (
    <div className="Chat" style={props.style ? props.style : {}}>
      <div
        className="ChatHeader"
      > 
        <div className="ChatImage" style={props.chatUserInfo.Active ? {'--color-online':'#44db44'} :{'--color-online':'#a5a5a5'}}>
          <img src={props.chatUserInfo.Images} alt={props.chatUserInfo.UserName} />
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
        {IdUserOwner && messagesData[IdUserOwner]?messagesData[IdUserOwner].map((msg, index) => {
              if (!msg.limit)
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
            if (chatTextValue.trim()!=="")
            {
              ctx.socket.current.emit('message',JSON.stringify({IdUserOwner:props.chatUserInfo.IdUserOwner,message:chatTextValue}))
              const obj = {myMessage:1,date:new Date().toISOString().slice(0, 19).replace('T', ' '),Content:chatTextValue}
              // console.log(props.chatUserInfo,"Ok",messagesData[IdUserOwner])
              changeMessagesData(oldValue=>{
                  if ((Object.entries(oldValue).length > 0 && IdUserOwner && oldValue[IdUserOwner]))
                    oldValue[IdUserOwner].push(obj)
                  else
                    oldValue = [obj]
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
