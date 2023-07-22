import React, {useEffect, useState} from "react";

import data from '../assets/data/workouts.json';

import AppWrapper from "../layout/AppWrapper";
import {Block, Button, Modal, Text} from 'react-barebones-ts'
import {Simulate} from "react-dom/test-utils";
import pause = Simulate.pause;

const HomePage = () => {
    const [active, setActive] = useState(data.exercises[0].name)
    const [done, setDone] = useState<any>([])
    const [activeSet, setActiveSet] = useState(1)
    const [restModal, setRestModal] = useState(false)
    const [restTimer, setRestTimer] = useState(data.rest)
    const [completed, setCompleted] = useState(false);
    const [pauseTimer, setPauseTimer] = useState(false);
    const handleSetButtonAction = (sets: number, i: number) => {
        setActiveSet(i + 1);
        if ((sets - 1) === i) {
            setActiveSet(1)
            const index = data.exercises.findIndex((exercise: any) => exercise.name === active);
            if (index < data.exercises.length - 1) {
                setActive(() => data.exercises[index + 1].name);
                if(done) {
                    setDone((old: any) => [...old, data.exercises[index].name])
                } else {
                    setDone([data.exercises[index].name])
                }
            } else {
                setCompleted(true);
            }
        }
    }

    const setBuilder = (workout: any) => {
        let setArray = [];
        for (let i = 0; i < workout.sets; i++) {
            setArray.push(<Button key={`${workout.name}${i + 1}`} variant={active === workout.name && activeSet === (i + 1) ? 'primary' : 'secondary'} disabled={done.includes(workout.name) || active === workout.name && activeSet > (i + 1)} action={() => handleSetButtonAction(workout.sets, i)}>{`${i + 1}`}</Button>);
        }
        return setArray;
    }

    const handleShowRestModal = () => {
        setRestTimer(data.rest);
        setRestModal(!restModal);
    }

    useEffect(() => {
        if(restModal && !pauseTimer) {
            let restTimeout: any;
            if (restTimer > 0) {
                restTimeout = setTimeout(() => {
                    setRestTimer((old: any) => old - 1)
                }, 1000)
            } else {
                setRestModal(false)
                setRestTimer(data.rest)
            }
            return () => {
                clearTimeout(restTimeout)
            }
        }
    }, [restTimer, restModal, pauseTimer])

    return (
        <AppWrapper>
            <Block column align={'flex-start'} size={500}>
                <Block justify={'space-between'} style={{"width": "100%"}}>
                    <Text type={'h1'} text={"SATURDAY"}/>
                    <Button variant={'primary'} action={handleShowRestModal}>
                        REST!
                    </Button>
                </Block>
                {restModal && <Modal close={handleShowRestModal} title={"Rest"}>
                    <Block justify={'center'}>
                        <Text text={restTimer} color={'default'} type={'h1'} style={{"fontSize": "80px", "lineHeight": "60px"}}/>
                    </Block>
                    <Block justify={'center'} size={500}>
                        <Button action={() => setRestTimer(data.rest)}>Restart</Button>
                        <Button action={() => setPauseTimer(!pauseTimer)}>{pauseTimer ? 'Resume' : 'Pause'}</Button>
                        <Button action={handleShowRestModal}>Stop</Button>
                    </Block>
                </Modal>}

                {completed && <Text type={'h1'} color={'success'} text={"WORKOUT COMPLETED!"}/>}
                <Block column size={800}>
                {!completed && data.exercises.map((workout: any) => {
                    const returnedSets = setBuilder(workout);
                    return (
                        <Block key={workout.name} column size={300}>
                        <Text type={'h1'} text={workout.name} color={(active === workout.name) ? 'success' : 'disabled'}/>
                            <Block size={300}>
                                <Text type={'p'} text={'Reps: ' + workout.reps}/>
                                <Text type={'p'} text={'Weight: ' + workout.weight}/>
                            </Block>
                           <Block size={200}>
                                {returnedSets.map((set: any) => {
                                    return (
                                        <span key={set.key}>
                                            {set}
                                        </span>
                                    )
                                })}
                            </Block>
                        </Block>
                    )
                })}
                </Block>
            </Block>
        </AppWrapper>
    );
};

export default HomePage;
