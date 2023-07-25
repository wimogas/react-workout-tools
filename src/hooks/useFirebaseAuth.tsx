import React, {useState, useEffect} from "react";
import {onAuthStateChanged} from "firebase/auth";
import {auth} from "../firebase";

const useFirebaseAuth = () => {

    const [authLoading, setAuthLoading] = useState(true)
    const [authUser, setAuthUser] = useState({
        name: '',
        id: ''
    });

    useEffect(() => {
        const unlisten = onAuthStateChanged(auth, (user) => {
            if (user) {
                setAuthUser({
                    name: user.displayName || '',
                    id: user.uid
                })
                setAuthLoading(false)
            } else {
                setAuthLoading(false)
            }
        })
        return () => {
            unlisten()
        }
    }, [])

    return {
        authLoading,
        authUser
    }
}

export default useFirebaseAuth;