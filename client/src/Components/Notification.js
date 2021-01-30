import React,{useContext,useEffect, useRef, useState} from 'react'
import { ReactComponent as UnlikeSVG } from '../Images/unlike.svg'
import { ReactComponent as HeartSVG } from '../Images/heart.svg'
import { ReactComponent as ViewSVG } from '../Images/view.svg'
import { ReactComponent as FriendsSVG } from '../Images/friends.svg'
import { ReactComponent as RateSVG } from '../Images/star.svg'
import { ImageLoader } from './ImageLoader'
import { DataContext } from '../Context/AppContext'
import '../Css/Notification.css'
import { useHistory } from 'react-router-dom';

const types = {
  Like:{
    color:'#ff9790',
    Component:<HeartSVG className="Icons" width={20} height={20} fill={'#ff9790'}/>,
    content:"Like Your Profile"
  },
  View:{
    color:'#33daad',
    Component:<ViewSVG className="Icons" width={20} height={20} fill={'#33daad'}/>,
    content:"View Your Profile"
  },
  LikedBack:{
    color:'#708dfd',
    Component:<FriendsSVG className="Icons" width={20} height={20} fill={'#708dfd'}/>,
    content:"Liked You Back"
  },
  Unlike:{
    color:'#8f8f8f',
    Component:<UnlikeSVG className="Icons" width={20} height={20} fill={'#8f8f8f'}/>,
    content:"Unlike Your Profile"
  },
  Rate:{
    color:'#efd077',
    Component:<RateSVG className="Icons" width={20} height={20} fill={'#efd077'}/>,
    content:"Rate Your Profile"
  }
}
function Notice(props) {
  const history = useHistory()
  return (
    <div className="Notice" onClick={()=>history.push(`/profile/${props.username}`)}>
      <ImageLoader className="NoticeImage" src={props.img} alt={props.username} />
      <div className="NoticeColumn">
        <div className="NoticeRow">
          <div className="NoticeUserName">{props.username}</div>
          <div className="NoticeDate">{props.ConvertDate(props.date)}</div>
        </div>
        <div className="NoticeRow" style={{ margin: '6px 0' }}>
          <div
            className="NoticeContent"
            style={{ color: types[props.Type].color }}
          >
            {types[props.Type].content}
          </div>
          <div style={{ width: '10%' }}>
            {types[props.Type].Component}
          </div>
        </div>
      </div>
    </div>
  )
}

function Notification(props) {
  const ctx = useContext(DataContext)
  const notificationsContent = useRef(null)
  const [hideLoader,changeHideLoader] = useState(true)
  const [notifications,changeNotifications] = useState({...ctx.cache.notifications})
  function onScroll(){
    const { offsetHeight, scrollHeight, scrollTop } = notificationsContent.current
    if (scrollTop + 30 === offsetHeight - scrollHeight )
      ctx.changeNotifications()
  }
  useEffect(()=>{
    ctx.ref.changeNotifications = changeNotifications
    ctx.ref.changeHideLoader = changeHideLoader
    ctx.ref.search(props.search,'notifications')
    return (()=>{
      ctx.ref.changeNotifications = null
      ctx.ref.changeHideLoader = null
    })
  },[props.search])
  return (
    <div className="Notification" ref={notificationsContent} style={props.style ? props.style : {}} onScroll={onScroll}>
      {notifications.data.map(obj => (
        <Notice
          key={"Notice"+obj.IdNotification.toString()}
          Type={obj.Type}
          username={obj.UserName}
          date={obj.DateCreation}
          img={obj.Images}
          ConvertDate={ctx.ref.ConvertDate}
        />
      ))}
      {!hideLoader ? <div className="NotificationLoader"></div>:null}
    </div>
  )
}
export { Notification }
