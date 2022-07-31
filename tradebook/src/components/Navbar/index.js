import React from "react";
import {
    Nav,
    NavLogo,
    NavLink,
    NavMenu,
} from "./NavbarElements";
import logo from "../../assets/logo.png";

const Navbar = () => {
    return (
        <Nav>
            <NavLogo to="/">
                <img src={logo} alt="Logo" width="100" height="30"/>
            </NavLogo>
            <NavMenu>
                <NavLink 
                    to="/Search" 
                    activeStyle={{ color: 'black' }}
                >
                    Tradebooks
                </NavLink>
                <NavLink 
                    to="/Messages" 
                    activeStyle={{ color: 'black' }}
                >
                    Messages
                </NavLink>
                <NavLink 
                    to="/Profile" 
                    activeStyle={{ color: 'black' }}
                >
                    Profile
                </NavLink>
            </NavMenu> 
        </Nav> 
    );
};

export default Navbar;