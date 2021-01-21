import React, { useState, useEffect, useRef, useContext } from 'react'
import { Loader } from './Loader'
import { DataContext } from '../Context/AppContext'
import {
  IconSendMessage,
  IconArrowDownChat,
} from './Icons'
import '../Css/Chat.css'
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
  const [friends,changeFriends] = useState({...ctx.cache.friends})
  const ctx = useContext(DataContext)
  const ChatContent = useRef()
  const chatTextValue=useRef("")
  const UserName = props.chatUserInfo.UserName
  // function getMessages(UserName) {
  //   const length = (props.messages.length > 0 && ctx.messagesData[index])? ctx.messagesData[index].messages.length : 0
  //   Axios.get(`/Messages/${UserName}/${length}`).then(data=>
  //   {
  //     const oldHeight = ChatContent.current.scrollHeight
  //     if (ctx.messagesData[index] && ctx.messagesData[index].messages)
  //       ctx.messagesData[index] = {...ctx.messagesData[index],messages:[...data.data,...ctx.messagesData[index].messages]}
  //     else
  //       ctx.messagesData = [...ctx.messagesData,{...props.chatUserInfo,messages:[...data.data]}]
  //     ctx.messagesData = sortMessages(ctx.messagesData)
  //     props.changeMessages(ctx.messagesData)
  //     changeHideLoader(true)
  //     setTimeout(() => ChatContent ? ChatContent.current.scrollTop = ChatContent.current.scrollHeight - oldHeight : 0, 0)
  //   })
  // }
  useEffect(() => {
    ctx.ref.changeFriends = changeFriends
    ctx.ref.ChatContent = ChatContent
    // eslint-disable-next-line
  }, [])
  function ShowScrollDown() {
    const { offsetHeight, scrollHeight, scrollTop } = ChatContent.current
    if (scrollHeight - (scrollTop + offsetHeight) > 30)
      changeHideScrollDown(oldValue => oldValue ? oldValue : true)
    else changeHideScrollDown(false)
    if (scrollTop === 0 && ctx.messagesData[index] && !ctx.messagesData[index].messages[0] === "limit") {
      changeHideLoader(false)
      ctx.ref.getMessages(UserName)
    }
  }
  return (
    <div className="Chat" style={props.style ? props.style : {}}>
      <div className="ChatHeader"> 
        <div className="ChatImage" style={ctx.cache.chatUserInfo.Active ? {'--color-online':'#44db44'} :{'--color-online':'#a5a5a5'}}>
          <ImageLoader src={ctx.cache.chatUserInfo.Images} alt={ctx.cache.chatUserInfo.UserName}/>
        </div>
        <div className="ChatUserInfo">
          <div className="ChatUserInfoName">{ctx.cache.chatUserInfo.UserName}</div>
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
        {friends[UserName] ? friends[UserName].messages.map(msg => {
              if (msg !== "limit")
                return (
                  <ChatMessage
                    key={"Message"+msg.id}
                    pos={msg.IdUserReceiver === ctx.cache.chatUserInfo.IdUserOwner?"right":"left"}
                    background={msg.IdUserReceiver === ctx.cache.chatUserInfo.IdUserOwner?"#E6E8F4":"#3D88B7"}
                    color={msg.myMessage?"black":"white"}
                    message={msg.Content}
                    time={ctx.ref.ConvertDate(msg.date, 'time')}
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
          onClick={() =>ctx.ref.scrollDown}
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
            if (chatTextValue.current.value.trim() !== "")
            {
              ctx.ref.sendMessage({message:{id:friends[UserName].messages[friends[UserName].messages.length - 1].id + 1,Content:chatTextValue.current.value,date:new Date().toISOString(),IdUserReceiver:ctx.cache.chatUserInfo.IdUserOwner},user:{...ctx.cache.chatUserInfo}})
              chatTextValue.current.value = ""
              setTimeout(() => ctx.ref.scrollDown(), 0)
            }}} />
        </div>
      </div>
    </div>
  )
}
export { Chat }
