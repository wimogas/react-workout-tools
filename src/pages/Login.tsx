import React, {useContext, useEffect, useState} from 'react'
import {Link, Navigate} from "react-router-dom";
import {Button, Block, Input, Alert, Text} from 'react-barebones-ts'
import {signInWithEmailAndPassword, signInWithPopup, setPersistence, browserLocalPersistence, onAuthStateChanged  } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

import userContext, {User} from "../store/user-context";

import AuthWrapper from "../layout/AuthWrapper";
import Spinner from "../components/spinner/Spinner";

type NewUser = {
    email: string,
    password: string
}

const Login = () => {

    const userCtx = useContext(userContext)

    const [user, setUser] = useState<NewUser>({
        email: '',
        password: ''
    })

    const [alert, setAlert] = useState("Something went wrong")

    const [redirect, setRedirect] = useState(false)
    const [showAlert, setShowAlert] = useState(false)
    const [errors, setErrors] = useState(false)
    const [loading, setLoading] = useState(false)
    const handleChangeField = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUser((user: any) => ({
            ...user,
            [e.target.name]: e.target.value
        }))
    }

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()

        setLoading(true)

        let foundError = (Object.values(user).some((v) => v === ""))

        if (foundError) {
            setErrors(true)
            setLoading(false)
            return
        }

        return setPersistence(auth, browserLocalPersistence).then(() => {
            signInWithEmailAndPassword(auth, user.email, user.password)
                .then(() => {
                    const userNow = auth.currentUser;
                    if (userNow) {
                        const currentUser: User = {
                            name: userNow.displayName || '',
                            id: userNow.uid
                        }
                        if (userCtx) userCtx.updateUser(currentUser)
                    }

                })
                .catch((error) => {
                    setAlert("Invalid Credentials")
                    setShowAlert(true)
                    setLoading(false)
                });
        })
    }

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                userCtx.updateUser({
                    name: user.displayName,
                    id: user.uid
                })
                setRedirect(true)
            }
        })
    }, [userCtx.user])

    if (redirect) {
        return <Navigate to={'/'}/>
    }

    return (
        <AuthWrapper>
            {showAlert && <Block stretch classes={'bb-pb-500'}>
                <Alert
                    variant='error'
                    message={alert}
                /></Block>}
            <form onSubmit={(e: React.SyntheticEvent<HTMLFormElement>) => handleSubmit(e)}>
                <Block
                    column
                    size={300}
                    classes={'bb-mb-400'}
                >
                    {Object.entries(user).map(([key, value]) => {
                        const returnType = (k:string) => {
                            if (k === 'password' || k === 'password_confirm') {
                                return 'password'
                            } else if (k === 'email') {
                                return 'email'
                            } else {
                                return 'text'
                            }
                        }
                        return (
                            <Input
                                label={key}
                                key={key}
                                name={key}
                                value={value}
                                error={errors && value === ""}
                                type={returnType(key)}
                                onChange={handleChangeField}
                            />
                        )
                    })}
                </Block>
                <Block
                    column
                    size={300}
                    align={'center'}
                >
                    <Button
                        action={() => {}}
                        variant='primary'
                        type='submit'
                        icon={loading && <Spinner/>}
                        classes={'new-button'}
                    >
                        Login
                    </Button>
                    <Block size={100}>
                        <Text type={'span'} color={'secondary'} dark text={'Not registered? '}/><Link to="/register"><Text type={'span'} color={'primary'} dark text={'Create an account'}/></Link>
                    </Block>
                </Block>
            </form>
        </AuthWrapper>
    )
}

export default Login;