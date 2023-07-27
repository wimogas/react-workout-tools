import React, { createContext, useState } from "react";
import {doc, getFirestore, setDoc} from "@firebase/firestore/lite";
import {app} from "../firebase";

export type User = {
    name: string ,
    id: string,
}

type UserCont = {
    user: User,
    updateUser: any,
    createNewUser: any,
}

const UserContext = createContext<UserCont>(
    {
        user: {
            name: '',
            id: '',
        },
        updateUser: (user: User) => {},
        createNewUser: (user: User) => {},
    },
);

export const UserContextProvider = (props: any) => {

    const firestore = getFirestore(app);

    const [user, setUser] = useState<User>({
        name: '',
        id: '',
    })

    const updateUser = (user: User) => {
        setUser(() => user)
    }

    const createNewUser = async (user: User) => {
        await setDoc(doc(firestore, "users", user.id), {
            name: user.name,
            currentPlan: 'Template Plan'
        });
    }

    const context: UserCont = {
        user,
        updateUser,
        createNewUser
    }

    return (
        <UserContext.Provider value={context}>
            {props.children}
        </UserContext.Provider>
    );
};

export default UserContext;
