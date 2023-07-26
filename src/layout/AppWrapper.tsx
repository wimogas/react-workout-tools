import React, {ReactComponentElement, useContext, useEffect, useState} from "react";

import {Navigate} from "react-router-dom";
import {Block} from 'react-barebones-ts'

import Content from "./Content";
import Nav from "./Nav";
import Spinner from "../components/spinner/Spinner";

import {ThemeContext} from "../store/theme-context";

import useFirebaseAuth from "../hooks/useFirebaseAuth";
import userContext from "../store/user-context";

type ContentProps = {
    children: ReactComponentElement<any>
}
const AppWrapper = ({children}: ContentProps) => {

    const userCtx = useContext(userContext)
    const themeCtx = useContext(ThemeContext);

    const [redirect, setRedirect] = useState(false)
    const [loading, setLoading] = useState(true)

    const {authLoading, authUser} = useFirebaseAuth()

    useEffect(() => {
        setLoading(authLoading)
        userCtx.updateUser(authUser)
        if (authUser.id === "" && !authLoading) {
            setRedirect(true)
        }
    }, [authLoading, authUser])

    useEffect(() => {
        if (userCtx.user.id !== "" && Object.keys(userCtx.workoutPlan).length === 0) {
            userCtx.getWorkoutPlan()
        }
    }, [userCtx.user, userCtx.workoutPlan])

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