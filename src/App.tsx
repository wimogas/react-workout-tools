import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";

import './style.scss';

import {ThemeContextProvider} from "./store/theme-context";
import {UserContextProvider} from "./store/user-context";

import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Plans from "./pages/Plans";

const App = () => {

    return (
        <UserContextProvider>
            <ThemeContextProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<HomePage/>}/>
                        <Route path="/plans" element={<Plans/>}/>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/register" element={<Register/>}/>
                    </Routes>
                </BrowserRouter>
            </ThemeContextProvider>
        </UserContextProvider>
    );
};

export default App;
