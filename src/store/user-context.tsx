import React, { createContext, useEffect, useState } from "react";
import {collection, doc, getDoc, getDocs, getFirestore, query, where} from "@firebase/firestore/lite";
import {app} from "../firebase";

import data from '../assets/data/workouts.json';

const OFFLINE_MODE = true;

const MOCK_DATA = data;

export type User = {
    name: string ,
    id: string,
}

type UserCont = {
    user: User,
    workoutPlan: any,
    updateUser: any,
    updateWorkoutPlan: any
}

const UserContext = createContext<UserCont>(
    {
        user: {
            name: '',
            id: '',
        },
        workoutPlan: {},
        updateUser: (user: User) => {},
        updateWorkoutPlan: () => {}
    },
);

export const UserContextProvider = (props: any) => {

    const [user, setUser] = useState<User>({
        name: '',
        id: '',
    })

    const [workoutPlan, setWorkoutPlan] = useState<any>({})

    const updateUser = (user: User): any => {
        setUser(() => user)
    }

    const updateWorkoutPlan = async () => {
        if (!OFFLINE_MODE) {
            const firestore = getFirestore(app);
            let currentPlan = '';
            const docRef = doc(firestore, `users/${user.id}`);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                currentPlan = docSnap.data().currentPlan
            }
            const q = query(collection(firestore, "plans"), where("name", "==", currentPlan), where("user_id", "==", user.id));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                if (doc.data().week) {
                    setWorkoutPlan(doc.data().week)
                }
            })
        } else {
            setWorkoutPlan(MOCK_DATA.programs['my plan'].workouts)
        }

    }

    const context: UserCont = {
        user,
        workoutPlan,
        updateUser,
        updateWorkoutPlan
    }



    return (
        <UserContext.Provider value={context}>
            {props.children}
        </UserContext.Provider>
    );
};

export default UserContext;
