import React, {createContext, useState} from "react";

const ThemeContext = createContext<any>({
    dark: true,
    toggleDark: () => {}
});

export const ThemeContextProvider = ({children}: any) => {
const [dark, setDark] = useState(true);

    const toggleDark = () => {
        setDark(!dark)
    }

    return (
        <ThemeContext.Provider value={{dark, toggleDark}}>
            {children}
        </ThemeContext.Provider>
    )
}

export default ThemeContext;