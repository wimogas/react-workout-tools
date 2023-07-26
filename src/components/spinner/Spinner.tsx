import React from "react";
import classNames from "classnames";

import SpinnerIcon from '../../assets/icons/spinner.svg'
import SpinnerButtonIcon from '../../assets/icons/spinner-button.svg'

import styles from './Spinner.module.css'

type SpinnerProps = {
    fullWidth?: boolean
}
const Spinner = ({ fullWidth }: SpinnerProps) => {
    if (fullWidth) {
        return (
            <div className={classNames(styles['full-width'])}>
                <SpinnerIcon />
            </div>
        )
    }
    return (
        <div className={classNames(styles.spinner)}>
            <SpinnerButtonIcon />
        </div>
    )
}

export default Spinner;