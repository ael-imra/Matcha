import React, { useState, useEffect, useContext } from 'react' // eslint-disable-next-line
import { Nav } from './Nav'
import { QuickActions } from './QuickActions'
import '../Css/Dashboard.css'
import { DashboardBody } from './DashboardBody' // eslint-disable-next-line
import { useWindowSize } from './UseWindowSize'
import { DataContext } from '../Context/AppContext'
import { ModeStyle } from '../Data/ModeStyle'

function Layout(props) {
  const ctx = useContext(DataContext)
  const [active, changeActive] = useState('Menu')
  function switchActive(value) {
    changeActive((oldValue) =>
      oldValue === value
        ? oldValue
        : oldValue === 'Menu'
        ? 'QuickActions'
        : 'Menu'
    )
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
          transform:
            active === 'Menu' ? 'translateX(0px)' : 'translateX(295px)',
        }}
      >
        <div
          className="LayoutSwitchActive"
          style={active === 'Menu' ? { left: '6px' } : { left: '134px' }}
        ></div>
        <div
          className={
            active === 'Menu'
              ? 'LayoutSwitchItem LayoutSwitchItemActive'
              : 'LayoutSwitchItem'
          }
          onClick={() => switchActive('Menu')}
        >
          Menu
        </div>
        <div
          className={
            active === 'QuickActions'
              ? 'LayoutSwitchItem LayoutSwitchItemActive'
              : 'LayoutSwitchItem'
          }
          onClick={() => switchActive('QuickActions')}
        >
          QuickActions
        </div>
      </div>
      <div className="LayoutSelected">
        <Nav style={ModeStyle[ctx.Mode].Nav} />
        <QuickActions />
      </div>
    </div>
  )
}
function Dashboard() {
  const ctx = useContext(DataContext)
  const width = useWindowSize()
  const [LayoutHide, changeLayoutHide] = useState(true)
  useEffect(() => {
    if (width > 1260) changeLayoutHide(false)
    else if (width <= 1260) changeLayoutHide(true)
  }, [width])
  return (
    <div className="Dashboard" style={ModeStyle[ctx.Mode].Dashboard}>
      {width < 1540 ? (
        <Layout
          style={{
            width: !LayoutHide ? '285px' : '0px',
            minWidth: !LayoutHide ? '285px' : '0px',
          }}
        />
      ) : null}
      {width >= 1540 ? <Nav /> : null}
      <DashboardBody
        style={{ zIndex: 7 }}
        changeLayoutHide={changeLayoutHide}
        width={width}
      />
      {width >= 1540 ? <QuickActions /> : null}
    </div>
  )
}
export { Dashboard }
