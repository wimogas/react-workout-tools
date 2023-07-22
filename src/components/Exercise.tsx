import React from "react";
import {Block, Button, Text} from "react-barebones-ts";
import data from "../assets/data/workouts.json";

type ExerciseProps = {
    exercise: any,
    done: any,
    active: string,
    activeSet: number,
    handleSetButtonAction: (sets: number, i: number) => void

}

const Exercise = ({exercise, done, active, activeSet, handleSetButtonAction}: ExerciseProps) => {

    const setBuilder = (exercise: any) => {
        let setArray = [];
        for (let i = 0; i < exercise.sets; i++) {
            setArray.push(
                <Button key={i}
                        variant={active === exercise.name && activeSet === i ? 'primary' : 'secondary'}
                        disabled={done.includes(exercise.name) || active === exercise.name && activeSet > i || active !== exercise.name}
                        action={() => handleSetButtonAction(exercise.sets, i)}>
                    {`${i + 1}`}
                </Button>);
        }
        return setArray;
    }

    const returnedSets = setBuilder(exercise);

    return (
        <Block key={exercise.name} column size={300}>
            <Text type={'h1'} text={exercise.name} color={(active === exercise.name) ? 'success' : 'disabled'}/>
            <Block size={300}>
                <Text type={'p'} text={'Reps: ' + exercise.reps}/>
                <Text type={'p'} text={'Weight: ' + exercise.weight}/>
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