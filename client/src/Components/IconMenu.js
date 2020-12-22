import React, { useContext } from 'react';
import { DataContext } from '../Context/AppContext'
import '../Css/iconsMenu.css';

const IconMenu = (props) => {
  const ctx = useContext(DataContext);
  return (
    <div
      className={`${props.dataHome.showMenu ? 'icon-menu-active' : 'icon-menu-show'}`}
      onClick={() => {
        props.dataHome.ChangeStateMenu(!props.dataHome.showMenu);
      }}>
      <div
        style={{
          backgroundColor: ctx.Mode === 'Dark' ? 'white' : 'black'
        }}></div>
      <div
        style={{
          backgroundColor: ctx.Mode === 'Dark' ? 'white' : 'black'
        }}></div>
      <div
        style={{
          backgroundColor: ctx.Mode === 'Dark' ? 'white' : 'black'
        }}></div>
    </div>
  );
};

export default IconMenu;
