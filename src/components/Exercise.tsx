import React, {useContext, useState} from "react";
import {Block, Button, Grid, Icon, Modal, Text} from "react-barebones-ts";

import DeleteIcon from "../assets/icons/delete-bin-line.svg";
import CheckLine from "../assets/icons/check-line.svg";

import userContext from "../store/user-context";

type ExerciseProps = {
    day: string,
    dark: boolean,
    exercise: any,
    done: any,
    active: string,
    activeSet: number,
    handleSetButtonAction: (sets: number, i: number) => void
}

const Exercise = ({day, dark, exercise, done, active, activeSet, handleSetButtonAction}: ExerciseProps) => {

    const userCtx = useContext(userContext);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const setBuilder = (exercise: any) => {
        let setArray = [];
        for (let i = 0; i < exercise.sets; i++) {
            setArray.push(
                <Button dark={dark} key={i}
                        variant={active === exercise.name && activeSet === i ? 'primary' : 'tertiary'}
                        disabled={done.includes(exercise.name) || active === exercise.name && activeSet > i || active !== exercise.name}
                        action={() => handleSetButtonAction(exercise.sets, i)}
                        classes={'bb-justify-center'}
                        style={{"minWidth": "50px"}}>
                    {`${i + 1}`}
                </Button>);
        }
        return setArray;
    }

    const returnedSets = setBuilder(exercise);

    const handleDeleteExercise = () => {
        setShowDeleteModal(true)
    }

    return (
        <Block
            key={exercise.name}
            column
            size={300}
            variant={'card'}
            dark={dark}
            classes={'bb-p-400'}
            >
            {showDeleteModal &&
                <Modal
                    dark={dark}
                    close={() => setShowDeleteModal(false)}
                    title={'Delete Exercise'}>
                    <Text
                        type={'p'}
                        text={'Are you sure you want to delete this exercise?'}/>
                    <Block
                        align={'center'}
                        size={400}
                        justify={'flex-end'}
                        classes={'bb-mt-400'}>
                        <Button variant={'tertiary'} dark action={() => setShowDeleteModal(false)}>Cancel</Button>
                        <Button variant={'danger'} dark action={() => {
                            userCtx.deleteExerciseFromWorkoutPlan(day, exercise)
                            setShowDeleteModal(false)
                        }}>Delete</Button>
                    </Block>
                </Modal>
            }
            <Block size={400} align={'center'} justify={'space-between'} classes={'bb-w-100'}>
                <Block size={200}>
                    <Text type={'h1'} dark={dark} text={exercise.name} color={(active === exercise.name) ? 'primary' : done.includes(exercise.name) ? 'success' : 'disabled'}/>
                    {done.includes(exercise.name) && <Icon icon={<CheckLine/>} size={20} color={'#189949'}/>}
                </Block>
                <Button variant={'icon-only'} icon={<DeleteIcon/>} dark={dark} iconSize={24} action={handleDeleteExercise}/>
            </Block>
            <Block size={300}>
                <Text color={(active === exercise.name) ? 'secondary' : 'disabled'} dark={dark} type={'p'} text={'Reps: ' + exercise.reps}/>
                <Text color={(active === exercise.name) ? 'secondary' : 'disabled'} dark={dark} type={'p'} text={'Weight: ' + exercise.weight}/>
            </Block>
            <Block size={200} classes={'bb-wrap'}>
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
}

export default Exercise;