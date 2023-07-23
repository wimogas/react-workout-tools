import React from "react";

import ArrowRight from "../assets/icons/arrow-right-s-line.svg";
import ArrowLeft from "../assets/icons/arrow-left-s-line.svg";

import {Block, Button, Text} from "react-barebones-ts";

type HeaderProps = {
    date: string,
    handleShowPrevDay: () => void,
    handleShowNextDay: () => void
}

const Header = ({date, handleShowPrevDay, handleShowNextDay}: HeaderProps) => {
    return (
        <Block justify={'space-between'} classes={'bb-w-100'}>
            <Button variant={'secondary'} icon={<ArrowLeft/>} action={handleShowPrevDay}/>
            <Text type={'h1'} text={date}/>
            <Button variant={'secondary'} icon={<ArrowRight/>} action={handleShowNextDay}/>
        </Block>
    );
}

export default Header;