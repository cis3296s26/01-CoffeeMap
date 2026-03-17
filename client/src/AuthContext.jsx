import {createContext, useContext, useEffect, useState} from 'react';
import {onAuthStateChanged} from 'firebase/auth';
import {auth} from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import {db} from './firebase';

const AuthContext = createContext({
    isAuthenticated: false,
    user: null
});

export function AuthProvider({children}) {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const changeState = onAuthStateChanged(auth, async(user) => {
            setUser(user);
            if (user) {
                const docSnap = await getDoc(doc(db, "users", user.uid));
                setUserData(docSnap.data());
            } else {
                setUserData(null);
            }
        });
        return changeState;
    }, []);

    return (
        //!!user converts to boolean (default false)
        <AuthContext.Provider value={{isAuthenticated: !!user, user, userData}}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}