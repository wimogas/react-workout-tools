import React from "react";
import {Block, Button, Icon, Text} from "react-barebones-ts";

import CheckLine from "../assets/icons/check-line.svg";

type ExerciseProps = {
    dark: boolean,
    exercise: any,
    done: any,
    active: string,
    activeSet: number,
    handleSetButtonAction: (sets: number, i: number) => void
}

const Exercise = ({dark, exercise, done, active, activeSet, handleSetButtonAction}: ExerciseProps) => {

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

    return (
        <Block
            key={exercise.name}
            column
            size={300}
            >
            <Block size={400} align={'center'}>
                <Text type={'h1'} dark={dark} text={exercise.name} color={(active === exercise.name) ? 'primary' : done.includes(exercise.name) ? 'success' : 'disabled'}/>
                {done.includes(exercise.name) && <Icon icon={<CheckLine/>} size={20} color={'#189949'}/>}
            </Block>
            <Block size={300}>
                <Text color={(active === exercise.name) ? 'secondary' : 'disabled'} dark={dark} type={'p'} text={'Reps: ' + exercise.reps}/>
                <Text color={(active === exercise.name) ? 'secondary' : 'disabled'} dark={dark} type={'p'} text={'Weight: ' + exercise.weight}/>
            </Block>
            <Block size={200}>
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