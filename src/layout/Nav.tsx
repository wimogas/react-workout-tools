import React, {useContext, useState} from "react";
import {Link, Navigate} from "react-router-dom";
import {  signOut } from "firebase/auth";
import {auth} from '../firebase';

import userContext from "../store/user-context";

import SunIcon from '../assets/icons/sun-fill.svg';
import MoonIcon from '../assets/icons/moon-fill.svg';

import LogoutIcon from '../assets/icons/logout-box-r-line.svg';

import {ThemeContext} from "../store/theme-context";

import {Block, Button, Text} from 'react-barebones-ts'
import useFirebaseAuth from "../hooks/useFirebaseAuth";

const Nav = () => {

    const userCtx = useContext(userContext)
    const themeCtx = useContext(ThemeContext);

    const [redirect, setRedirect] = useState(false)

    const handleThemeToggle = () => {
        themeCtx.toggleDark();
    }

    const handleSignOut = () => {
        signOut(auth).then(() => {
            userCtx.updateUser({
                name: '',
                id: ''
            })
            setRedirect(true)
        }).catch((error) => {
            console.log(error);
        });
    }

    if (redirect) {
        return <Navigate to={'/login'}/>
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
            <Block size={800}>
                <Link to="/">
                    <Text color={'secondary'} dark text={'Workouts'}/>
                </Link>
                <Link to="/plans">
                    <Text color={'secondary'} dark text={'Plans'}/>
                </Link>
            </Block>
            <Block size={200}>
                <Button variant={'icon-only'} iconSize={24} icon={themeCtx.dark ? <SunIcon/> : <MoonIcon/>} dark action={handleThemeToggle}/>
                <Button variant={'icon-only'} iconSize={24} icon={<LogoutIcon/>} dark action={() => handleSignOut()}/>
            </Block>
        </Block>
    );
};

export default Nav;
