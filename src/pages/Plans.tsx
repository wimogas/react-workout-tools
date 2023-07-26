import React, {useContext, useEffect, useState} from "react";

import {Block, Button, Grid, Modal, Text} from 'react-barebones-ts'

import AddFill from "../assets/icons/add-fill.svg";

import AppWrapper from "../layout/AppWrapper";

import PlanForm from "../components/PlanForm";
import userContext from "../store/user-context";

import {ThemeContext} from "../store/theme-context";

const Plans = () => {

    const [showPlanForm, setShowPlanForm] = useState(false)

    const userCtx = useContext(userContext)

    const themeCtx = useContext(ThemeContext);

    const [plans, setPlans] = useState<any>([])

    useEffect(() => {
        if(userCtx.plans.length === 0 && userCtx.user.id !== '') {
            userCtx.getAllPlans()
        }
        if (plans.length !== userCtx.plans.length > 0) {
            setPlans(() => userCtx.plans)
        }
    }, [plans, userCtx.plans, userCtx.user])

    const handleSelectPlan = (name:string) => {
        userCtx.setCurrentPlan(name)
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
                            dark
                            classes={'bb-p-400'}
                            column
                            size={400}>
                            {plan.name}
                            <Block>
                                <Button variant={'secondary'} disabled={ userCtx.workoutPlanId === plan.id } action={() => handleSelectPlan(plan.name)}>{userCtx.workoutPlanId === plan.id ? 'Selected' : 'Select Plan'}</Button>
                            </Block>
                        </Block>
                    })}
                </Grid>
            </Block>
        </AppWrapper>
    );
};

export default Plans;
