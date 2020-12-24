import React, { useState, useEffect, useRef } from 'react'
import { Loader, Countdown } from './Loader'
import { data } from '../API/Messages'
import { ConvertDate } from './Messages'
import { Gallery } from './Gallery'
import {
  IconSettings,
  IconUploadImage,
  IconSendMessage,
  IconButtonBack,
  IconSearch,
  IconDelete,
  IconProfile,
  IconImages,
  IconArrowDownChat,
} from './Icons'
import '../Css/Chat.css'
const cache = []
function ChatSettings(props) {
  const [counterInfo, changeCounterInfo] = useState({
    counter: 0,
    counterNumber: 10,
    intervalID: 0,
    hide: false,
  })
  return (
    <div className="ChatSettings" style={props.style ? props.style : {}}>
      <div className="ChatSettingsHeader">
        <img src={props.img} alt={props.name} />
        <div className="ChatSettingsName">{props.name}</div>
      </div>
      <div className="ChatSettingsItems">
        <div
          className="ChatSettingsItem"
          onClick={() =>
            changeCounterInfo((oldValue) => {
              if (oldValue.intervalID !== 0) clearInterval(oldValue.intervalID)
              return {
                ...oldValue,
                hide: !oldValue.hide,
                counter: 0,
              }
            })
          }
        >
          {counterInfo.hide ? (
            <Countdown
              counterInfo={counterInfo}
              changeCounterInfo={changeCounterInfo}
              func={() => console.log('Work!')}
              style={{ color: 'red', fontWeight: 'bold', width: '20%' }}
            />
          ) : (
            <IconDelete width={18} height={18} fill="#3a3e88" />
          )}
          <div className="ChatSettingsItemsName">
            {counterInfo.hide ? 'Undo Delete' : 'Delete All Messages'}
          </div>
        </div>
        <div className="ChatSettingsItem">
          <IconProfile width={18} height={18} fill="#3a3e88" />
          <div className="ChatSettingsItemsName">View Profile</div>
        </div>
        <div
          className="ChatSettingsItem"
          onClick={() => props.changeHideGallery(false)}
        >
          <IconImages width={18} height={18} fill="#3a3e88" />
          <div className="ChatSettingsItemsName">View Images</div>
        </div>
        <div
          className="ChatSettingsItem"
          onClick={() => props.changeHideSettings(false)}
        >
          <IconButtonBack width={18} height={18} fill="#3a3e88" />
          <div className="ChatSettingsItemsName">Back To BoxChat</div>
        </div>
      </div>
    </div>
  )
} // eslint-disable-next-line
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
  const [hideSearchBar, changeHideSearchBar] = useState(false)
  const [hideScrollDown, changeHideScrollDown] = useState(false)
  const [hideSettings, changeHideSettings] = useState(false)
  const [hideLoader, changeHideLoader] = useState(true)
  const [hideGallery, changeHideGallery] = useState(true)
  const [allMessages, addToAllMessages] = useState([])
  const lastMessageIndex = React.useRef(
    data[props.id] ? data[props.id - 1].messages.length - 1 : 0
  )
  const ChatContent = useRef()
  function getMessages(id, lastMessge) {
    let promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        const arrayOfMessages = []
        let size = 0
        let lastPos = lastMessge
        if (lastMessge > 0) {
          for (let i = lastMessge; i >= 0; i--) {
            size += data[id].messages[i].messageContent.length
            if (size < 500) {
              arrayOfMessages.push(data[id].messages[i])
              lastPos = i
            } else i = 0
          }
          resolve([arrayOfMessages.reverse(), lastPos])
        } else reject('ERROR')
      }, 1000)
    })
    return promise
  }
  useEffect(() => {
    let unmounted = false
    if (
      cache[props.id - 1] &&
      cache[props.id - 1].allMessages &&
      cache[props.id - 1].lastMessageIndex
    ) {
      addToAllMessages(() => {
        return cache[props.id - 1].allMessages
      })
      lastMessageIndex.current = cache[props.id - 1].lastMessageIndex.current
      console.log(
        'ChatContent.current.scrollTop',
        ChatContent.current.scrollTop
      )
      setTimeout(() => {
        console.log('Ok3')
        ChatContent.current.scrollTop = ChatContent.current.scrollHeight
      }, 0)
    } else {
      if (!unmounted) changeHideLoader(false)
      getMessages(props.id - 1, lastMessageIndex.current)
        .then(([arrayOfMessages, lastPos]) => {
          const obj = {
            allMessages: null,
            lastMessageIndex: 0,
          }
          obj.allMessages = arrayOfMessages
          obj.lastMessageIndex = lastPos
          cache[props.id - 1] = obj
          if (!unmounted) {
            addToAllMessages([...arrayOfMessages])
            changeHideLoader(true)
            lastMessageIndex.current = lastPos
            setTimeout(() => {
              ChatContent.current.scrollTop = ChatContent.current.scrollHeight
            }, 0)
          }
        })
        .catch(() => (!unmounted ? changeHideLoader(true) : 0))
    }
    return () => (unmounted = true)
  }, [props.id])
  function ShowScrollDown() {
    const { offsetHeight, scrollHeight, scrollTop } = ChatContent.current
    const oldHeight = scrollHeight
    if (scrollHeight - (scrollTop + offsetHeight) > 30)
      changeHideScrollDown(true)
    else changeHideScrollDown(false)
    if (scrollTop === 0 && lastMessageIndex.current > 0) {
      changeHideLoader(false)
      getMessages(props.id - 1, lastMessageIndex.current)
        .then(([arrayOfMessages, lastPos]) => {
          if (arrayOfMessages) {
            addToAllMessages((oldValue) => {
              const obj = {
                allMessages: null,
                lastMessageIndex: 0,
              }
              obj.allMessages = [...arrayOfMessages, ...oldValue]
              obj.lastMessageIndex = lastMessageIndex
              cache[props.id - 1] = obj
              return [...arrayOfMessages, ...oldValue]
            })
            setTimeout(() => {
              console.log('Ok1')
              ChatContent.current.scrollTop =
                ChatContent.current.scrollHeight - oldHeight
            }, 0)
          }
          changeHideLoader(true)
          lastMessageIndex.current = lastPos
        })
        .catch(() => changeHideLoader(true))
    }
  }
  return (
    <div className="Chat" style={props.style ? props.style : {}}>
      <div
        className="ChatHeader"
        style={{ display: hideSettings ? 'none' : 'flex' }}
      >
        <div className="ChatImage">
          <img src={props.img} alt={props.name} />
        </div>
        <div className="ChatUserInfo">
          <div className="ChatUserInfoName">{props.name}</div>
        </div>
        <div className="ChatSearchButton">
          <IconSearch
            width={16}
            height={16}
            fill="#555555"
            onClick={() => changeHideSearchBar((oldValue) => !oldValue)}
          />
        </div>
        <div className="ChatSettingsButton">
          <IconSettings
            width={18}
            height={18}
            fill="#555555"
            onClick={() => {
              changeHideSettings((oldValue) => !oldValue)
            }}
          />
        </div>
      </div>
      <div
        className="ChatSearchBar"
        style={{ display: hideSearchBar ? 'block' : 'none' }}
      >
        <input type="text" placeholder="Search..." />
      </div>
      <div
        style={{ display: hideSettings ? 'none' : 'block' }}
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
        {allMessages
          ? allMessages.map((msg, index) => {
              if (msg.myMessage)
                return (
                  <ChatMessage
                    index={index}
                    key={index}
                    pos="right"
                    background="#E6E8F4"
                    color="black"
                    message={msg.messageContent}
                    time={ConvertDate(msg.date, 'time')}
                  />
                )
              return (
                <ChatMessage
                  index={index}
                  key={index}
                  pos="left"
                  background="#3D88B7"
                  color="white"
                  message={msg.messageContent}
                  time={ConvertDate(msg.date, 'time')}
                />
              )
            })
          : null}
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
        style={{ display: hideSettings ? 'none' : 'flex' }}
      >
        <div className="ChatSendImage">
          <IconUploadImage width={24} height={24} fill="#6e97ee" />
        </div>
        <div className="ChatSendMessage">
          <input type="text" placeholder="Enter Message" />
        </div>
        <div className="ChatSendButton">
          <IconSendMessage width={24} height={24} fill="#6e97ee" />
        </div>
      </div>
      <ChatSettings
        {...props}
        style={{ display: hideSettings ? 'flex' : 'none' }}
        changeHideSettings={changeHideSettings}
        changeHideGallery={changeHideGallery}
      />
      <Gallery
        {...props}
        style={{
          display: !hideGallery && props.chatBoxHide ? 'flex' : 'none',
        }}
        changeHideGallery={changeHideGallery}
      />
    </div>
  )
}
export { Chat }
