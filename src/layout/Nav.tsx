import React from "react";
import {Link} from "react-router-dom";

import styles from "./Nav.module.css";

import {Block} from 'react-barebones-ts'

const Nav = () => {

    return (
        <nav className={styles.nav}>
            <Block size={300}>
                <Link to="/">WORKOUT TOOLS</Link>
            </Block>
        </nav>
    );
};

export default Nav;
