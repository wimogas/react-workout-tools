import React, {useContext, useEffect, useState} from "react";

import {Block, Button, Grid, Modal, Text} from 'react-barebones-ts'

import userContext from "../store/user-context";
import ThemeContext from "../store/theme-context";
import PlanContext from "../store/plan-context";

import AddFill from "../assets/icons/add-fill.svg";

import AppWrapper from "../layout/AppWrapper";
import PlanForm from "../components/PlanForm";
import Plan from "../components/Plan";
import Spinner from "../components/spinner/Spinner";

const Plans = () => {

    const [showPlanForm, setShowPlanForm] = useState(false)

    const userCtx = useContext(userContext)
    const planCtx = useContext(PlanContext)

    const themeCtx = useContext(ThemeContext);

    const [plans, setPlans] = useState<any>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if(planCtx.plans.length === 0 && userCtx.user.id !== '') {
            planCtx.getAllPlans()
            setLoading(false)
        }
        if (plans.length === 0 || plans.length !== planCtx.plans.length) {
            setPlans(() => planCtx.plans)
            setLoading(false)
        }
        console.log(plans)
    }, [plans, planCtx.plans, userCtx.user])

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
                    {loading && <Spinner/>}
                    {!loading && plans.length > 0 && plans.map((plan: any) => {
                        return <Plan
                            key={plan.id}
                            plan={plan}
                            dark={themeCtx.dark}
                            workoutPlanId={''}
                            />
                    })}
                </Grid>
            </Block>
        </AppWrapper>
    );
};

export default Plans;
