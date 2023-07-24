import React, {ReactComponentElement, useContext} from "react";

import Content from "./Content";
import Nav from "./Nav";

import {ThemeContext} from "../store/theme-context";

import {Block} from 'react-barebones-ts'

type ContentProps = {
    children: ReactComponentElement<any>
}
const AppWrapper = ({children}: ContentProps) => {

    const themeCtx = useContext(ThemeContext);

    return(
        <Block column>
            <Nav/>
            <Block style={{
                "backgroundColor" : themeCtx.dark ? "var(--color-primary-darker)" : "white",
                "minHeight": "calc(100vh - 66px)"}}>
                <Content>
                    {children}
                </Content>
            </Block>
        </Block>
    )
}

export default AppWrapper;