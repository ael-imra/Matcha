import React, { useState,useEffect} from 'react'; // eslint-disable-next-line
import { Nav } from './Nav';
import { QuickActions } from './QuickActions';
import '../Css/Dashboard.css';
import { DashboardBody } from './DashboardBody'; // eslint-disable-next-line
import { ModeStyle } from '../Data/ModeStyle';
import {useWindowSize} from './UseWindowSize'

function Layout(props) {
  const [active, changeActive] = useState('Menu');
  function switchActive(value) {
    changeActive((oldValue) => (oldValue === value ? oldValue : oldValue === 'Menu' ? 'QuickActions' : 'Menu'));
  }
  return (
    <div
      className='Layout'
      style={{
        ...props.style,
        transform: active === 'Menu' ? 'translateX(0px)' : 'translateX(-285px)',
      }}>
      <div
        className='LayoutSwitch'
        style={{
          transform: active === 'Menu' ? 'translateX(0px)' : 'translateX(295px)',
        }}>
        <div className='LayoutSwitchActive' style={active === 'Menu' ? { left: '6px' } : { left: '134px' }}></div>
        <div className={active === 'Menu' ? 'LayoutSwitchItem LayoutSwitchItemActive' : 'LayoutSwitchItem'} onClick={() => switchActive('Menu')}>
          Menu
        </div>
        <div className={active === 'QuickActions' ? 'LayoutSwitchItem LayoutSwitchItemActive' : 'LayoutSwitchItem'} onClick={() => switchActive('QuickActions')}>
          QuickActions
        </div>
      </div>
      <div className='LayoutSelected'>
        <Nav />
        <QuickActions  friendsList={props.friendsList} messagesData={props.messagesData} chatUserInfo={props.chatUserInfo} />
      </div>
    </div>
  );
}
function Dashboard(props) {
<<<<<<< HEAD
  const ctx = useContext(DataContext);
=======
  // const ctx = useContext(DataContext);
>>>>>>> 373317800fa74e0be0ca0254660386c51e97d4ae
  const width = useWindowSize();
  const [LayoutHide, changeLayoutHide] = useState(true);
  const friendsList = []
  const messagesData = []
  let chatUserInfo = {}
  useEffect(() => {
    if (width > 1540) changeLayoutHide(false);
    else if (width <= 1540) changeLayoutHide(true);// eslint-disable-next-line
  }, [width]);
  return (
    <div className='Dashboard' style={ModeStyle['Light'].Dashboard}>
      {width < 1540 ? (
        <Layout
          style={{
            width: !LayoutHide ? '285px' : '0px',
            minWidth: !LayoutHide ? '285px' : '0px',
          }}
           friendsList={friendsList} messagesData={messagesData} chatUserInfo={chatUserInfo} 
        />
      ) : null}
      {width >= 1540 ? <Nav /> : null}
      <DashboardBody style={{ zIndex: 7 }} changeLayoutHide={changeLayoutHide} width={width}/>
      {width >= 1540 ? <QuickActions friendsList={friendsList} messagesData={messagesData} chatUserInfo={chatUserInfo} /> : null}
    </div>
  );
}
export { Dashboard,Layout };