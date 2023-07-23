import React, {ReactComponentElement} from "react";

import Content from "./Content";
import Nav from "./Nav";

import './AppWrapper.scss'

import {Block} from 'react-barebones-ts'

type ContentProps = {
    children: ReactComponentElement<any>
}
const AppWrapper = ({children}: ContentProps) => {

    return(
        <>
        <Nav/>
            <Block classes={'app-wrapper-container'}>
                <Content>
                    {children}
                </Content>
            </Block>
        </>
    )
}

export default AppWrapper;