import React, {useContext, useEffect, useState} from "react";
import {Block, Button, Text} from "react-barebones-ts";

import PlanContext from "../store/plan-context";

import EditIcon from "../assets/icons/pencil-line.svg";
import DeleteIcon from "../assets/icons/delete-bin-line.svg";

import ConfirmDelete from "./ConfirmDelete";
import userContext from "../store/user-context";

type PlanProps = {
    dark: boolean,
    plan: any,
    workoutPlanId: string,
}
const Plan = ({plan, dark  }: PlanProps) => {

    const planCtx = useContext(PlanContext)

    const [isSelected, setIsSelected] = useState(false)

    const [showDeleteModal, setShowDeleteModal] = useState(false)

    const handleEditName = () => {

    }

    const handleConfirmDelete = (id: string) => {
        planCtx.deletePlan(id)
        setShowDeleteModal(false)
    }

    const handleSelectPlan = (plan: any) => {
        planCtx.changeCurrentPlan(planCtx.currentPlan.id, plan.id)
    }

    useEffect(() => {
        if (planCtx.currentPlan.id === plan.id) {
            setIsSelected(true)
        } else {
            setIsSelected(false)
        }
    }   , [planCtx.currentPlan])

    return (
        <Block classes={'bb-w-100'} stretch >
            {showDeleteModal && <ConfirmDelete
                name={plan.name}
                setShowDeleteModal={setShowDeleteModal}
                dark={dark}
                handleConfirmDelete={() => handleConfirmDelete(plan.id)}
            />}
            <Block
                variant={'card'}
                dark={dark}
                classes={'bb-p-400'}
                column
                size={400}>
                <Block justify={'space-between'} classes={'bb-w-100'}>
                    <Block size={200}>
                        <Text type={'h3'} text={plan.name}/>
                        <Button variant={'icon-only'} icon={<EditIcon/>} iconSize={24} dark={dark} action={handleEditName}/>
                    </Block>
                    {!isSelected && <Button variant={'icon-only'} icon={<DeleteIcon/>} iconSize={24} dark={dark} action={() => setShowDeleteModal(true)}/>}
                </Block>

                <Block>
                    <Button variant={'secondary'} dark={dark} disabled={isSelected} action={() => handleSelectPlan(plan)}>{isSelected ? 'Selected' : 'Select Plan'}</Button>
                </Block>
            </Block>
        </Block>
    )
}

export default Plan;