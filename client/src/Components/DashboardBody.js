import React, { useState, useEffect, useContext} from 'react'
import IconMenu from './IconMenu'
import { Toggle } from './Switch'
import '../Css/DashboardBody.css'
import { DataContext } from '../Context/AppContext'
import { Route, Switch, useHistory, useLocation } from 'react-router-dom'
import { Users } from './Users'
import { Filter } from './Filter'
import Profile from './Profile';
import History from './History';
import Axios from 'axios';
import FilterListIcon from '@material-ui/icons/FilterList';

function DashboardBody(props) {
  let location = useLocation();
  const [hideFilter, changeHideFilter] = useState(true)
  const ctx = useContext(DataContext)
  const history = useHistory()
  
  function Error404() {
    useEffect(() => {
      history.push('/')
    }, [])
    return <div></div>
  }
  let logout = () => {
    try {
      Axios.get('/Authentication/Logout').then((result) => {
        if (result.data === `You're now logout`) {
          localStorage.removeItem('token');
          localStorage.removeItem('userInfo');
          history.push('/');
          props.ChangeIsLogin('Not login');
        }
      });
    } catch (error) {}
  };
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
            {props.user.Image ? (
              <img src={props.user.Image} alt='profileImage' className='DashboardBodyHeaderProfileImage' />
            ) : (
              <div className='no-image-profile' style={{ width: '35px', height: '35px', fontSize: '20px' }}>
                {props.user.UserName.substring(0, 2)}
              </div>
            )}
            <span>{`${props.user.FirstName} ${props.user.LastName}`}</span>
          </div>
          <div className='DashboardBodyHeaderSettings'>
            {/* <IconSettings width={19} height={19} fill='#a5a5a5' /> */}
            {location.pathname === '/' ? (
              <FilterListIcon
                onClick={() => changeHideFilter((oldValue) => !oldValue)}
                style={{ width: '24px', height: '28px', color: 'var(--Icon-Fill)', marginRight: '9px', cursor: 'pointer' }}
              />
            ) : (
              ''
            )}

            <Toggle
              list={['Dark', 'Light']}
              active={ctx.Mode}
              switch={() => ctx.changeMode((oldValue) => (oldValue === 'Dark' ? 'Light' : 'Dark'))}
              colors={['#FD7A48', '#7C79E4']}
            />
          </div>
        </div>
        {!hideFilter ? <Filter/> : null}
      </div>

      <div className='DashboardBodyContent'>
        <Switch>
          <Route exact path='/'>
            <Users/>
          </Route>
          <Route path='/profile/:userName'>
            <Profile user={props.user} changeUser={props.changeUser} />
          </Route>
          <Route path='/history'>
            <History />
          </Route>
          <Route path='/logout'>{logout}</Route>
          <Route path='*'>
            <Error404 />
          </Route>
        </Switch>
      </div>
    </div>
  );
}
export { DashboardBody }
