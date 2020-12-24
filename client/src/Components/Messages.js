import React from 'react'
import { data } from '../API/Messages'
import { ImageLoader } from './ImageLoader'
import '../Css/Messages.css'
function ConvertDate(date, type) {
  const dayOfWeek = [
    'Sunday',
    'Monday',
    'Thursday',
    'Wednesday',
    'Tuesday',
    'Friday',
    'Saturday',
  ]
  const splitDate = date.split(/[T]/g)[0]
  const splitTime = date.split(/[T]/g)[1].split(/[:]/g)
  const myDate = new Date(date)
  const dateNow = new Date()
  const years = dateNow.getFullYear() - myDate.getFullYear()
  const months = dateNow.getMonth() - myDate.getMonth()
  const days = dateNow.getDate() - myDate.getDate()
  if (type && type === 'time') return `${splitTime[0]}:${splitTime[1]}`
  else if (type && type === 'date') return splitDate.replace(/[-]/g, '/')
  else if (years === 0 && months === 0 && days === 1) return 'Yesterday'
  else if (years === 0 && months === 0 && days < 7 && days > 0)
    return dayOfWeek[myDate.getDay()]
  else if (years === 0 && months === 0 && days === 0)
    return `${splitTime[0]}:${splitTime[1]}`
  else if (type === 'date') return splitDate.replace(/[-]/g, '/')
  return splitDate.replace(/[-]/g, '/')
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
