import React, {createContext, useContext, useState} from "react";
import {collection, doc, getDoc, getDocs, deleteDoc, getFirestore, query, where, updateDoc, addDoc} from "@firebase/firestore/lite";
import {app} from "../firebase";
import UserContext from "./user-context";

type Plan = {
    id: string,
    name: string,
    user_id: string,
    created_at: Date,
    week: object
}

type PlanContext = {
    plans: Plan[],
    currentPlan: Plan,
    workoutWeek: any,
    getCurrentPlan: () => void,
    createNewPlan: (plan: any) => void,
    getAllPlans: () => void,
    changeCurrentPlan: (oldCurrentPlan: string, newCurrentPlan:string) => void,
    deletePlan: (id: string) => void,
    resetPlans: () => void,
    updateWorkoutWeekFromCurrentPlan: (day:string, exercise:any) => void,
    deleteExerciseFromWorkoutWeek: (day:string, exercise:any) => void,
    resetWorkoutWeek: () => void,
    resetCurrentPlan: () => void
}

const PlanContext = createContext<PlanContext>(
    {
        plans: [],
        currentPlan: {
            id: '',
            name: '',
            user_id: '',
            created_at: new Date(),
            week: {}
        },
        workoutWeek: {},
        getCurrentPlan: () => {},
        createNewPlan: (plan) => {},
        getAllPlans: () => {},
        changeCurrentPlan: (oldCurrentPlan, newCurrentPlan) => {},
        deletePlan: (id) => {},
        resetPlans: () => {},
        updateWorkoutWeekFromCurrentPlan: (day, exercise) => {},
        deleteExerciseFromWorkoutWeek: (day, exercise) => {},
        resetWorkoutWeek: () => {},
        resetCurrentPlan: () => {}
    },
);

export const PlanContextProvider = (props: any) => {

    const userCtx = useContext(UserContext);

    const firestore = getFirestore(app);

    const [plans, setPlans] = useState<any>([])
    const [workoutWeek, setWorkoutWeek] = useState<any>({})

    const [currentPlan, setCurrentPlan] = useState({
        id: '',
        name: '',
        user_id: '',
        created_at: new Date(),
        week: {}
    })

    const getCurrentPlan = async () => {
        const q = query(collection(firestore, "plans"), where("user_id", "==", userCtx.user.id), where("is_selected", "==", true));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            setCurrentPlan(() => {
                return {
                    id: '',
                    name: '',
                    user_id: '',
                    created_at: new Date(),
                    week: {}
                }
            })
            return
        }
        querySnapshot.forEach((doc) => {
            const returnedPlan: Plan = {
                id: doc.id,
                name: doc.data().name,
                user_id: doc.data().user_id,
                created_at: doc.data().created_at,
                week: doc.data().week
            }
            setCurrentPlan(() => returnedPlan)
            setWorkoutWeek(() => returnedPlan.week)
        })
    }

    const changeCurrentPlan = async (oldCurrentPlan: string, newCurrentPlan: string) => {
        const docOldCurrRef = doc(firestore, "plans", oldCurrentPlan);
        await updateDoc(docOldCurrRef, {
            is_selected: false
        });
        const docNewCurrRef = doc(firestore, "plans", newCurrentPlan);
        await updateDoc(docNewCurrRef, {
            is_selected: true
        });
        const docSnap = await getDoc(docNewCurrRef);
        const data = await docSnap.data();
        if (data) {
            const newPlan: Plan = {
                id: docSnap.id,
                name: data.name,
                user_id: data.user_id,
                created_at: data.created_at,
                week: data.week
            }
            setCurrentPlan(() => newPlan)
            setWorkoutWeek(() => newPlan.week)
        }

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
            id: '',
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

        const docRef = await addDoc(collection(firestore, "plans"), newPlan);
        newPlan['id'] = docRef.id;
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

    const updateWorkoutWeekFromCurrentPlan = async (day:string, exercise:any) => {
        const docRef = doc(firestore, `plans/${currentPlan.id}`);
        await updateDoc(docRef, {
            week: {
                ...workoutWeek,
                [day]: {
                    ...workoutWeek[day],
                    exercises: [
                        ...workoutWeek[day].exercises,
                        exercise
                    ]
                }
            }
        })
        setWorkoutWeek((old: any) => {
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

    const deleteExerciseFromWorkoutWeek = async (day:string, exercise:any) => {
        const newExercises = workoutWeek[day].exercises.filter((ex: any) => ex.name !== exercise.name)
        const docRef = doc(firestore, `plans/${currentPlan.id}`);
        await updateDoc(docRef, {
            week: {
                ...workoutWeek,
                [day]: {
                    ...workoutWeek[day],
                    exercises: newExercises
                }
            }
        })
        setWorkoutWeek((old: any) => {
            return {
                ...old,
                [day]: {
                    ...old[day],
                    exercises: newExercises
                }
            }
        })
    }

    const resetWorkoutWeek = () => {
        setWorkoutWeek({})
    }

    const resetCurrentPlan = () => {
        setCurrentPlan({
            id: '',
            name: '',
            user_id: '',
            created_at: new Date(),
            week: {}
        },)
    }

    const context: PlanContext = {
        createNewPlan,
        getCurrentPlan,
        plans,
        currentPlan,
        workoutWeek,
        getAllPlans,
        changeCurrentPlan,
        deletePlan,
        resetPlans,
        updateWorkoutWeekFromCurrentPlan,
        deleteExerciseFromWorkoutWeek,
        resetWorkoutWeek,
        resetCurrentPlan
    }

    return (
        <PlanContext.Provider value={context}>
            {props.children}
        </PlanContext.Provider>
    );
};

export default PlanContext;
