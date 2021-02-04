import React, { useState, useEffect, useContext } from 'react' // eslint-disable-next-line
import { Nav } from './Nav'
import { QuickActions } from './QuickActions'
import '../Css/Dashboard.css'
import { DashboardBody } from './DashboardBody' // eslint-disable-next-line
import { ModeStyle } from '../Data/ModeStyle'
import { useWindowSize } from './UseWindowSize'
import { DataContext } from '../Context/AppContext'

function Layout(props) {
  const [active, changeActive] = useState('Menu')
  function switchActive(value) {
    changeActive((oldValue) => (oldValue === value ? oldValue : oldValue === 'Menu' ? 'QuickActions' : 'Menu'))
  }
  return (
    <div
      className="Layout"
      style={{
        ...props.style,
        transform: active === 'Menu' ? 'translateX(0px)' : 'translateX(-285px)',
      }}
    >
      <div
        className="LayoutSwitch"
        style={{
          transform: active === 'Menu' ? 'translateX(0px)' : 'translateX(295px)',
        }}
      >
        <div className="LayoutSwitchActive" style={active === 'Menu' ? { left: '6px' } : { left: '134px' }}></div>
        <div className={active === 'Menu' ? 'LayoutSwitchItem LayoutSwitchItemActive' : 'LayoutSwitchItem'} onClick={() => switchActive('Menu')}>
          Menu
        </div>
        <div className={active === 'QuickActions' ? 'LayoutSwitchItem LayoutSwitchItemActive' : 'LayoutSwitchItem'} onClick={() => switchActive('QuickActions')}>
          QuickActions
        </div>
      </div>
      <div className="LayoutSelected">
        <Nav user={props.user} />
        <QuickActions />
      </div>
    </div>
  )
}
function Dashboard(props) {
  const ctx = useContext(DataContext)
  const userJSON = JSON.parse(localStorage.getItem('userInfo'))
  const [user, changeUser] = useState(userJSON)
  const width = useWindowSize()
  const [LayoutHide, changeLayoutHide] = useState(true)
  useEffect(() => {
    if (width >= 1000 && !LayoutHide) changeLayoutHide(true) // eslint-disable-next-line
  }, [width])
  return (
    <div className="Dashboard" style={ModeStyle[ctx.cache.Mode].Dashboard}>
      {width <= 1600 ? (
        <Layout
          style={{
            width: LayoutHide ? '285px' : '0px',
            minWidth: LayoutHide ? '285px' : '0px',
            overflow: LayoutHide ? 'inherit' : 'hidden',
          }}
          user={user}
        />
      ) : null}
      {width > 1600 ? <Nav user={user} /> : null}
      <DashboardBody style={{ zIndex: 7 }} changeLayoutHide={() => changeLayoutHide((oldValue) => !oldValue)} width={width} user={user} changeUser={changeUser} ChangeIsLogin={props.ChangeIsLogin} />
      {width > 1600 ? <QuickActions /> : null}
    </div>
  )
}
export { Dashboard, Layout }
