import React, {useContext, useState} from 'react'

import {Button, Block, Input, Alert} from 'react-barebones-ts'

import userContext from "../store/user-context";

import Spinner from "./spinner/Spinner";
import PlanContext from "../store/plan-context";

type NewPlan = {
    name: string
}

type PlanFormProps = {
    setShowPlanForm: (show: boolean) => void
}

const PlanForm = ({setShowPlanForm}: PlanFormProps) => {

    const userCtx = useContext(userContext)
    const planCtx   = useContext(PlanContext)

    const [plan, setPlan] = useState<NewPlan>({
        name: ''
    })

    const [alert, setAlert] = useState("Something went wrong")
    const [showAlert, setShowAlert] = useState(false)
    const [errors, setErrors] = useState(false)
    const [loading, setLoading] = useState(false)
    const handleChangeField = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPlan((plan: any) => ({
            ...plan,
            [e.target.name]: e.target.value
        }))
    }

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()

        setLoading(true)

        let foundError = (Object.values(plan).some((v) => v === ""))

        if (foundError) {
            setErrors(true)
            setLoading(false)
            return
        }

        await planCtx.createNewPlan(plan.name);

        setLoading(false)
        setShowPlanForm(false)
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
                        {Object.entries(plan).map(([key, value]) => {
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
                    <Block>
                        <Button
                            action={() => {}}
                            variant='primary'
                            type='submit'
                            icon={loading && <Spinner/>}
                        >
                            Add Plan
                        </Button>
                    </Block>
                </Block>
            </form>
        </Block>
    )
}

export default PlanForm;