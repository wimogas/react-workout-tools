import React from "react";
import {Link} from "react-router-dom";

import {Block, Text} from 'react-barebones-ts'

const Nav = () => {

    return (
        <Block classes={'bb-background-12 bb-px-600 bb-py-400'}>
            <Block size={300}>
                <Link to="/">
                    <Text color={'disabled'} text={'WORKOUT TOOLS'}/>
                </Link>
            </Block>
        </Block>
    );
};

export default Nav;
