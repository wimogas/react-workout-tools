import React, {useContext, useState} from "react";
import {Block, Button, Icon, Modal, Text} from "react-barebones-ts";

import PlanContext from "../store/plan-context";

import EditIcon from "../assets/icons/pencil-line.svg";
import DeleteIcon from "../assets/icons/delete-bin-line.svg";
import CheckLine from "../assets/icons/check-line.svg";

import ConfirmDelete from "./ConfirmDelete";
import EditForm from "./EditForm";

type ExerciseProps = {
    index: number,
    day: string,
    dark: boolean,
    exercise: any,
    done: any,
    active: string,
    activeSet: number,
    handleSetButtonAction: (sets: number, i: number) => void,
    setExerciseList: any
}

const Exercise = ({index, day, dark, exercise, done, active, activeSet, handleSetButtonAction, setExerciseList}: ExerciseProps) => {

    const planCtx = useContext(PlanContext);

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [showEditModal, setShowEditModal] = useState(false);

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

    const handleConfirmDelete = (exercise: string) => {
        planCtx.deleteExercise(day, exercise)
        setShowDeleteModal(false)
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
            {showDeleteModal && <ConfirmDelete
                name={exercise.name}
                setShowDeleteModal={setShowDeleteModal}
                dark={dark}
                handleConfirmDelete={() => handleConfirmDelete(exercise)}
            />}
            {showEditModal && <Modal
                dark={dark}
                title={'Update Exercise'}
                close={() => setShowEditModal(false)}>
                    <EditForm
                        index={index}
                        day={day}
                        exercise={exercise}
                        setShowEditModal={setShowEditModal}
                        setExerciseList={setExerciseList}
                    />
            </Modal> }
            <Block size={400} align={'center'} justify={'space-between'} classes={'bb-w-100'}>
                <Block size={200}>
                    <Text type={'h1'} dark={dark} text={exercise.name} color={(active === exercise.name) ? 'primary' : done.includes(exercise.name) ? 'success' : 'disabled'}/>
                    {done.includes(exercise.name) && <Icon icon={<CheckLine/>} size={20} color={'#189949'}/>}
                </Block>
                <Block size={300}>
                    <Button variant={'icon-only'} icon={<EditIcon/>} dark={dark} iconSize={24} action={() => setShowEditModal(true)}/>
                    <Button variant={'icon-only'} icon={<DeleteIcon/>} dark={dark} iconSize={24} action={() => setShowDeleteModal(true)}/>
                </Block>

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