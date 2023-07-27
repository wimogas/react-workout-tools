import React, {createContext, useContext, useEffect, useState} from "react";
import {collection, doc, getDoc, getDocs, getFirestore, query, where, updateDoc, addDoc} from "@firebase/firestore/lite";
import {app} from "../firebase";
import UserContext from "./user-context";
import WorkoutContext from "./workout-context";
import userContext from "./user-context";

const OFFLINE_MODE = false;

type PlanContext = {
    plans: [],
    getCurrentPlan: () => Promise<string>,
    createNewPlan: (name: string) => void,
    getAllPlans: () => void,
    setCurrentPlan: (newCurrentPlan:string) => void
}

const PlanContext = createContext<PlanContext>(
    {
        plans: [],
        getCurrentPlan: () => Promise.resolve(''),
        createNewPlan: (name) => {},
        getAllPlans: () => {},
        setCurrentPlan: (newCurrentPlan) => {}
    },
);

export const PlanContextProvider = (props: any) => {

    const workoutCtx = useContext(WorkoutContext);
    const userCtx = useContext(UserContext);

    const firestore = getFirestore(app);

    const [plans, setPlans] = useState<any>([])


    const getCurrentPlan = async () => {
        const docRef = doc(firestore, `users/${userCtx.user.id}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data().currentPlan
        } else {
            return ''
        }
    }

    const setCurrentPlan = async (newCurrentPlan:string) => {
        if (!OFFLINE_MODE) {
            const docRef = doc(firestore, "users", userCtx.user.id);
            await updateDoc(docRef, {
                currentPlan: newCurrentPlan
            });
        }
        await workoutCtx.getWorkoutPlan()
    }

    const getAllPlans = async () => {
        if (!OFFLINE_MODE) {
            const q = query(collection(firestore, "plans"), where("user_id", "==", userCtx.user.id));
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

    const createNewPlan = async (name:string) => {

        const newPlan = {
            name: name,
            user_id: userCtx.user.id,
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

    const context: PlanContext = {
        createNewPlan,
        getCurrentPlan,
        plans,
        getAllPlans,
        setCurrentPlan
    }

    return (
        <PlanContext.Provider value={context}>
            {props.children}
        </PlanContext.Provider>
    );
};

export default PlanContext;
