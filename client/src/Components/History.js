import React from 'react'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import InputBase from '@material-ui/core/InputBase'
import SearchIcon from '@material-ui/icons/Search'
import { useWindowSize } from './UseWindowSize'
import Axios from 'axios'
import '../Css/History.css'
function ConvertDate(date, type) {
  if (date && type) {
    const dayOfWeek = ['Sunday', 'Monday', 'Thursday', 'Wednesday', 'Tuesday', 'Friday', 'Saturday']
    const myDate = new Date() - Date.parse(date)
    if (type && type === 'time') return new Date(date).toISOString().slice(10, 16).replace('T', ' ')
    else if (type && type === 'date') return new Date(date).toISOString().slice(0, 10)
    if (myDate.getFullYear() === 0 && myDate.getMonth() === 0 && myDate.getDate() === 1) return 'Yesterday'
    else if (myDate.getFullYear() === 0 && myDate.getMonth() === 0 && myDate.getDate() < 7 && myDate.getDate() > 0) return dayOfWeek[myDate.getDay()]
    else if (myDate.getFullYear() === 0 && myDate.getMonth() === 0 && myDate.getDate() === 0) return new Date(date).toISOString().slice(0, 19).replace('T', ' ')
    return new Date(date).toISOString().slice(0, 10)
  }
}
export default function History() {
  const [usersBlock, changeUsersBlock] = React.useState([])
  const [listHistory, changeListHistory] = React.useState([])
  const [active, changeActive] = React.useState('History')
  const width = useWindowSize()

  function switchActive(value) {
    changeActive((oldValue) => (oldValue === value ? oldValue : oldValue === 'History' ? 'BlackList' : 'History'))
  }
  const Unblock = (e) => {
    let index = e.target.closest('Button').getAttribute('data-index')
    try {
      Axios.post('/BlackList/Unblock', {
        UserName: e.target.closest('Button').getAttribute('data-user'),
      }).then((result) => {
        let ar = usersBlock
        ar.splice(index, 1)
        changeUsersBlock([...ar])
      })
    } catch (error) {}
  }
  React.useEffect(() => {
    try {
      Axios.get('/BlackList').then((result) => {
        changeUsersBlock(result.data)
      })
    } catch (error) {}
    try {
      Axios.get('/History').then((result) => {
        changeListHistory(result.data)
      })
    } catch (error) {}
  }, [])
  return (
    <div style={{ width: '90%' }}>
      <List>
        <div className="titerListUser">
          <ListItem>
            <div
              className="LayoutSwitch"
              style={{
                marginTop: '0px',
                marginBottom: '0px',
                backgroundColor: 'var(--background-QuickActions)',
                marginLeft: '0px',
              }}
            >
              <div className="LayoutSwitchActive" style={active === 'History' ? { left: '6px' } : { left: '134px' }}></div>
              <div
                className={active === 'History' ? 'LayoutSwitchItem LayoutSwitchItemActive' : 'LayoutSwitchItem'}
                onClick={() => {
                  switchActive('History')
                }}
              >
                History
              </div>
              <div
                className={active === 'BlackList' ? 'LayoutSwitchItem LayoutSwitchItemActive' : 'LayoutSwitchItem'}
                onClick={() => {
                  switchActive('BlackList')
                }}
              >
                BlackList
              </div>
            </div>
            <ListItemSecondaryAction>
              <div className="search" style={{ marginRight: '5px' }}>
                <SearchIcon
                  style={{
                    color: 'var(--color-QuickActionsMenu)',
                    width: '19px',
                    marginLeft: '8px',
                    marginRight: '9px',
                  }}
                />
                <InputBase
                  placeholder="Search…"
                  onChange={(e) => {
                    if (active === 'History')
                      try {
                        Axios.post('/History/SearchHistory', {
                          UserName: e.target.value,
                        }).then((result) => {
                          changeListHistory([...result.data])
                        })
                      } catch (error) {}
                    else
                      try {
                        Axios.post('/BlackList/SearchUserBlock', {
                          UserName: e.target.value,
                        }).then((result) => {
                          changeUsersBlock([...result.data])
                        })
                      } catch (error) {}
                  }}
                  onFocus={(e) => {
                    e.target.closest('.search').style.width = '210px'
                  }}
                  onBlur={(e) => {
                    e.target.closest('.search').style.width = '140px'
                  }}
                />
              </div>
            </ListItemSecondaryAction>
          </ListItem>
        </div>
      </List>
      {active === 'BlackList' ? (
        <List>
          {usersBlock.length !== 0 ? (
            usersBlock.map((user, key) => (
              <div key={key}>
                <ListItem>
                  {width >= 552 ? (
                    <ListItemAvatar>
                      <Avatar>
                        <img
                          src={user.Images}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                          alt="..."
                        />
                      </Avatar>
                    </ListItemAvatar>
                  ) : (
                    ''
                  )}
                  <ListItemText primary={user.UserName} secondary={user.Email} style={{ fontSize: '17px' }} alt="..." />
                  <ListItemSecondaryAction>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      data-user={user.UserName}
                      data-index={key}
                      style={{
                        fontWeight: '900',
                        borderRadius: '5px',
                        backgroundColor: 'var(--background-Nav)',
                      }}
                      onClick={Unblock}
                    >
                      Unblock
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
              </div>
            ))
          ) : (
            <div
              style={{
                display: 'flex',
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: '70px',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <p className="labelInfo" style={{ width: '230px', fontSize: '20px' }}>
                Ops... Users Not Found
              </p>
            </div>
          )}
        </List>
      ) : (
        <List>
          {listHistory.length !== 0 ? (
            listHistory.map((user, key) => (
              <div key={key}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <img
                        src={user.Images}
                        alt="..."
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </Avatar>
                  </ListItemAvatar>

                  <ListItemText primary={user.UserName} secondary={user.Content} style={{ fontSize: '17px' }} />
                  {width >= 552 ? (
                    <ListItemSecondaryAction>
                      <p style={{ color: 'var(--color-FriendInfo-firstChild)' }}>{ConvertDate(user.DateCreation, 'time')}</p>
                    </ListItemSecondaryAction>
                  ) : (
                    ''
                  )}
                </ListItem>
                <Divider />
              </div>
            ))
          ) : (
            <div
              style={{
                display: 'flex',
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: '70px',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <p className="labelInfo" style={{ width: '230px', fontSize: '20px' }}>
                Ops... History is empty
              </p>
            </div>
          )}
        </List>
      )}
    </div>
  )
}
