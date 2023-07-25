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
            <div className={classNames(styles.spinner, styles['full-width'])}>
                <SpinnerIcon />
            </div>
        )
    }
    return (
        <SpinnerButtonIcon />
    )
}

export default Spinner;