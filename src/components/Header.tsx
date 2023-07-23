import React from "react";

import ArrowRight from "../assets/icons/arrow-right-s-line.svg";
import ArrowLeft from "../assets/icons/arrow-left-s-line.svg";

import {Block, Button, Text} from "react-barebones-ts";

type HeaderProps = {
    dark: boolean,
    date: string,
    handleShowPrevDay: () => void,
    handleShowNextDay: () => void
}

const Header = ({dark, date, handleShowPrevDay, handleShowNextDay}: HeaderProps) => {
    return (
        <Block justify={'space-between'} classes={'bb-w-100'}>
            <Button variant={dark ? 'tertiary' : 'secondary'} dark={dark} icon={<ArrowLeft/>} action={handleShowPrevDay}/>
            <Text type={'h1'} color={'secondary'} dark={dark} text={date}/>
            <Button variant={dark ? 'tertiary' : 'secondary'} dark={dark} icon={<ArrowRight/>} action={handleShowNextDay}/>
        </Block>
    );
}

export default Header;