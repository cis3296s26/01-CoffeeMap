import {useState, useEffect} from 'react';
import {onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

export default function App() {
    const [user, setUser] = useState(null);

    //runs after App renders. [] means it runs once
    useEffect(() => {
        onAuthStateChanged(auth, setUser);
    }, []);

    return (
        <div>
            <p>Hello World!</p>
        </div>
    )
}