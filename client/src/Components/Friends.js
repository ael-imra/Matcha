import React,{useState,useContext, useEffect} from 'react'
import { IconSendMessage, IconCircle } from './Icons'
import { ImageLoader } from './ImageLoader'
import '../Css/Friends.css'
import Axios from 'axios'
import { DataContext } from '../Context/AppContext'
function calculatorLogTime(date) {
  const cmp = Date.now() - Date.parse(date)
  const days = parseInt(cmp / (864 * 100000))
  const hours = parseInt(cmp / (36 * 100000))
  const minutes = parseInt(cmp / (6 * 10000))
  const seconds = parseInt(cmp / 1000)
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
            calculatorLogTime(props.date)
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
      if (ctx.friendsList.length === 0)
        Axios.get('/Friends').then(data=>
        {
          if (data.data !== 'bad request' && ctx.friendsList.length === 0)
          {
            ctx.friendsList.push(...data.data)
            changeFriendsList(oldValue=>[...oldValue,...data.data])
          }
        })
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
          OpenChatBox={()=>props.changeChatUserInfo({...obj})}
        />
      ))}
    </div>
  )
}
export { Friends, calculatorLogTime }
