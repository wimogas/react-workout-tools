import React, {useContext, useState} from 'react'

import {Button, Block, Input, Alert} from 'react-barebones-ts'

import Spinner from "./spinner/Spinner";
import PlanContext from "../store/plan-context";

type updatedPlan = {
    name: string,
}

type EditModalProps = {
    id: string,
    name: string,
    setPlans: any,
    setShowEditModal: any,
}

const EditPlanForm = ({ id, name, setPlans, setShowEditModal }: EditModalProps) => {

    const planCtx = useContext(PlanContext);

    const [updatedPlan, setUpdatedPlan] = useState<updatedPlan>({
        name,
    })

    const [alert, setAlert] = useState("Something went wrong")
    const [showAlert, setShowAlert] = useState(false)
    const [errors, setErrors] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleChangeField = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUpdatedPlan(() => ({
            name: e.target.value
        }))
    }

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()

        setLoading(true)

        let foundError = (Object.values(updatedPlan).some((v) => v === ""))

        if (foundError) {
            setErrors(true)
            setLoading(false)
            return
        }

        const newUpdatedPlan = {
            id,
            name: updatedPlan.name,
        }

        await planCtx.updatePlan(newUpdatedPlan);
        setPlans([])
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
                        {Object.entries(updatedPlan).map(([key, value]) => {
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
                            Update Plan
                        </Button>
                    </Block>
                </Block>
            </form>
        </Block>
    )
}

export default EditPlanForm;