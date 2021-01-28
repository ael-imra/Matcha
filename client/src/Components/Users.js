import React, { useState, useEffect,useRef,useContext } from 'react'
import { ReactComponent as UserSVG } from '../Images/user.svg'
import { ReactComponent as BanSVG } from '../Images/ban.svg'
import { ReactComponent as CheckSVG } from '../Images/check.svg'
import { ReactComponent as PinSVG } from '../Images/pin.svg'
import { ReactComponent as StarSVG } from '../Images/star.svg'
import Rating from '@material-ui/lab/Rating'
import { ImageLoader } from './ImageLoader'
import { DataContext } from '../Context/AppContext'
import '../Css/Users.css'
import axios from 'axios'
function User(props) {
  const [imageIndex, changeImageIndex] = useState(0)
  const [ratingValue, changeRatingValue] = useState({ avg: props.rating===null ?0:props.rating, userValue: 0 })
  function UserImageSlideButtonClick(event) {
    const index = [...event.target.parentNode.children].indexOf(event.target)
    changeImageIndex(index)
  }
  function clickRating(value, usernameReceiver) {
    axios.post('Rating', {
        usernameReceiver,
        RatingValue: parseFloat(parseFloat(value).toFixed(1)),
      }).then((data) =>
        parseFloat(data.data) >= 0 && parseFloat(data.data) <= 5
          ? changeRatingValue(() => ({
              userValue: value,
              avg: parseFloat(parseFloat(data.data).toFixed(1)),
            }))
          : 0
      )
  }
  function addFriend(UserName){
    axios.post('/Friends/Invite',{UserName}).then((data)=>{
      if (data.data !== 'You Need At lest One Image to do This Action')
        props.removeFriend(UserName)
    }).catch(err=>0)
  }
  return (
    <div className="User" onClick={props.onClick}>
      <div className="UserImageSlideButtons">
        {props.images.map((img, index) => (
          <div
            key={index}
            className={
              index === imageIndex
                ? 'UserImageSlideButton UserImageSlideButtonActive'
                : 'UserImageSlideButton'
            }
            onClick={UserImageSlideButtonClick}
          ></div>
        ))}
      </div>
      <div
        className="UserImages"
        style={{ transform: `translateX(${-imageIndex * 310}px)` }}
      >
        {props.images.map((img, index) => (
          <ImageLoader
            style={{ width: '310px', height: '380px' }}
            src={img}
            key={index}
          />
        ))}
      </div>
      <div className="UserRating">
        <StarSVG width={42} height={42} fill="#EFD077" />
        <div>{ratingValue.avg}</div>
      </div>
      <div className="UserName">{props.userName}</div>
      <div className="UserAgeGenre">
        {props.age}, {props.gender}
      </div>
      <div className="UserDistance">
        <PinSVG width={16} height={16} fill="white" />
        {(props.distance >= 1000 ? Math.floor(props.distance/1000) + "Km" : Math.floor(props.distance) + "m")}
      </div>
      <div className="UserListInterest">
        {props.listInterest.map((item, index) => (
          <div key={index} className="UserListInterestItem">
            {'#'}
            {item}
          </div>
        ))}
      </div>
      <div className="UserActions">
        {props.userInfo.Image?<div className="UserActionsAccept" onClick={()=>addFriend(props.userName)}>
          <CheckSVG width={20} height={20} fill="#44DB44"/>
        </div>:null}
        <div className="UserActionsInfo" onClick={()=>window.location = `http://${window.location.hostname}:3000/profile/${props.userName}`}>
          <UserSVG width={20} height={20} fill="white" />
        </div>
        {props.userInfo.Image?<div className="UserActionsReport">
          <BanSVG width={20} height={20} fill="#FB5454" />
        </div>:null}
      </div>
      {props.userInfo.Image?<div className="UserActionsRating">
        <Rating
          name={props.UserName+props.age.toString()}
          defaultValue={0}
          value={ratingValue.userValue}
          max={5}
          precision={0.5}
          onChange={(event, value) => clickRating(value, props.userName)}
        />
      </div>:null}
    </div>
  )
}
function Users() {
  const ctx = useContext(DataContext)
  const [users,changeUsers] = useState(()=>[...ctx.cache.users])
  const [usersLoader, changeUsersLoader] = useState(false)
  const [length,changeLength] = useState(24)
  const usersRef = useRef()
  useEffect(() => {
    ctx.ref.changeUsers = changeUsers
    ctx.ref.changeUsersLoader = changeUsersLoader
    if (users.length === 0)
      ctx.ref.getUsers(users.length,24)
    return (()=>ctx.ref.changeUsers = null)
    // eslint-disable-next-line
  }, [ctx.cache.filterData])
  function UsersScroll() {
    const { scrollHeight, scrollTop, offsetHeight } = usersRef.current
    if (offsetHeight + scrollTop + 300 > scrollHeight && !usersLoader)
    {
      if (length >= users.length)
        ctx.ref.getUsers(users.length,24)
      changeLength(oldValue=>oldValue + 24)
    }
  }
  function UserClick(event) {
    if (
      !event.target.closest('.UserActionsRating') &&
      !event.target.closest('.UserActions') &&
      !event.target.closest('.UserImageSlideButtons') &&
      event.target.closest('.User').classList.contains('UserAfterClick')
    )
      event.target.closest('.User').classList.remove('UserAfterClick')
    else if (
      !event.target.closest('.UserActions') &&
      !event.target.closest('.UserImageSlideButtons')
    ) {
      const UserAfterClick = event.target.closest('.UserAfterClick')
      if (UserAfterClick) UserAfterClick.classList.remove('UserAfterClick')
      event.target.closest('.User').classList.add('UserAfterClick')
    }
  }
  function removeFriend(UserName){
    ctx.cache.users = ctx.cache.users.filter(item=>item.UserName!==UserName)
    ctx.ref.getUsers(users.length-1,1)
  }
  return (
    <>
      <div className="Users" onScroll={UsersScroll} ref={usersRef}>
        {users.map((obj,index) => {
          if (index < length)
            return (<User
              key={obj.IdUserOwner}
              images={JSON.parse(obj.Images)}
              city={obj.City}
              rating={obj.rating}
              gender={obj.Gender}
              age={obj.Age}
              userName={obj.UserName}
              distance={obj.distance}
              listInterest={JSON.parse(obj.ListInterest)}
              removeFriend={removeFriend}
              onClick={UserClick}
              userInfo={JSON.parse(localStorage.userInfo)}
            />)
          return (null)
        })}
      </div>
      {usersLoader ? <div className="UsersLoader"></div> : null}
    </>
  )
}
export { Users }