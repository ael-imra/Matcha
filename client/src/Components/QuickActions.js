import React, { useContext, useState,useEffect } from 'react'
import { Friends } from './Friends'
import '../Css/QuickActions.css'
import { Search } from './Search'
import { Switch } from './Switch'
import { Messages } from './Messages' // eslint-disable-next-line
import { Chat } from './Chat' // eslint-disable-next-line
import { IconButtonBack } from './Icons'
import { Notification } from './Notification'
import { DataContext } from '../Context/AppContext'
function QuickActions(props) {
  const ctx = useContext(DataContext)
  const [CurrentAction, ChangeCurrentAction] = useState('Friends')
  const [search, changeSearch] = useState('')
  const [chatUserInfo,changeChatUserInfo] = useState({})
  const [messages,changeMessages] = useState(ctx.messagesData)
  const [friendsList,changeFriendsList] = useState([...ctx.friendsList])
  const style = {
    width: '100%',
    fontWeight: 'bold',
    fontSize: '20px',
  }
  function getUserIndex(messages,UserName)
  {
    let index = -1
    if (messages.length > 0)
      messages.map((item,idx) => index = item.UserName.toLowerCase() === UserName.toLowerCase() ? idx : index)
    return (index)
  }
  useEffect(() => {
    let unmount = false
    function changeStateOfFriend(obj)
    {
      if(!unmount)
      {
        console.log("INDEX")
        const index = getUserIndex(ctx.friendsList,JSON.parse(obj).UserName)
        if (index > -1)
        {
          console.log("friendsStatus")
          console.log("BEFORE UPDATE",{...ctx.friendsList[index]})
          ctx.friendsList[index].Active = JSON.parse(obj).Active
          ctx.friendsList[index].LastLogin = new Date().toISOString()
          console.log("UPDATE",ctx.friendsList[index])
          changeFriendsList([...ctx.friendsList])
        }
      }
    }
    if (ctx.socket.current)
      ctx.socket.current.on('FriendState',changeStateOfFriend)
    return () => unmount = true
  }, [])
  return (
    <div
      className="QuickActionsChatBox"
      style={{
        height: '100%',
        width: '30%',
        minWidth: '285px',
        maxWidth: '390px',
        display: 'flex',
        flexFlow: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'var(--background-QuickActions)',
        transition: '0.5s linear',
      }}
    >
      <div
        className={
          props.className ? `QuickActions${props.className}` : 'QuickActions'
        }
        style={
          props.style
            ? {
                ...props.style,
                display: chatUserInfo.UserName ? 'none' : 'flex',
              }
            : { display: chatUserInfo.UserName ? 'none' : 'flex' }
        }
      >
        <div className="QuickActionsMenu">
          <Switch
            list={['Friends', 'Messages', 'Notification']}
            active={CurrentAction}
            switch={ChangeCurrentAction}
            style={style}
          />
        </div>
        <Search search={search} changeSearch={changeSearch} />
        {CurrentAction === 'Friends' ? <Friends search={search} changeChatUserInfo={changeChatUserInfo} friendsList={friendsList} changeFriendsList={changeFriendsList} />:null}
        {CurrentAction === 'Messages' ? <Messages changeChatUserInfo={changeChatUserInfo} messages={messages} changeMessages={changeMessages} />:null}
        {CurrentAction === 'Notification' ? <Notification/> : null}
      </div>
      {chatUserInfo.UserName ? <div
          className="CloseChat"
          onClick={() => changeChatUserInfo({})}
        >
          <IconButtonBack width={20} height={20} fill="#6e97ee" />
          <div>Back To Messages</div>
        </div>:null}
      {chatUserInfo.UserName ? (
        <Chat chatUserInfo={chatUserInfo} messages={messages} changeMessages={changeMessages}/>
      ) : null}
    </div>
  )
}
export { QuickActions }
