import React, {ReactComponentElement, useContext, useEffect, useState} from "react";
import { onAuthStateChanged } from "firebase/auth";
import {auth} from "../firebase";
import {Navigate} from "react-router-dom";
import {Block} from 'react-barebones-ts'

import Content from "./Content";
import Nav from "./Nav";

import UserContext from "../store/user-context";
import {ThemeContext} from "../store/theme-context";
import Spinner from "../components/spinner/Spinner";

type ContentProps = {
    children: ReactComponentElement<any>
}
const AppWrapper = ({children}: ContentProps) => {

    const userCtx = useContext(UserContext);
    const themeCtx = useContext(ThemeContext);

    const [redirect, setRedirect] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                userCtx.updateUser({
                    name: user.displayName,
                    id: user.uid
                })
                setLoading(false)

            } else {
                setLoading(false)
                setRedirect(true)
            }
        })
    }, [userCtx.user])

    if (loading) {
        return <Block style={{
            "backgroundColor" : "var(--color-primary-darker)",
            "minHeight": "100vh"}}><Spinner fullWidth/></Block>
    }

    if (redirect) {
        return <Navigate to={'/login'}/>
    }

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