import React, { createContext, useState } from "react";

export type User = {
    name: string ,
    id: string,
}

type UserCont = {
    user: User,
    updateUser: any,
}

const UserContext = createContext<UserCont>(
    {
        user: {
            name: '',
            id: '',
        },
        updateUser: (user: User) => {},
    },
);

export const UserContextProvider = (props: any) => {

    const [user, setUser] = useState<User>({
        name: '',
        id: '',
    })

    const updateUser = (user: User): any => {
        setUser(() => user)
    }

    const context: UserCont = {
        user,
        updateUser,
    }

    return (
        <UserContext.Provider value={context}>
            {props.children}
        </UserContext.Provider>
    );
};

export default UserContext;
