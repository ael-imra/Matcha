import React, { useState, useEffect, useContext, useRef } from 'react'
import IconMenu from './IconMenu'
import userImage from '../Images/user.jpg'
import { IconSettings } from './Icons'
import { Toggle } from './Switch'
import '../Css/DashboardBody.css'
import { DataContext } from '../Context/AppContext'
import { ImageLoader } from './ImageLoader'
import { Route, Switch, useHistory } from 'react-router-dom'
import {Users} from './Users'
import {Filter} from './Filter'

function DashboardBody(props) {
  const [hideFilter, changeHideFilter] = useState(true)
  const [users, changeUsers] = useState([])
  const ctx = useContext(DataContext)
  const BodyRef = useRef()
  const [usersLoader, changeUsersLoader] = useState(false) // eslint-disable-next-line
  const [start, changeStart] = useState(0)
  const history = useHistory()
  const [filterData, changeFilterData] = useState({
    list: [],
    name: '',
    age: [18, 88],
    rating: [0, 5],
    location: [0, 1000],
    updated: false,
  })
  function InsertData(start) {
    changeUsersLoader(true)
    fetch(`http://localhost:5000/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...filterData, start }),
    })
      .then((res) => res.json())
      .then((data) => {
        ctx.usersData.push(...data)
        changeUsers([...ctx.usersData])
        changeUsersLoader(false)
      })
      .catch((err) => 0)
  }
  useEffect(() => {
    changeStart(() => {
      ctx.usersData = []
      InsertData(0)
      return 24
    }) // eslint-disable-next-line
  }, [filterData])
  function BodyScroll() {
    const { scrollHeight, scrollTop, offsetHeight } = BodyRef.current
    if (offsetHeight + scrollTop + 300 > scrollHeight && !usersLoader) {
      changeStart((oldStart) => {
        InsertData(oldStart)
        return oldStart + 24
      })
    }
  }
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
          {props.width <= 1250 ? (
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
            <Filter
              changeFilterData={changeFilterData}
              filterData={filterData}
            />
          </div>
        ) : null}
      </div>

      <div ref={BodyRef} className="DashboardBodyContent" onScroll={BodyScroll}>
        <Switch>
          <Route exact path="/">
            <Users users={users}/>
          </Route>
          <Route path="*">
            <Error404 />
          </Route>
        </Switch>
      </div>
      {usersLoader ? <div className="DashboardBodyLoader"></div> : null}
    </div>
  )
}
export { DashboardBody }
