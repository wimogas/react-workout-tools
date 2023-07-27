import React, {useContext, useEffect, useState} from "react";
import {Navigate} from "react-router-dom";
import {Block} from 'react-barebones-ts'

import styles from "./AuthWrapper.module.css";

import useFirebaseAuth from "../hooks/useFirebaseAuth";
import userContext from "../store/user-context";

import Spinner from "../components/spinner/Spinner";

type ContentProps = {
    children: any
}
const AuthWrapper = ({children}: ContentProps) => {

    const userCtx = useContext(userContext)

    const [redirect, setRedirect] = useState(false)
    const [loading, setLoading] = useState(false)

    const {authLoading, authUser} = useFirebaseAuth()

    useEffect(() => {
        setLoading(authLoading)
        if (authUser.id === "" && !authLoading) {
            userCtx.updateUser(authUser)
        }
    }, [authLoading, authUser])

    if (loading) {
        return <Block style={{
            "backgroundColor" : "var(--color-primary-darker)",
            "minHeight": "100vh"}}><Spinner fullWidth/></Block>
    }

    if (redirect) {
        return <Navigate to={'/login'}/>
    }

    return (
        <Block
            classes={styles['wrapper']}>
            <Block
                variant={'card'}
                dark
                column
                classes={styles['container']}
            >
                {children}
            </Block>
        </Block>
    )
}

export default AuthWrapper;