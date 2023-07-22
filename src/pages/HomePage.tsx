import React, {useState} from "react";
import {Block, Button, Text} from 'react-barebones-ts'

import ArrowRight from "../assets/icons/arrow-right-s-line.svg";
import ArrowLeft from "../assets/icons/arrow-left-s-line.svg";

import data from '../assets/data/workouts.json';
import {getDayOfTheWeek, getTomorrow, getYesterday} from "../helpers/date";

import AppWrapper from "../layout/AppWrapper";
import RestModal from "../components/RestModal";
import Exercise from "../components/Exercise";

const HomePage = () => {
    const today = getDayOfTheWeek();
    const program = "my plan"

    const [date, setDate] = useState(today);
    const [exerciseList, setExerciseList] = useState(data.programs[program].workouts[date].exercises)
    const [active, setActive] = useState(exerciseList.length > 0 ? exerciseList[0].name : '')
    const [activeSet, setActiveSet] = useState(0)
    const [done, setDone] = useState<any>([])
    const [restModal, setRestModal] = useState(false)
    const [completed, setCompleted] = useState(false);


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
                setCompleted(true);
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
                <Block justify={'space-between'} style={{"width": "100%"}}>
                    <Button variant={'secondary'} icon={<ArrowLeft/>} action={handleShowPrevDay}/>
                    <Text type={'h1'} text={date}/>
                    <Button variant={'secondary'} icon={<ArrowRight/>} action={handleShowNextDay}/>
                </Block>
                {restModal && <RestModal action={handleShowRestModal}/>}

                <Block column size={700}>
                {exerciseList.length > 0 && exerciseList.map((exercise: any) => {
                    return <Exercise
                        key={exercise.name}
                        exercise={exercise}
                        active={active}
                        activeSet={activeSet}
                        done={done}
                        handleSetButtonAction={handleSetButtonAction}/>
                })}
                </Block>
                {exerciseList.length <= 0 && <Block justify={'center'} style={{"width":"100%"}}>
                    <Text type={'h2'} text={"No exercises found for today"}/>
                </Block>}
            </Block>
        </AppWrapper>
    );
};

export default HomePage;
