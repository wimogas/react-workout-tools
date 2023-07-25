import React, {useContext, useEffect, useState} from "react";
import {Block, Button, Modal, Text} from 'react-barebones-ts'
import {app} from "../firebase";

import {
    getFirestore, getDoc, doc,
    query, where, getDocs, collection
} from '@firebase/firestore/lite';

import {ThemeContext} from "../store/theme-context";
import userContext from "../store/user-context";

import data from '../assets/data/workouts.json';
import {getDayOfTheWeek, getTomorrow, getYesterday} from "../helpers/date";

import AppWrapper from "../layout/AppWrapper";
import RestModal from "../components/RestModal";
import Exercise from "../components/Exercise";
import Header from "../components/Header";

import Spinner from "../components/spinner/Spinner";


const HomePage = () => {

    const userCtx = useContext(userContext);

    const themeCtx = useContext(ThemeContext);

    const today = getDayOfTheWeek();
    const program = "my plan"
    const [date, setDate] = useState(today);

    const MOCK_DATA = data.programs[program].workouts[date].exercises;

    const [exerciseList, setExerciseList] = useState(MOCK_DATA)
    const [active, setActive] = useState(exerciseList.length > 0 ? exerciseList[0].name : '')
    const [activeSet, setActiveSet] = useState(0)
    const [done, setDone] = useState<any>([])
    const [restModal, setRestModal] = useState(false)
    const [completedModal, setCompletedModal] = useState(false)

    const [loading, setLoading] = useState(false)

    const handleSetButtonAction = (sets: number, i: number) => {
        setRestModal(true);
        setActiveSet(i + 1);
        if ((sets - 1) === i && exerciseList.length > 0) {
            setActiveSet(0)
            const index = exerciseList.findIndex((exercise: any) => exercise.name === active);
            if (index < exerciseList.length - 1) {
                setActive(() => exerciseList[index + 1].name);
                if (done) {
                    setDone((old: any) => [...old, exerciseList[index].name])
                } else {
                    setDone([exerciseList[index].name])
                }
            } else {
                setRestModal(false)
                setActive('');
                setDone([]);
                setCompletedModal(true);
            }
        }
    }

    const handleShowRestModal = () => {
        setRestModal(!restModal);
    }

    const handleShowNextDay = () => {
        const tomorrow = getTomorrow(date);
        setDate(tomorrow);
        if (data.programs[program].workouts[tomorrow].exercises.length > 0) {
            setExerciseList(data.programs[program].workouts[tomorrow].exercises)
        } else {
            setExerciseList([])
        }
    }

    const handleShowPrevDay = () => {
        const yesterday = getYesterday(date);
        setDate(yesterday);
        if (data.programs[program].workouts[yesterday].exercises.length > 0) {
            setExerciseList(data.programs[program].workouts[yesterday].exercises)
        } else {
            setExerciseList([])
        }
    }

    const handleGetWorkoutPlan = async () => {
        const firestore = getFirestore(app);
        let currentPlan = '';
        const docRef = doc(firestore, `users/${userCtx.user.id}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
           currentPlan = docSnap.data().currentPlan
        }
        const q = query(collection(firestore, "plans"), where("name", "==", currentPlan), where("user_id", "==", userCtx.user.id));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            setExerciseList(doc.data().week[today].exercises);
            setLoading(false);
        });
    }

    return (
        <AppWrapper>
            <Block column align={'flex-start'} size={900}>
                {userCtx && userCtx.user.name !== '' ? <Text type={'h3'} color={'secondary'} dark={themeCtx.dark} text={`Hello, ${userCtx.user.name}`}/> : ''}
                <Header dark={themeCtx.dark} date={date} handleShowNextDay={handleShowNextDay} handleShowPrevDay={handleShowPrevDay}/>
                {restModal && <RestModal action={handleShowRestModal}/>}
                {completedModal && <Modal dark={themeCtx.dark} title={'Workout completed'}  close={() => setCompletedModal(false)}> Well Done! </Modal>}

                <Block column size={700}>
                {loading && <Spinner />}
                {!loading && exerciseList.length > 0 && exerciseList.map((exercise: any) => {
                    return <Exercise
                        dark={themeCtx.dark}
                        key={exercise.name}
                        exercise={exercise}
                        active={active}
                        activeSet={activeSet}
                        done={done}
                        handleSetButtonAction={handleSetButtonAction}/>
                })}
                </Block>
                {exerciseList.length <= 0 &&
                    <Block justify={'center'} classes={'bb-w-100'}>
                        <Text type={'h2'} text={"No exercises found for today"}/>
                </Block>}
            </Block>
        </AppWrapper>
    );
};

export default HomePage;
