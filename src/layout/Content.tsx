import React from "react";

import {Block} from 'react-barebones-ts'

type ContentProps = {
    children: any
}
const Content = ({children}: ContentProps) => {

return (
    <Block
        size={500}
        column
        style={{padding: '42px 24px', margin: '78px 24px 0 24px', width: '100%'}}
    >
        {children}
    </Block>
    );
};

export default Content;
