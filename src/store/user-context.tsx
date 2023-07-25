import React, { createContext, useEffect, useState } from "react";

export type User = {
    name: string ,
    id: string
}

type UserCont = {
    user: User,
    loadingUser: boolean,
    loadUser: any,
    updateUser: any
}

const UserContext = createContext<UserCont>(
    {
        user: {
            name: '',
            id: ''
        },
        loadingUser: false,
        loadUser: () => {},
        updateUser: (user: User) => {}
    },
);

export const UserContextProvider = (props: any) => {

    const [loadingUser, setLoadingUser] = useState(true)

    const [user, setUser] = useState<User>({
        name: '',
        id: ''
    })

    const loadUser = () :any => {
        setLoadingUser(true)
    }

    const updateUser = (user: User): any => {
        setUser(() => user)
        setLoadingUser(false)
    }

    const context: UserCont = {
        user,
        loadingUser,
        loadUser,
        updateUser
    }

    return (
        <UserContext.Provider value={context}>
            {props.children}
        </UserContext.Provider>
    );
};

export default UserContext;
