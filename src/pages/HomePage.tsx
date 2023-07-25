import React, {useContext, useEffect, useState} from "react";
import {Block, Button, Modal, Text} from 'react-barebones-ts'

import {ThemeContext} from "../store/theme-context";

import data from '../assets/data/workouts.json';
import {getDayOfTheWeek, getTomorrow, getYesterday} from "../helpers/date";

import AppWrapper from "../layout/AppWrapper";
import RestModal from "../components/RestModal";
import Exercise from "../components/Exercise";
import Header from "../components/Header";

import userContext from "../store/user-context";

const HomePage = () => {

    const userCtx = useContext(userContext);

    const themeCtx = useContext(ThemeContext);

    const today = getDayOfTheWeek();
    const program = "my plan"

    const [date, setDate] = useState(today);
    const [exerciseList, setExerciseList] = useState(data.programs[program].workouts[date].exercises)
    const [active, setActive] = useState(exerciseList.length > 0 ? exerciseList[0].name : '')
    const [activeSet, setActiveSet] = useState(0)
    const [done, setDone] = useState<any>([])
    const [restModal, setRestModal] = useState(false)
    const [completedModal, setCompletedModal] = useState(false)

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

    return (
        <AppWrapper>
            <Block column align={'flex-start'} size={900}>
                {userCtx && userCtx.user.name !== '' ? <Text type={'h3'} color={'secondary'} dark={themeCtx.dark} text={`Hello, ${userCtx.user.name}`}/> : ''}
                <Header dark={themeCtx.dark} date={date} handleShowNextDay={handleShowNextDay} handleShowPrevDay={handleShowPrevDay}/>
                {restModal && <RestModal action={handleShowRestModal}/>}
                {completedModal && <Modal dark={themeCtx.dark} title={'Workout completed'}  close={() => setCompletedModal(false)}> Well Done! </Modal>}

                <Block column size={700}>
                {exerciseList.length > 0 && exerciseList.map((exercise: any) => {
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
