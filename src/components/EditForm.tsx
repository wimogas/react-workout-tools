import React, {useContext, useState} from 'react'

import {Button, Block, Input, Alert} from 'react-barebones-ts'

import Spinner from "./spinner/Spinner";
import PlanContext from "../store/plan-context";

type updatedExercise = {
    name: string,
    sets: string,
    reps: string,
    weight: string
}

type EditModalProps = {
    index: number,
    day: string,
    exercise: {
        name: string,
        sets: number,
        reps: number,
        weight: number
    },
    setShowEditModal: (show: boolean) => void,
    setExerciseList: any
}

const EditForm = ({ index, day, exercise, setShowEditModal, setExerciseList }: EditModalProps) => {

    const planCtx = useContext(PlanContext);

    const [updatedExercise, setUpdatedExercise] = useState<updatedExercise>({
        name: exercise.name,
        sets: exercise.sets.toString(),
        reps: exercise.reps.toString(),
        weight: exercise.weight.toString()
    })

    const [alert, setAlert] = useState("Something went wrong")
    const [showAlert, setShowAlert] = useState(false)
    const [errors, setErrors] = useState(false)
    const [loading, setLoading] = useState(false)
    const handleChangeField = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUpdatedExercise((user: any) => ({
            ...user,
            [e.target.name]: e.target.value
        }))
    }

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()

        setLoading(true)

        let foundError = (Object.values(exercise).some((v) => v === ""))

        if (foundError) {
            setErrors(true)
            setLoading(false)
            return
        }

        const newUpdatedExercise = {
            name: updatedExercise.name,
            sets: parseInt(updatedExercise.sets),
            reps: parseInt(updatedExercise.reps),
            weight: parseInt(updatedExercise.weight)
        }

        await planCtx.editExercise(day, index, newUpdatedExercise);
        setExerciseList([])
        setLoading(false)
        setShowEditModal(false)
    }


    return (
        <Block>
            {showAlert && <Block stretch classes={'bb-pb-500'}>
                <Alert
                    variant='error'
                    message={alert}
                /></Block>}
            <form style={{"width": "100%"}} onSubmit={(e: React.SyntheticEvent<HTMLFormElement>) => handleSubmit(e)}>
                <Block column size={400}>
                    <Block column size={400}>
                        {Object.entries(updatedExercise).map(([key, value]) => {
                            return (
                                <Input
                                    label={key}
                                    key={key}
                                    name={key}
                                    value={value}
                                    error={errors && value === ""}
                                    type={'text'}
                                    onChange={handleChangeField}
                                />
                            )
                        })}
                    </Block>
                    <Block justify={'flex-end'} size={400}>
                        <Button
                            variant='tertiary'
                            dark
                            action={() => setShowEditModal(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            action={() => {}}
                            variant='primary'
                            type='submit'
                            icon={loading && <Spinner/>}
                            dark
                        >
                            Update Exercise
                        </Button>
                    </Block>
                </Block>
            </form>
        </Block>
    )
}

export default EditForm;