import React, {ReactComponentElement} from "react";

import Content from "./Content";
import Nav from "./Nav";

import {Block} from 'react-barebones-ts'

type ContentProps = {
    children: ReactComponentElement<any>
}
const AppWrapper = ({children}: ContentProps) => {

    return(
        <>
        <Nav/>
            <Block>
                <Content>
                    {children}
                </Content>
            </Block>
        </>
    )
}

export default AppWrapper;