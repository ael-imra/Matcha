import React, { useState,useContext } from 'react'
import { Friends } from './Friends'
import '../Css/QuickActions.css'
import { Search } from './Search'
import { Switch } from './Switch'
import { Messages } from './Messages' // eslint-disable-next-line
import { Chat } from './Chat' // eslint-disable-next-line
import { IconButtonBack } from './Icons'
import { Notification } from './Notification'
function QuickActions(props) {
  const [CurrentAction, ChangeCurrentAction] = useState('Friends')
  const [search, changeSearch] = useState('')
  const [chatUserInfo,changeChatUserInfo] = useState({})
  const style = {
    width: '100%',
    fontWeight: 'bold',
    fontSize: '20px',
  }
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
        <Friends
          style={CurrentAction !== 'Friends' ? { display: 'none' } : {}}
          search={search}
          changeChatUserInfo={changeChatUserInfo}
        />
        <Messages
          style={CurrentAction !== 'Messages' ? { display: 'none' } : {}}
          changeChatUserInfo={changeChatUserInfo}
        />
        <Notification
          style={CurrentAction !== 'Notification' ? { display: 'none' } : {}}
        />
      </div>
      
      {chatUserInfo.UserName ? 
        (<div
          className="CloseChat"
          onClick={() => changeChatUserInfo({})}
        >
          <IconButtonBack width={20} height={20} fill="#6e97ee" />
          <div>Back To Messages</div>
        </div>)
        :null}
      {chatUserInfo.UserName ? (
        <Chat chatUserInfo={chatUserInfo}/>
      ) : null}
    </div>
  )
}
export { QuickActions }
