import React, {createContext, useContext, useState} from "react";
import {collection, doc, getDoc, getDocs, deleteDoc, getFirestore, query, where, updateDoc, addDoc} from "@firebase/firestore/lite";
import {app} from "../firebase";
import UserContext from "./user-context";
import WorkoutContext from "./workout-context";

type Plan = {
    id: string,
    name: string,
    user_id: string,
    created_at: Date,
    week: object
}

type PlanContext = {
    plans: [],
    currentPlanId: string,
    getCurrentPlan: () => void,
    createNewPlan: (plan: any) => void,
    getAllPlans: () => void,
    setCurrentPlan: (oldCurrentPlan: string, newCurrentPlan:string) => void,
    deletePlan: (id: string) => void,
    resetPlans: () => void,
}

const PlanContext = createContext<PlanContext>(
    {
        plans: [],
        currentPlanId: '',
        getCurrentPlan: () => {},
        createNewPlan: (plan) => {},
        getAllPlans: () => {},
        setCurrentPlan: (oldCurrentPlan, newCurrentPlan) => {},
        deletePlan: (id) => {},
        resetPlans: () => {},
    },
);

export const PlanContextProvider = (props: any) => {

    const workoutCtx = useContext(WorkoutContext);
    const userCtx = useContext(UserContext);

    const firestore = getFirestore(app);

    const [plans, setPlans] = useState<any>([])

    const [currentPlanId, setCurrentPlanId] = useState<string>('')

    const getCurrentPlan = async () => {
        console.log('getting current plan')
        const q = query(collection(firestore, "plans"), where("user_id", "==", userCtx.user.id), where("is_selected", "==", true));
        const querySnapshot = await getDocs(q);
        console.log(querySnapshot)
        if (querySnapshot.empty) {
            setCurrentPlanId(() => '')
            return
        }
        querySnapshot.forEach((doc) => {
            setCurrentPlanId(() => doc.id)
        })
    }

    const setCurrentPlan = async (oldCurrentPlan: string, newCurrentPlan: string) => {
        const docOldCurrRef = doc(firestore, "plans", oldCurrentPlan);
        await updateDoc(docOldCurrRef, {
            is_selected: false
        });
        const docNewCurrRef = doc(firestore, "plans", newCurrentPlan);
        await updateDoc(docNewCurrRef, {
            is_selected: true
        });
        setCurrentPlanId(() => docNewCurrRef.id)
    }

    const getAllPlans = async () => {
        const q = query(collection(firestore, "plans"), where("user_id", "==", userCtx.user.id));
        const querySnapshot = await getDocs(q);
        let newPlans: Plan[] = []
        if (querySnapshot.empty) {
            return;
        } else {
            querySnapshot.forEach((doc) => {
                const returnedPlan: Plan = {
                    id: doc.id,
                    name: doc.data().name,
                    user_id: doc.data().user_id,
                    created_at: doc.data().created_at,
                    week: doc.data().week
                }
                newPlans.push(returnedPlan)
            })
            newPlans.sort((a, b) => a.created_at > b.created_at ? 1 : -1)
            if (plans.length === 0) {
                setPlans(() => newPlans)
            }
        }
    }

    const createNewPlan = async (plan: any) => {
        const newPlan = {
            name: plan.name,
            user_id: plan.user_id,
            created_at: new Date(),
            is_selected: plan.is_selected,
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

        await addDoc(collection(firestore, "plans"), newPlan);
        setPlans((old: any) => [...old, newPlan])
    }

    const updatePlan = async (plan: Plan) => {

    }

    const deletePlan = async (id: string) => {
        await deleteDoc(doc(firestore, "plans", id));
        setPlans((old: any) => old.filter((plan: Plan) => plan.id !== id))
    }

    const resetPlans = () => {
        setPlans([])
    }

    const context: PlanContext = {
        createNewPlan,
        getCurrentPlan,
        plans,
        currentPlanId,
        getAllPlans,
        setCurrentPlan,
        deletePlan,
        resetPlans,
    }

    return (
        <PlanContext.Provider value={context}>
            {props.children}
        </PlanContext.Provider>
    );
};

export default PlanContext;
