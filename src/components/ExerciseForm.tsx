import React, {useContext, useState} from 'react'

import {Button, Block, Input, Alert, Grid} from 'react-barebones-ts'

import userContext from "../store/user-context";

import Spinner from "./spinner/Spinner";

type NewExercise = {
    name: string,
    sets: string,
    reps: string,
    weight: string
}

type ExerciseFormProps = {
    day: string,
    setShowExerciseForm: (show: boolean) => void,
    dark: boolean
}

const ExerciseForm = ({ day, dark, setShowExerciseForm }: ExerciseFormProps) => {

    const userCtx = useContext(userContext)

    const [exercise, setExercise] = useState<NewExercise>({
        name: '',
        sets: '',
        reps: '',
        weight: ''
    })

    const [alert, setAlert] = useState("Something went wrong")
    const [showAlert, setShowAlert] = useState(false)
    const [errors, setErrors] = useState(false)
    const [loading, setLoading] = useState(false)
    const handleChangeField = (e: React.ChangeEvent<HTMLInputElement>) => {
        setExercise((user: any) => ({
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

        const newExercise = {
            name: exercise.name,
            sets: parseInt(exercise.sets),
            reps: parseInt(exercise.reps),
            weight: parseInt(exercise.weight)
        }

        await userCtx.updateWorkoutPlan(day, newExercise);
        setLoading(false)
        setShowExerciseForm(false)
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
                        {Object.entries(exercise).map(([key, value]) => {
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
                            action={() => setShowExerciseForm(false)}
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
                            Add Exercise
                        </Button>
                    </Block>
                </Block>
            </form>
        </Block>
    )
}

export default ExerciseForm;