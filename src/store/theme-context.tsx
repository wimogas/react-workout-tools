import React, {createContext, useState} from "react";

export const ThemeContext = createContext<any>({
    dark: false,
    toggleDark: () => {}
});

export const ThemeContextProvider = ({children}: any) => {
const [dark, setDark] = useState(false);

    const toggleDark = () => {
        if (!dark) {
            setDark(true)
        } else {
            setDark(false)
        }
    }

    return (
        <ThemeContext.Provider value={{dark, toggleDark}}>
            {children}
        </ThemeContext.Provider>
    )
}