import React, {useContext} from "react";
import {Link} from "react-router-dom";
import {  signOut } from "firebase/auth";
import {auth} from '../firebase';

import userContext from "../store/user-context";

import SunIcon from '../assets/icons/sun-fill.svg';
import MoonIcon from '../assets/icons/moon-fill.svg';

import LogoutIcon from '../assets/icons/logout-box-r-line.svg';

import {ThemeContext} from "../store/theme-context";

import {Block, Button, Text} from 'react-barebones-ts'

const Nav = () => {

    const userCtx = useContext(userContext)

    const themeCtx = useContext(ThemeContext);

    const handleThemeToggle = () => {
        themeCtx.toggleDark();
    }

    const handleSignOut = () => {
        signOut(auth).then(() => {
            userCtx.updateUser({
                name: '',
                id: ''
            });
            console.log('signed out');

        }).catch((error) => {
            // An error happened.
            console.log(error);
        });
    }

    return (
        <Block
            classes={'bb-px-600 bb-py-400 bb-w-100'}
           align={'center'} justify={'space-between'}
           style={{
                "backgroundColor": themeCtx.dark ? "var(--color-primary-darkest)" : "var(--color-primary-darker)",
               "height": "66px",
            }}
        >
            <Block size={300}>
                <Link to="/">
                    <Text color={'secondary'} dark text={'WORKOUT TOOLS'}/>
                </Link>
            </Block>
            <Block size={200}>
                <Button variant={'icon-only'} iconSize={20} icon={themeCtx.dark ? <SunIcon/> : <MoonIcon/>} dark action={handleThemeToggle}/>
                <Button variant={'icon-only'} iconSize={20} icon={<LogoutIcon/>} dark action={() => handleSignOut()}/>
            </Block>
        </Block>
    );
};

export default Nav;
