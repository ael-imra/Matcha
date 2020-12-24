import React, { useState, useContext } from 'react';
import '../Css/header.css';
import logo from '../Images/logo.svg';
import { CSSTransition } from 'react-transition-group';
import { DataContext } from '../Context/AppContext';
import Menu from './Menu';
import IconMenu from './IconMenu';
import { language } from '../Data/language/language';
import { useLocation } from 'react-router-dom';

const Header = (props) => {
  const [showMenu, ChangeStateMenu] = useState(false);
  let location = useLocation();
  const ctx = useContext(DataContext);
  return (
    <div className='header'>
      <div className='logo'>
        <img src={logo} alt='...' />
        <p
          style={{
            color: ctx.Mode === 'Dark' ? 'white' : 'black',
          }}>
          Matcha
        </p>
      </div>
      <div className='menu'>
        <button
          className='ft_btn'
          style={{ height: '33px' }}
          onClick={() => {
            props.dataHome.StateHome === 3 ? props.dataHome.ChangeHome(2) : props.dataHome.ChangeHome(3);
          }}>
          {location.pathname.includes('/step/') ? 'logout' : props.dataHome.StateHome === 3 ? language[ctx.Lang].singup2 : language[ctx.Lang].singin}
        </button>
        <IconMenu dataHome={{ showMenu, ChangeStateMenu }} />
      </div>
      <CSSTransition in={showMenu} timeout={500} classNames='box-menu' unmountOnExit>
        <Menu />
      </CSSTransition>
    </div>
  );
};

export default Header;
