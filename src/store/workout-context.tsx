import React, {createContext, useContext, useState} from "react";
import {collection, doc, getDocs, getFirestore, query, where, updateDoc, addDoc} from "@firebase/firestore/lite";
import {app} from "../firebase";

import UserContext from "./user-context";
import PlanContext from "./plan-context";

type WorkoutContext = {
    workoutPlan: any,
    getWorkoutPlan: any,
    updateWorkoutPlan: (day: string, exercise: any) => void,
    deleteExerciseFromWorkoutPlan: (day: string, exercise: any) => void,
    resetWorkoutPlan: () => void,
}

const WorkoutContext = createContext<WorkoutContext>(
    {
        workoutPlan: {},
        getWorkoutPlan: () => {},
        updateWorkoutPlan: (day, exercise) => {},
        deleteExerciseFromWorkoutPlan: (day, exercise) => {},
        resetWorkoutPlan: () => {},
    },
);

export const WorkoutContextProvider = (props: any) => {

    const planCtx = useContext(PlanContext);
    const userCtx = useContext(UserContext);

    const firestore = getFirestore(app);

    const [workoutPlanId, setWorkoutPlanId] = useState<string>('')

    const [workoutPlan, setWorkoutPlan] = useState<any>({})

    const getWorkoutPlan = async () => {
        if (userCtx.user.id !== '') {
            const q = await query(collection(firestore, "plans"), where("is_selected", "==", true), where("user_id", "==", userCtx.user.id));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                if (doc.data().week) {
                    setWorkoutPlan(doc.data().week)
                }
            })
        } else {
            setWorkoutPlan({})
        }
    }

    const updateWorkoutPlan = async (day:string, exercise:any) => {
        const docRef = doc(firestore, `plans/${planCtx.currentPlanId}`);
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
        const docRef = doc(firestore, `plans/${planCtx.currentPlanId}`);
        await updateDoc(docRef, {
            week: {
                ...workoutPlan,
                [day]: {
                    ...workoutPlan[day],
                    exercises: newExercises
                }
            }
        })
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

    const resetWorkoutPlan = () => {
        setWorkoutPlan({})
    }

    const context: WorkoutContext = {
        workoutPlan,
        getWorkoutPlan,
        updateWorkoutPlan,
        deleteExerciseFromWorkoutPlan,
        resetWorkoutPlan
    }

    return (
        <WorkoutContext.Provider value={context}>
            {props.children}
        </WorkoutContext.Provider>
    );
};

export default WorkoutContext;
