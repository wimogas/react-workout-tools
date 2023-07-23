import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";

import './style.scss';

import HomePage from "./pages/HomePage";
import {ThemeContextProvider} from "./store/theme-context";

const App = () => {

    return (
        <ThemeContextProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<HomePage/>}/>
                </Routes>
            </BrowserRouter>
        </ThemeContextProvider>

    );
};

export default App;
