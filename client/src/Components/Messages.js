import React from 'react'
import { data } from '../API/Messages'
import { ImageLoader } from './ImageLoader'
import '../Css/Messages.css'
function ConvertDate(date, type) {
  if (date && type)
  {
    const dayOfWeek = [
      'Sunday',
      'Monday',
      'Thursday',
      'Wednesday',
      'Tuesday',
      'Friday',
      'Saturday',
    ]
    const myDate = new Date() - Date.parse(date)

    if (type && type === 'time') return new Date(date).toISOString().slice(10, 16).replace('T', ' ')
    else if (type && type === 'date') return new Date(date).toISOString().slice(0,10)
    if (myDate.getFullYear() === 0 && myDate.getMonth() === 0 && myDate.getDate() === 1) return 'Yesterday'
    else if (myDate.getFullYear() === 0 && myDate.getMonth() === 0 && myDate.getDate() < 7 && myDate.getDate() > 0)
      return dayOfWeek[myDate.getDay()]
    else if (myDate.getFullYear() === 0 && myDate.getMonth() === 0 && myDate.getDate() === 0)
      return new Date(date).toISOString().slice(0, 19).replace('T', ' ')
    return new Date(date).toISOString().slice(0,10)
  }
} // eslint-disable-next-line

function Message(props) {
  return (
    <div className="Message" onClick={props.onClick}>
      <ImageLoader className="MessageImage" src={props.img} alt={props.name} />
      <div className="MessageColumn">
        <div className="MessageRow">
          <div className="MessageNameFriend">{props.name}</div>
          <div className="MessageDateLastMessage">
            {ConvertDate(props.messages[props.messages.length - 1].date)}
          </div>
        </div>
        <div className="MessageRow">
          <div className="MessageLastMessage">
            {props.messages[props.messages.length - 1].messageContent}
          </div>
          <div className="MessageCountNewMessage">{2}</div>
        </div>
      </div>
    </div>
  )
}
function Messages(props) {
  return (
    <div className="Messages" style={props.style ? props.style : {}}>
      {data.map((obj, index) => (
        <Message
          key={index}
          messages={obj.messages}
          name={obj.name}
          img="http://localhost:5000/image/out.jpeg"
          onClick={() => props.OpenChatBox(obj.id)}
        />
      ))}
    </div>
  )
}
export { Messages, ConvertDate }
