import React, { useState, useEffect, useContext} from 'react'
import IconMenu from './IconMenu'
import userImage from '../Images/user.jpg'
import { IconSettings } from './Icons'
import { Toggle } from './Switch'
import '../Css/DashboardBody.css'
import { DataContext } from '../Context/AppContext'
import { ImageLoader } from './ImageLoader'
import { Route, Switch, useHistory } from 'react-router-dom'
import { Users } from './Users'
import { Filter } from './Filter'
import Profile from './Profile';

function DashboardBody(props) {
  const [hideFilter, changeHideFilter] = useState(true)
  const ctx = useContext(DataContext)
  const history = useHistory()
  
  function Error404() {
    useEffect(() => {
      history.push('/')
    }, [])
    return <div></div>
  }
  return (
    <div className="DashboardBody" style={props.style ? props.style : {}}>
      <div className="DashboardBodyHeader">
        <div>
          {props.width < 1540 ? (
            <div style={{ transform: 'rotate(-180deg)' }}>
              <IconMenu
                dataHome={{
                  showMenu: 0,
                  ChangeStateMenu: () =>
                    props.changeLayoutHide((oldValue) => !oldValue),
                }}
              />
            </div>
          ) : null}
          <div className="DashboardBodyHeaderProfile">
            <ImageLoader
              className="DashboardBodyHeaderProfileImage"
              src={userImage}
              alt="profileImage"
            />
            <span>Soufiane El Hamri</span>
          </div>
          <div className="DashboardBodyHeaderSettings">
            <IconSettings
              width={19}
              height={19}
              fill="#a5a5a5"
              onClick={() => changeHideFilter((oldValue) => !oldValue)}
            />
            <Toggle
              list={['Dark', 'Light']}
              active={ctx.Mode}
              switch={() =>
                ctx.changeMode((oldValue) =>
                  oldValue === 'Dark' ? 'Light' : 'Dark'
                )
              }
              colors={['#FD7A48', '#7C79E4']}
            />
          </div>
        </div>
        {!hideFilter ? (
          <div>
            <Filter />
          </div>
        ) : null}
      </div>

      <div className="DashboardBodyContent">
        <Switch>
          <Route exact path="/">
            <Users />
          </Route>
          <Route path='/profile'>
            <Profile />
          </Route>
          <Route path="*">
            <Error404 />
          </Route>
        </Switch>
      </div>
    </div>
  )
}
export { DashboardBody }
