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
        classes={'bb-pb-900 bb-mx-600 bb-w-100'}
        style={{"marginTop": "32px"}}
    >
        {children}
    </Block>
    );
};

export default Content;
