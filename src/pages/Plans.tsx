import React, {useContext, useEffect, useState} from "react";

import {Block, Button, Grid, Modal, Text} from 'react-barebones-ts'

import userContext from "../store/user-context";
import ThemeContext from "../store/theme-context";
import PlanContext from "../store/plan-context";
import WorkoutContext from "../store/workout-context";

import AddFill from "../assets/icons/add-fill.svg";

import AppWrapper from "../layout/AppWrapper";
import PlanForm from "../components/PlanForm";

const Plans = () => {

    const [showPlanForm, setShowPlanForm] = useState(false)

    const userCtx = useContext(userContext)
    const planCtx = useContext(PlanContext)
    const workoutCtx = useContext(WorkoutContext)

    const themeCtx = useContext(ThemeContext);

    const [plans, setPlans] = useState<any>([])

    useEffect(() => {
        if(planCtx.plans.length === 0 && userCtx.user.id !== '') {
            planCtx.getAllPlans()
        }
        if (plans.length !== planCtx.plans.length) {
            setPlans(() => planCtx.plans)
        }
    }, [plans, planCtx.plans, userCtx.user])

    const handleSelectPlan = (name:string) => {
        planCtx.setCurrentPlan(name)
    }

    return (
        <AppWrapper>
            <Block column size={500}>
                {showPlanForm && <Modal
                    dark={themeCtx.dark}
                    title={'Create New Plan'}
                    close={() => setShowPlanForm(false)}>
                    <PlanForm setShowPlanForm={setShowPlanForm}/>
                </Modal>}
                <Block align={'center'} justify={'space-between'} style={{"width": "100%"}}>
                    <Text type={'h1'} text={'Plans'}/>
                    <Button variant={'primary'} dark={themeCtx.dark} icon={<AddFill/>} iconSize={24} action={() => setShowPlanForm(true)}/>
                </Block>

                <Grid>
                    {plans.length > 0 && plans.map((plan: any) => {
                        return <Block
                            key={plan.name}
                            variant={'card'}
                            dark={themeCtx.dark}
                            classes={'bb-p-400'}
                            column
                            size={400}>
                            {plan.name}
                            <Block>
                                <Button variant={'secondary'} dark={themeCtx.dark} disabled={ workoutCtx.workoutPlanId === plan.id } action={() => handleSelectPlan(plan.name)}>{workoutCtx.workoutPlanId === plan.id ? 'Selected' : 'Select Plan'}</Button>
                            </Block>
                        </Block>
                    })}
                </Grid>
            </Block>
        </AppWrapper>
    );
};

export default Plans;
