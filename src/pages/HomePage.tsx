import React, {useContext, useEffect, useState} from "react";
import {Block, Button, Modal, Text} from 'react-barebones-ts'

import ThemeContext from "../store/theme-context";
import userContext from "../store/user-context";
import PlanContext from "../store/plan-context";

import {getDayOfTheWeek, getTomorrow, getYesterday} from "../helpers/date";

import AppWrapper from "../layout/AppWrapper";
import RestModal from "../components/RestModal";
import Exercise from "../components/Exercise";
import Header from "../components/Header";
import Spinner from "../components/spinner/Spinner";
import ExerciseForm from "../components/ExerciseForm";

const HomePage = () => {

    const userCtx = useContext(userContext);
    const planCtx = useContext(PlanContext);

    const themeCtx = useContext(ThemeContext);

    const today = getDayOfTheWeek();
    const [date, setDate] = useState(today);

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

    const [showExerciseForm, setShowExerciseForm] = useState(false)
    const [loading, setLoading] = useState(true)

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
        if (Object.keys(planCtx.workoutWeek).length > 0 && planCtx.workoutWeek[tomorrow].exercises.length > 0) {
            setExerciseList(planCtx.workoutWeek[tomorrow].exercises)
        } else {
            setExerciseList([])
        }
    }

    const handleShowPrevDay = () => {
        const yesterday = getYesterday(date);
        setDate(yesterday);
        if (Object.keys(planCtx.workoutWeek).length > 0 && planCtx.workoutWeek[yesterday].exercises.length > 0) {
            setExerciseList(planCtx.workoutWeek[yesterday].exercises)
        } else {
            setExerciseList([])
        }
    }

    useEffect(() =>{
        if(userCtx.user.id !== '' && planCtx.currentPlan.id !== '' && Object.keys(planCtx.workoutWeek).length > 0) {
            if (planCtx.workoutWeek[date].exercises.length !== exerciseList.length) {
                setExerciseList(planCtx.workoutWeek[date].exercises)
                setLoading(false)
            } else {
                setLoading(false)
            }
        } else {
            setLoading(false)
        }
        if (active === '' && exerciseList.length > 0) {
            setActive(exerciseList[0].name)
        }
    }, [exerciseList, planCtx.workoutWeek, planCtx.currentPlan, userCtx.user])

    return (
        <AppWrapper>
            <Block column align={'flex-start'} size={900}>
                {showExerciseForm && <Modal
                    dark={themeCtx.dark}
                    title={'Add Exercise'}
                    close={() => setShowExerciseForm(false)}>
                    <ExerciseForm  dark={themeCtx.dark} day={date} setShowExerciseForm={setShowExerciseForm}/>
                </Modal>
                }
                <Text type={'h3'} text={`Program: ${planCtx.currentPlan.name}`}/>
                <Header dark={themeCtx.dark} date={date} handleShowNextDay={handleShowNextDay} handleShowPrevDay={handleShowPrevDay}/>
                {restModal && <RestModal action={handleShowRestModal}/>}
                {completedModal && <Modal dark={themeCtx.dark} title={'Workout completed'}  close={() => setCompletedModal(false)}> Well Done! </Modal>}

                <Block column size={400} classes={'bb-w-100'}>
                {loading && <Spinner />}
                {!loading && exerciseList.length > 0 && exerciseList.map((exercise: any, index) => {
                    return <Exercise
                        index={index}
                        day={date}
                        dark={themeCtx.dark}
                        key={exercise.name}
                        exercise={exercise}
                        active={active}
                        activeSet={activeSet}
                        done={done}
                        handleSetButtonAction={handleSetButtonAction}
                        setExerciseList={setExerciseList}/>
                })}
                    {!loading && exerciseList.length === 0 &&
                        <Block classes={'bb-w-100'}>
                            <Text type={'h2'} text={"No exercises found for today"}/>
                        </Block>
                    }
                    {!showExerciseForm && <Block><Button variant={'primary'} dark={themeCtx.dark} action={() => setShowExerciseForm(true)}>Add Exercise</Button></Block>}
                </Block>

            </Block>
        </AppWrapper>
    );
};

export default HomePage;
