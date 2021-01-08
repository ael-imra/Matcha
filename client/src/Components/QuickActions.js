import React, { useState } from 'react'
import { Friends } from './Friends'
import '../Css/QuickActions.css'
import { Search } from './Search'
import { Switch } from './Switch'
import { Messages } from './Messages' // eslint-disable-next-line
import { Loader } from './Loader'
import { Chat } from './Chat'
import { data } from '../API/Messages' // eslint-disable-next-line
import { IconButtonBack } from './Icons'
import { Notification } from './Notification'
// import { DataContext } from "../Context/AppContext";
function QuickActions(props) {
  const [CurrentAction, ChangeCurrentAction] = useState('Friends')
  const [search, changeSearch] = useState('')
  const [chatBoxHide, changeChatBoxHide] = useState(false)
  const [chatBoxInfo, changeChatBoxInfo] = useState({})
  const style = {
    width: '100%',
    fontWeight: 'bold',
    fontSize: '20px',
  }
  function OpenChatBox(userID) {
    let dataSent = ''
    data.map((obj) => (obj.id === userID ? (dataSent = obj) : null))
    changeChatBoxHide(true)
    changeChatBoxInfo(dataSent)
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
                display: chatBoxHide ? 'none' : 'flex',
              }
            : { display: chatBoxHide ? 'none' : 'flex' }
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
          OpenChatBox={OpenChatBox}
        />
        <Messages
          style={CurrentAction !== 'Messages' ? { display: 'none' } : {}}
          OpenChatBox={OpenChatBox}
        />
        <Notification
          style={CurrentAction !== 'Notification' ? { display: 'none' } : {}}
        />
      </div>
      <div
        style={!chatBoxHide ? { display: 'none' } : {}}
        className="CloseChat"
        onClick={() => changeChatBoxHide(false)}
      >
        <IconButtonBack width={20} height={20} fill="#6e97ee" />
        <div>Back To Messages</div>
      </div>
      {chatBoxHide ? (
        <Chat
          id={1}
          img={chatBoxInfo.image}
          name={chatBoxInfo.name}
          status={'Active Now'}
          chatBoxHide={chatBoxHide}
        />
      ) : null}
    </div>
  )
}
export { QuickActions }
