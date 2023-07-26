import React, { createContext, useEffect, useState } from "react";
import {collection, doc, getDoc, getDocs, getFirestore, query, where, updateDoc, addDoc} from "@firebase/firestore/lite";
import {app} from "../firebase";

import data from '../assets/data/workouts.json';

const OFFLINE_MODE = false;
const MOCK_DATA = data;

export type User = {
    name: string ,
    id: string,
}

type UserCont = {
    user: User,
    workoutPlan: any,
    updateUser: any,
    getWorkoutPlan: any,
    workoutPlanId: string,
    updateWorkoutPlan: (day: string, exercise: any) => void,
    deleteExerciseFromWorkoutPlan: (day: string, exercise: any) => void,
    createNewPlan: (name: string) => void,
    plans: [],
    getAllPlans: () => void,
    setCurrentPlan: (newCurrentPlan:string) => void
}

const UserContext = createContext<UserCont>(
    {
        user: {
            name: '',
            id: '',
        },
        workoutPlan: {},
        workoutPlanId: '',
        updateUser: (user: User) => {},
        getWorkoutPlan: () => {},
        updateWorkoutPlan: (day, exercise) => {},
        deleteExerciseFromWorkoutPlan: (day, exercise) => {},
        createNewPlan: (name) => {},
        plans: [],
        getAllPlans: () => {},
        setCurrentPlan: (newCurrentPlan) => {}
    },
);

export const UserContextProvider = (props: any) => {

    const firestore = getFirestore(app);

    const [plans, setPlans] = useState<any>([])

    const [user, setUser] = useState<User>({
        name: '',
        id: '',
    })

    const [workoutPlanId, setWorkoutPlanId] = useState<string>('')

    const [workoutPlan, setWorkoutPlan] = useState<any>({})

    const updateUser = (user: User): any => {
        setUser(() => user)
    }

    const getCurrentPlan = async () => {
        if (!OFFLINE_MODE) {
            const docRef = doc(firestore, `users/${user.id}`);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return docSnap.data().currentPlan
            }
        }
    }

    const setCurrentPlan = async (newCurrentPlan:string) => {
        if (!OFFLINE_MODE) {
            const docRef = doc(firestore, "users", user.id);
            await updateDoc(docRef, {
                currentPlan: newCurrentPlan
            });
        }
        await getWorkoutPlan()
    }

    const getAllPlans = async () => {
        if (!OFFLINE_MODE) {
            const q = query(collection(firestore, "plans"), where("user_id", "==", user.id));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                const returnedPlan = {
                    id: doc.id,
                    name: doc.data().name,
                    user_id: doc.data().user_id,
                    week: doc.data().week
                }
                setPlans((old: any) => [...old, returnedPlan])
            })
        }
    }

    const getWorkoutPlan = async () => {
        if (!OFFLINE_MODE) {
            const currentPlan = await getCurrentPlan();
            const q = query(collection(firestore, "plans"), where("name", "==", currentPlan), where("user_id", "==", user.id));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                setWorkoutPlanId(doc.id)
                if (doc.data().week) {
                    setWorkoutPlan(doc.data().week)
                }
            })
        } else {
            setWorkoutPlan(MOCK_DATA.programs['my plan'].workouts)
        }

    }

    const updateWorkoutPlan = async (day:string, exercise:any) => {
        if (!OFFLINE_MODE) {
            const docRef = doc(firestore, `plans/${workoutPlanId}`);
            await updateDoc(docRef, {
                week: {
                    ...workoutPlan,
                    [day]: {
                        ...workoutPlan[day],
                        exercises: [
                            ...workoutPlan[day].exercises,
                            exercise
                        ]
                    }
                }
            })
        }
        setWorkoutPlan((old: any) => {
            return {
                ...old,
                [day]: {
                    ...old[day],
                    exercises: [
                        ...old[day].exercises,
                        exercise
                    ]
                }
            }
        })
    }

    const deleteExerciseFromWorkoutPlan = async (day:string, exercise:any) => {
        const newExercises = workoutPlan[day].exercises.filter((ex: any) => ex.name !== exercise.name)
        if (!OFFLINE_MODE) {
            const docRef = doc(firestore, `plans/${workoutPlanId}`);
            await updateDoc(docRef, {
                week: {
                    ...workoutPlan,
                    [day]: {
                        ...workoutPlan[day],
                        exercises: newExercises
                    }
                }
            })
        }
        setWorkoutPlan((old: any) => {
            return {
                ...old,
                [day]: {
                    ...old[day],
                    exercises: newExercises
                }
            }
        })
    }

    const createNewPlan = async (name:string) => {

        const newPlan = {
            name: name,
            user_id: user.id,
            week: {
                "Monday": {
                    exercises: []
                },
                "Tuesday": {
                    exercises: []
                },
                "Wednesday": {
                    exercises: []
                },
                "Thursday": {
                    exercises: []
                },
                "Friday": {
                    exercises: []
                },
                "Saturday": {
                    exercises: []
                },
                "Sunday": {
                    exercises: []
                }
            }
        }
        if (!OFFLINE_MODE) {
            const docRef = await addDoc(collection(firestore, "plans"), newPlan);
            console.log(docRef.id)
        }
        setPlans((old: any) => [...old, newPlan])
    }

    const context: UserCont = {
        user,
        workoutPlan,
        updateUser,
        getWorkoutPlan,
        workoutPlanId,
        updateWorkoutPlan,
        deleteExerciseFromWorkoutPlan,
        createNewPlan,
        plans,
        getAllPlans,
        setCurrentPlan
    }

    return (
        <UserContext.Provider value={context}>
            {props.children}
        </UserContext.Provider>
    );
};

export default UserContext;
