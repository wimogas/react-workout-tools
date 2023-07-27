import React, {createContext, useContext, useEffect, useState} from "react";
import {collection, doc, getDoc, getDocs, getFirestore, query, where, updateDoc, addDoc} from "@firebase/firestore/lite";
import {app} from "../firebase";

import data from '../assets/data/workouts.json';
import UserContext from "./user-context";
import PlanContext from "./plan-context";

const OFFLINE_MODE = false;
const MOCK_DATA = data;

type WorkoutContext = {
    workoutPlan: any,
    getWorkoutPlan: any,
    workoutPlanId: string,
    updateWorkoutPlan: (day: string, exercise: any) => void,
    deleteExerciseFromWorkoutPlan: (day: string, exercise: any) => void,
}

const WorkoutContext = createContext<WorkoutContext>(
    {
        workoutPlan: {},
        workoutPlanId: '',
        getWorkoutPlan: () => {},
        updateWorkoutPlan: (day, exercise) => {},
        deleteExerciseFromWorkoutPlan: (day, exercise) => {},
    },
);

export const WorkoutContextProvider = (props: any) => {

    const planCtx = useContext(PlanContext);
    const userCtx = useContext(UserContext);

    const firestore = getFirestore(app);

    const [workoutPlanId, setWorkoutPlanId] = useState<string>('')

    const [workoutPlan, setWorkoutPlan] = useState<any>({})


    const getWorkoutPlan = async () => {
        if (!OFFLINE_MODE) {
            const currentPlan = await planCtx.getCurrentPlan();
            const q = query(collection(firestore, "plans"), where("name", "==", currentPlan), where("user_id", "==", userCtx.user.id));
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

    const context: WorkoutContext = {
        workoutPlan,
        getWorkoutPlan,
        workoutPlanId,
        updateWorkoutPlan,
        deleteExerciseFromWorkoutPlan
    }

    return (
        <WorkoutContext.Provider value={context}>
            {props.children}
        </WorkoutContext.Provider>
    );
};

export default WorkoutContext;
