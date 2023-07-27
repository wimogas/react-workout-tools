import React, {useContext, useState} from 'react'
import {Link, Navigate} from "react-router-dom";
import {Button, Block, Input, Alert, Text} from 'react-barebones-ts'

import {createUserWithEmailAndPassword, updateProfile} from 'firebase/auth';
import { auth } from '../firebase';

import UserContext from "../store/user-context";
import PlanContext from "../store/plan-context";

import AuthWrapper from "../layout/AuthWrapper";
import Spinner from "../components/spinner/Spinner";


type UserForm = {
    name: string,
    email: string,
    password: string,
    password_confirm: string,
}
const Register = () => {

    const userCtx = useContext(UserContext);
    const planCtx = useContext(PlanContext);

    const [user, setUser] = useState<UserForm>(
        {
            name: '',
            email: '',
            password: '',
            password_confirm: ''
        }
    )

    const [redirect, setRedirect] = useState(false)
    const [alert, setAlert] = useState("Something went wrong")

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

        if(user.password !== user.password_confirm) {
            setAlert("Passwords do not match")
            setShowAlert(true)
            setLoading(false)
            return
        }

        await createUserWithEmailAndPassword(auth, user.email, user.password)
            .then(() => {
                const userNow = auth.currentUser;
                if (userNow) {
                    updateProfile(userNow,{
                        displayName: user.name,
                    }).then(function() {
                        const newUser = {
                            name: userNow.displayName,
                            id: userNow.uid,
                        }
                        userCtx.createNewUser(newUser)
                    }).then( function() {
                        const newPlan = {
                            name: 'Template Plan',
                            user_id: userNow.uid,
                            is_selected: true
                        }
                        planCtx.createNewPlan(newPlan)
                        setRedirect(true)
                    }).catch(function(error) {
                        setAlert(error.message)
                        setShowAlert(true)
                        setLoading(false)
                    })
                }
            })
            .catch((error) => {
                setAlert(error.message)
                setShowAlert(true)
                setLoading(false)
        });
    }

    if (redirect) {
        return <Navigate to={'/'}/>
    }

    return (
        <AuthWrapper>
            {showAlert && <Alert
                variant={'error'}
                message={alert}/>}
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
                        variant={'primary'}
                        icon={loading && <Spinner/>}
                        type={'submit'}
                        action={() => {}}
                    >
                        Register
                    </Button>
                    <Block size={100}>
                        <Text type={'span'} color={'secondary'} dark text={'Already registered? '}/><Link to="/login"><Text type={'span'} color={'primary'} dark text={'Sign in'}/></Link>
                    </Block>
                </Block>
            </form>
        </AuthWrapper>
    )
}

export default Register;