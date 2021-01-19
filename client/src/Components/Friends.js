import React,{useState,useContext, useEffect} from 'react'
import { IconSendMessage, IconCircle } from './Icons'
import { ImageLoader } from './ImageLoader'
import '../Css/Friends.css'
import Axios from 'axios'
import { DataContext } from '../Context/AppContext'
function ConvertDate(date,type) {
  const cmp = Date.now() - Date.parse(date)
  const year = parseInt(cmp / (12 * 30 * 24 * 60 * 60 * 1000))
  const month = parseInt(cmp / (30 * 24 * 60 * 60 * 1000))
  const days = parseInt(cmp / (24 * 60 * 60 * 1000))
  const hours = parseInt(cmp / (60 * 60 * 1000))
  const minutes = parseInt(cmp / (60 * 1000))
  const seconds = parseInt(cmp / 1000)
  if (type && type === 'time') return new Date(date).toISOString().slice(10, 16).replace('T', ' ')
  if (type && type === 'date') return new Date(date).toISOString().slice(0,10)
  if(year > 0) return `${year} day${year !== 1 ? 's' : ''} ago`
  if(month > 0) return `${month} day${month !== 1 ? 's' : ''} ago`
  if (days > 0) return `${days} day${days !== 1 ? 's' : ''} ago`
  if (hours > 0) return `${hours} hour${hours !== 1 ? 's' : ''} ago`
  if (minutes > 0) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`
  if (seconds > 0) return `${seconds} second${seconds !== 1 ? 's' : ''} ago`
}
function Friend(props) {
  return (
    <div className="Friend">
      <div className="FriendImage">
        <ImageLoader
          className="FriendImageImage"
          src={props.image}
          alt={props.name}
        />
      </div>
      <div className="FriendInfo">
        <span>{props.name}</span>
        <span style={props.active ? { color: '#44db44' } : {}}>
          {props.active ? (
            <>
              <IconCircle width={8} fill="#44db44" /> Active now
            </>
          ) : (
            ConvertDate(props.date)
          )}
        </span>
      </div>
      <div className="FriendActions">
        <div className="FriendProfile">
          <button onClick={() => props.OpenChatBox(props.id)}>
            <IconSendMessage width={21} height={21} fill="#2d2d2d" />
          </button>
        </div>
      </div>
    </div>
  )
}
function Friends(props) {
  const ctx = useContext(DataContext)
  const [friendsList,changeFriendsList] = useState([...ctx.friendsList])
  useEffect(() => {
    let unmount = false
      if (ctx.friendsList.length === 0)
        Axios.get('/Friends').then(data=>
        {
          if (data.data !== 'bad request' && ctx.friendsList.length === 0 && !unmount)
          {
            ctx.friendsList.push(...data.data)
            changeFriendsList(oldValue=>[...oldValue,...data.data])
          }
        })
        return (()=>unmount = true)
      // eslint-disable-next-line
  }, [])
  console.log("friends")
  return (
    <div className="Friends" style={props.style ? props.style : {}}>
      {friendsList.map((obj) => (
        <Friend
          id={obj.IdUserOwner}
          key={'Friends'+obj.IdUserOwner}
          image={obj.Images}
          name={obj.UserName}
          active={obj.Active}
          date={obj.LastLogin}
          OpenChatBox={()=>props.changeChatUserInfo({IdUserOwner:obj.IdUserOwner,UserName:obj.UserName,Images:obj.Images})}
        />
      ))}
    </div>
  )
}
export { Friends,ConvertDate }
