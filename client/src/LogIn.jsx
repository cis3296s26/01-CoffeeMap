import {useState} from 'react';
import {signInWithEmailAndPassword} from 'firebase/auth';
import {auth} from './firebase';

export default function LogIn(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    const handleLogin = async() => {
        try{
            await signInWithEmailAndPassword(auth, email, password);
        } catch (e) {
            if(e.code === 'auth/invalid-credential') {
                setError('Invalid email or password.');
            }
            else{
                setError(e.message);
            }
        }
    };

    return(
        <section id='login'>
            <h2>Log In</h2>
            <p>
                Email:{' '}
                <input
                    type='text'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </p>
            <p>
                Password:{' '}
                <input
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </p>
            <button onClick={handleLogin}>Log in</button>
            {error && <p>{error}</p>}
        </section>
    )
}