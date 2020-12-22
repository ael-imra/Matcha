import React, { useState, useLayoutEffect, useEffect, useContext, useRef } from 'react';
import { ReactComponent as UserSVG } from '../Images/user.svg';
import { ReactComponent as BanSVG } from '../Images/ban.svg';
import { ReactComponent as CheckSVG } from '../Images/check.svg';
import { ReactComponent as PinSVG } from '../Images/pin.svg';
import { ReactComponent as StarSVG } from '../Images/star.svg';
import { IconClose } from './Icons';
import IconMenu from './IconMenu';
import userImage from '../Images/user.jpg';
import { IconSettings } from './Icons';
import { Toggle } from './Switch';
import '../Css/DashboardBody.css';
import { DataContext } from '../Context/AppContext';
import Rating from '@material-ui/lab/Rating';
import Slider from '@material-ui/core/Slider';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Select } from './Select';
import { ImageLoader } from './ImageLoader';
import { Route, Switch, useHistory } from 'react-router-dom';
function useWindowSize() {
  const [size, setSize] = useState(window.innerWidth);
  useLayoutEffect(() => {
    function updateSize() {
      setSize(window.innerWidth);
    }
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', () => 0);
  }, []);
  return size;
}
let usersData = [];
function Filter(props) {
  const [listActive, changeListActive] = useState(props.filterData.list);
  const [name, changeName] = useState(props.filterData.name);
  const [age, changeAge] = useState(props.filterData.age);
  const [rating, changeRating] = useState(props.filterData.rating);
  const [location, changeLocation] = useState(props.filterData.location);
  const list = ['Youtube', 'Facebook', 'Github', 'Instagrame', 'Twitter', 'Hola', 'Aliexpress'];
  return (
    <div className='Filter'>
      <div className='FilterSearch'>
        <div className='FilterSearchInput'>
          <TextField id='FilterName' label='Name' variant='outlined' size='small' onChange={(event) => changeName(event.target.value)} value={name} />
        </div>
      </div>
      <div className='FilterAdvance'>
        <div className='FilterAdvanceFirst'>
          <Select list={list} change={changeListActive} active={listActive} />
        </div>
        <div className='FilterAdvanceSecond'>
          <div className='FilterAdvanceAge'>
            <div className='FilterAdvanceAgeText'>Age :</div>
            <div className='FilterAdvanceAgeValue'>
              <Slider value={age} valueLabelDisplay='auto' aria-labelledby='range-slider' min={18} max={80} onChange={(event, value) => changeAge([...value])} />
            </div>
          </div>
          <div className='FilterAdvanceRating'>
            <div className='FilterAdvanceRatingText'>Rating :</div>
            <div className='FilterAdvanceRatingValue'>
              <Slider value={rating} valueLabelDisplay='auto' aria-labelledby='range-slider' min={0} max={5} onChange={(event, value) => changeRating([...value])} />
            </div>
          </div>
          <div className='FilterAdvanceLocation'>
            <div className='FilterAdvanceLoactionText'>Location :</div>
            <div className='FilterAdvanceLoactionValue'>
              <Slider value={location} valueLabelDisplay='auto' aria-labelledby='range-slider' min={0} max={1000} step={100} valueLabelFormat={(x) => (x === 1000 ? `${999}+` : x)} onChange={(event, value) => changeLocation([...value])} />
            </div>
          </div>
          <Button
            variant='contained'
            color='primary'
            onClick={() => {
              props.changeFilterData(() => ({
                list: listActive,
                name,
                age,
                rating,
                location,
                updated: true,
              }));
            }}>
            Search
          </Button>
        </div>
      </div>
    </div>
  );
}
function User(props) {
  const [imageIndex, changeImageIndex] = useState(0);
  function UserImageSlideButtonClick(event) {
    const index = [...event.target.parentNode.children].indexOf(event.target);
    changeImageIndex(index);
  }
  return (
    <div className='User' onClick={props.onClick}>
      <div className='UserImageSlideButtons'>
        {props.images.map((img, index) => (
          <div key={index} className={index === imageIndex ? 'UserImageSlideButton UserImageSlideButtonActive' : 'UserImageSlideButton'} onClick={UserImageSlideButtonClick}></div>
        ))}
      </div>
      <div className='UserImages' style={{ transform: `translateX(${-imageIndex * 310}px)` }}>
        {props.images.map((img, index) => (
          <ImageLoader style={{ width: '310px', height: '380px' }} src={img} key={index} alt={props.name} />
        ))}
      </div>
      <div className='UserRating'>
        <StarSVG width={42} height={42} fill='#EFD077' />
        <div>{props.rating}</div>
      </div>
      <div className='UserName'>{props.userName}</div>
      <div className='UserAge'>{props.distance}</div>
      <div className='UserGenre'>{props.genre}</div>
      <div className='UserDistance'>
        <PinSVG width={16} height={16} fill='white' />
        {props.distance}
      </div>
      <div className='UserListInterest'>
        {props.listInterest.map((item, index) => (
          <div key={index} className='UserListInterestItem'>
            {'#'}
            {item}
          </div>
        ))}
      </div>
      <div className='UserActions'>
        <div className='UserActionsAccept'>
          <CheckSVG width={20} height={20} fill='#44db44' />
        </div>
        <div className='UserActionsReject'>
          <IconClose width={20} height={20} fill='#ff9a2f' />
        </div>
        <div className='UserActionsInfo'>
          <UserSVG width={20} height={20} fill='white' />
        </div>
        <div className='UserActionsReport'>
          <BanSVG width={20} height={20} fill='#fb5454' />
        </div>
      </div>
      <div className='UserActionsRating'>
        <Rating name={props.name} defaultValue={2} max={5} precision={0.5} />
      </div>
    </div>
  );
}
function DashboardBody(props) {
  const [hideFilter, changeHideFilter] = useState(true);
  const [users, changeUsers] = useState([]);
  const ctx = useContext(DataContext);
  const BodyRef = useRef();
  const [usersLoader, changeUsersLoader] = useState(false); // eslint-disable-next-line
  const [start, changeStart] = useState(0);
  const history = useHistory();
  const [filterData, changeFilterData] = useState({
    list: [],
    name: '',
    age: [18, 88],
    rating: [0, 5],
    location: [0, 500],
    updated: false,
  });
  function InsertData(start) {
    changeUsersLoader(true);
    fetch(`http://localhost:5000/users`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...filterData, start }),
    })
      .then((res) => res.json())
      .then((data) => {
        usersData.push(...data);
        changeUsers([...usersData]);
        changeUsersLoader(false);
      })
      .catch((err) => 0);
  }
  useEffect(() => {
    changeStart(() => {
      usersData = [];
      InsertData(0);
      return 24;
    }); // eslint-disable-next-line
  }, [filterData]);
  function BodyScroll() {
    const { scrollHeight, scrollTop, offsetHeight } = BodyRef.current;
    if (offsetHeight + scrollTop + 300 > scrollHeight && !usersLoader) {
      changeStart((oldStart) => {
        InsertData(oldStart);
        return oldStart + 24;
      });
    }
  }
  function UserClick(event) {
    if (!event.target.closest('.UserActionsRating') && !event.target.closest('.UserActions') && !event.target.closest('.UserImageSlideButtons') && event.target.closest('.User').classList.contains('UserAfterClick'))
      event.target.closest('.User').classList.remove('UserAfterClick');
    else if (!event.target.closest('.UserActions') && !event.target.closest('.UserImageSlideButtons')) {
      const UserAfterClick = event.target.closest('.UserAfterClick');
      if (UserAfterClick) UserAfterClick.classList.remove('UserAfterClick');
      event.target.closest('.User').classList.add('UserAfterClick');
    }
  }
  function Error404() {
    useEffect(() => {
      history.push('/');
    }, []);
    return <div></div>;
  }
  return (
    <div className='DashboardBody' style={props.style ? props.style : {}}>
      <div className='DashboardBodyHeader'>
        <div>
          {props.width <= 1250 ? (
            <div style={{ transform: 'rotate(-180deg)' }}>
              <IconMenu
                dataHome={{
                  showMenu: 0,
                  ChangeStateMenu: () => props.changeLayoutHide((oldValue) => !oldValue),
                }}
              />
            </div>
          ) : null}
          <div className='DashboardBodyHeaderProfile'>
            <ImageLoader className='DashboardBodyHeaderProfileImage' src={userImage} alt='profileImage' />
            <span>Soufiane El Hamri</span>
          </div>
          <div className='DashboardBodyHeaderSettings'>
            <IconSettings width={19} height={19} fill='#a5a5a5' onClick={() => changeHideFilter((oldValue) => !oldValue)} />
            <Toggle list={['Dark', 'Light']} active={ctx.Mode} switch={() => ctx.changeMode((oldValue) => (oldValue === 'Dark' ? 'Light' : 'Dark'))} colors={['#FD7A48', '#7C79E4']} />
          </div>
        </div>
        {!hideFilter ? (
          <div>
            <Filter changeFilterData={changeFilterData} filterData={filterData} />
          </div>
        ) : null}
      </div>

      <div ref={BodyRef} className='DashboardBodyContent' onScroll={BodyScroll}>
        <Switch>
          <Route exact path='/'>
            {users.map((obj) => (
              <User
                key={obj.IdUserOwner}
                images={JSON.parse(obj.Images)}
                city={obj.City}
                gender={obj.Gender}
                dataBirthday={obj.DataBirthday}
                rating={4.9}
                name={obj.FirstName + ' ' + obj.LastName}
                userName={obj.UserName}
                distance='40Km'
                listInterest={JSON.parse(obj.ListInterest)}
                onClick={UserClick}
              />
            ))}
          </Route>
          <Route path='*'>
            <Error404 />
          </Route>
        </Switch>
      </div>
      {usersLoader ? <div className='DashboardBodyLoader'></div> : null}
    </div>
  );
}
export { DashboardBody, useWindowSize };
