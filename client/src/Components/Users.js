import React, { useState, useEffect,useRef,useContext } from 'react'
import { ReactComponent as UserSVG } from '../Images/user.svg'
import { ReactComponent as BanSVG } from '../Images/ban.svg'
import { ReactComponent as CheckSVG } from '../Images/check.svg'
import { ReactComponent as PinSVG } from '../Images/pin.svg'
import { ReactComponent as StarSVG } from '../Images/star.svg'
import { IconClose } from './Icons'
import Rating from '@material-ui/lab/Rating'
import { ImageLoader } from './ImageLoader'
import { DataContext } from '../Context/AppContext'
import '../Css/Users.css'
import axios from 'axios'

function User(props) {
  const ctx = useContext(DataContext)
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
  function addFriend(Username,IdUserOwner){
    axios.post('/Friends/Invite',{Username}).then(()=>{
      props.changeUsersData(oldValue=>{
        const newArray = [...oldValue.filter(item=>item.UserName!==Username && item.IdUserOwner !== IdUserOwner)]
        ctx.getUsersData(oldValue.length-1,1).then(data=>newArray.push(...data.data))
        ctx.usersData.push(...newArray)
        return (newArray)
      })
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
        {35}, {props.gender}
      </div>
      <div className="UserDistance">
        <PinSVG width={16} height={16} fill="white" />
        {props.distance}
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
        <div className="UserActionsAccept">
          <CheckSVG width={20} height={20} fill="#44db44" onClick={()=>addFriend(props.userName,props.IdUserOwner)}/>
        </div>
        <div className="UserActionsReject">
          <IconClose width={20} height={20} fill="#ff9a2f" />
        </div>
        <div className="UserActionsInfo">
          <UserSVG width={20} height={20} fill="white" />
        </div>
        <div className="UserActionsReport">
          <BanSVG width={20} height={20} fill="#fb5454" />
        </div>
      </div>
      <div className="UserActionsRating">
        <Rating
          name={props.name}
          defaultValue={0}
          value={ratingValue.userValue}
          max={5}
          precision={0.5}
          onChange={(event, value) => clickRating(value, props.userName)}
        />
      </div>
    </div>
  )
}
function Users() {
  const ctx = useContext(DataContext)
  const [usersData,changeUsersData] = useState([...ctx.usersData])
  const [usersLoader, changeUsersLoader] = useState(false)
  const usersRef = useRef()
  useEffect(() => {
    usersRef.current.style = `height:${document.querySelector('.DashboardBody').offsetHeight}px`
    if (ctx.usersData.length === 0)
    {
      changeUsersLoader(true)
      ctx.getUsersData(usersData.length,24).then((data)=>{
        changeUsersLoader(false)
        changeUsersData(oldValue=>{
          const newArray = [...oldValue,...data.data]
          ctx.usersData.push(...newArray)
          return (newArray)
        })
      })
    }
        // eslint-disable-next-line
  }, [ctx.filterData])
  function UsersScroll() {
    const { scrollHeight, scrollTop, offsetHeight } = usersRef.current
    if (offsetHeight + scrollTop + 300 > scrollHeight && !usersLoader)
    {
      changeUsersLoader(true)
      ctx.getUsersData(usersData.length,24).then((data)=>{
        changeUsersLoader(false)
        changeUsersData(oldValue=>{
          const newArray = [...oldValue,...data.data]
          ctx.usersData.push(...newArray)
          return (newArray)
        })
      })
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
  console.log("inside Users",usersData)
  return (
    <>
      <div className="Users" onScroll={UsersScroll} ref={usersRef}>
        {usersData.map((obj) => (
          <User
            key={obj.IdUserOwner}
            images={JSON.parse(obj.Images)}
            city={obj.City}
            rating={obj.rating}
            gender={obj.Gender}
            dataBirthday={obj.DataBirthday}
            name={obj.FirstName + ' ' + obj.LastName}
            userName={obj.UserName}
            distance="40Km"
            listInterest={JSON.parse(obj.ListInterest)}
            changeUsersData={changeUsersData}
            onClick={UserClick}
          />
        ))}
      </div>
      {usersLoader ? <div className="UsersLoader"></div> : null}
    </>
  )
}
export { Users }
