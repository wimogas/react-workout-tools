import React, {useContext, useEffect, useState} from "react";
import {Block, Button, Modal, Text} from 'react-barebones-ts'

import {app} from "../firebase";
import {getFirestore, getDoc, doc, query, where, getDocs, collection} from '@firebase/firestore/lite';

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

    const today = "Monday";
    const program = "my plan"
    const [date, setDate] = useState(today);

    const MOCK_DATA = data.programs[program].workouts[date].exercises;

    type ExerciseList = {
        name: string,
        sets: number,
        reps: number,
        weight: number
    }

    const [exerciseList, setExerciseList] = useState<ExerciseList[]>([])
    const [active, setActive] = useState('')
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
        if (userCtx.workoutPlan[tomorrow].exercises.length > 0) {
            setExerciseList(userCtx.workoutPlan[tomorrow].exercises)
        } else {
            setExerciseList([])
        }
    }

    const handleShowPrevDay = () => {
        const yesterday = getYesterday(date);
        setDate(yesterday);
        if (userCtx.workoutPlan[yesterday].exercises.length > 0) {
            setExerciseList(userCtx.workoutPlan[yesterday].exercises)
        } else {
            setExerciseList([])
        }
    }

    useEffect(() =>{
        if(userCtx.user.id !== '' && Object.keys(userCtx.workoutPlan).length > 0 && exerciseList.length === 0) {
            setExerciseList(userCtx.workoutPlan[date].exercises)
        }
        if (active === '' && exerciseList.length > 0) {
            setActive(exerciseList[0].name)
        }
    }, [exerciseList, userCtx.workoutPlan, userCtx.user])

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
