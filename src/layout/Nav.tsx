import React, {useContext} from "react";
import {Link} from "react-router-dom";

import SunIcon from '../assets/icons/sun-fill.svg';
import MoonIcon from '../assets/icons/moon-fill.svg';

import {ThemeContext} from "../store/theme-context";

import {Block, Button, Text} from 'react-barebones-ts'

const Nav = () => {

    const themeCtx = useContext(ThemeContext);

    const handleThemeToggle = () => {
        themeCtx.toggleDark();
    }

    return (
        <Block classes={'bb-px-600 bb-py-400 bb-w-100'} align={'center'} justify={'space-between'} style={{
            "backgroundColor": themeCtx.dark ? "var(--color-primary-darkest)" : "var(--color-primary-darker)"
        }}>
            <Block size={300}>
                <Link to="/">
                    <Text color={'secondary'} dark text={'WORKOUT TOOLS'}/>
                </Link>
            </Block>
            <Block>
                <Button variant={'tertiary'} iconSize={16} icon={themeCtx.dark ? <SunIcon/> : <MoonIcon/>}dark action={handleThemeToggle}/>
            </Block>
        </Block>
    );
};

export default Nav;
