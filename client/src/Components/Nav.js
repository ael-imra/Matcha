import React from "react";
import { NavLink } from "react-router-dom";
import {
    IconHome,
    IconProfile,
    IconMessages,
    IconHistory,
    IconSettings,
} from "./Icons";
import "../Css/Nav.css";
function Nav(props) {
    return (
            <nav style={props.style?props.style:{}} className={props.className ? `Nav${props.className}` : "Nav"}>
                <div className='Logo'>
                    <NavLink
                        className='NavLink'
                        to='/'
                        exact
                        style={{
                            justifyContent: "center",
                            alignItems: "baseline",
                        }}
                    >
                        <h1 style={{ fontSize: "28px" }}>Matcha</h1>
                        <span style={{ margin: "6px" }}>Menu</span>
                    </NavLink>
                </div>
                <div className='Menu'>
                    <NavLink
                        className='NavLink'
                        activeClassName='NavLinkActive'
                        to='/'
                        exact
                    >
                        <IconHome fill='#318fb5' width={20} height={20} />
                        <span>Home</span>
                    </NavLink>
                    <NavLink
                        className='NavLink'
                        activeClassName='NavLinkActive'
                        to='/profile'
                        exact
                    >
                        <IconProfile fill='#318fb5' width={20} height={20} />
                        <span>Profile</span>
                    </NavLink>
                    <NavLink
                        className='NavLink'
                        activeClassName='NavLinkActive'
                        to='/messages'
                        exact
                    >
                        <IconMessages fill='#318fb5' width={20} height={20} />
                        <span>Messages</span>
                    </NavLink>
                    <NavLink
                        className='NavLink'
                        activeClassName='NavLinkActive'
                        to='/history'
                        exact
                    >
                        <IconHistory fill='#318fb5' width={20} height={20} />
                        <span>History</span>
                    </NavLink>
                    <NavLink
                        className='NavLink'
                        activeClassName='NavLinkActive'
                        to='/settings'
                        exact
                    >
                        <IconSettings fill='#318fb5' width={20} height={20} />
                        <span>Settings</span>
                    </NavLink>
                </div>
                <div className='Logout'>
                    <NavLink className='NavLink' to='/logout' exact>
                        Logout
                    </NavLink>
                </div>
            </nav>
    );
}
export { Nav };
