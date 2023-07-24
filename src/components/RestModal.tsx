import React, {useContext, useEffect, useState} from 'react';
import {Block, Button, Modal, Text} from "react-barebones-ts";

import data from "../assets/data/workouts.json";

import {ThemeContext} from "../store/theme-context";

import ResetIcon from "../assets/icons/refresh-line.svg";
import PlayIcon from "../assets/icons/play-line.svg";
import PauseIcon from "../assets/icons/pause-fill.svg";
import StopIcon from "../assets/icons/stop-line.svg";

type RestModalProps = {
    action: () => void
}
const RestModal = ({action}: RestModalProps) => {

    const themeCtx = useContext(ThemeContext);
    const [restTimer, setRestTimer] = useState(data.rest)
    const [pauseTimer, setPauseTimer] = useState(false);

    useEffect(() => {
        if(!pauseTimer) {
            let restTimeout: any;
            if (restTimer > 0) {
                restTimeout = setTimeout(() => {
                    setRestTimer((old: any) => old - 1)
                }, 1000)
            } else {
                action()
                setRestTimer(data.rest)
            }
            return () => {
                clearTimeout(restTimeout)
            }
        }
    }, [restTimer, pauseTimer])
    return (
        <Modal dark={themeCtx.dark} close={action} title={"Rest"}>
            <Block column size={500}>
                <Block justify={'center'}>
                    <Text dark={themeCtx.dark} text={restTimer} color={'default'} type={'h1'} style={{"fontSize": "80px", "lineHeight": "60px"}}/>
                </Block>
                <Block justify={'center'} size={500}>
                    <Button dark={themeCtx.dark} variant={'icon-only'} icon={<ResetIcon/>} iconSize={24} action={() => setRestTimer(data.rest)}/>
                    <Button dark={themeCtx.dark} variant={'icon-only'} icon={pauseTimer ? <PlayIcon/> : <PauseIcon/>} iconSize={24} action={() => setPauseTimer(!pauseTimer)}/>
                    <Button dark={themeCtx.dark} variant={'icon-only'} icon={<StopIcon/>} iconSize={24} action={action}/>
                </Block>
            </Block>
        </Modal>
    )
}

export default RestModal;
