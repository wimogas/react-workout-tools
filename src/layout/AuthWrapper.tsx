import React from "react";

import {Button, Block, Input} from 'react-barebones-ts'
import styles from "./AuthWrapper.module.css";

type ContentProps = {
    children: any
}
const AuthWrapper = ({children}: ContentProps) => {
    return (
        <Block
            classes={styles['wrapper']}>
            <Block
                variant={'card'}
                dark
                column
                classes={styles['container']}
            >
                {children}
            </Block>
        </Block>
    )
}

export default AuthWrapper;