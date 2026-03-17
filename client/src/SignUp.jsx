import {useState} from 'react';
import {createUserWithEmailAndPassword, updateProfile} from 'firebase/auth';
import {auth} from './firebase';
import {doc, setDoc} from 'firebase/firestore';
import {db} from './firebase';

export default function SignUp() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    //async and await wait for operation to complete before continuing 
    const handleAccountCreation = async() => {
        try{
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await setDoc(doc(db, "users", userCredential.user.uid), {
                firstName: firstName,
                lastName: lastName,
                email: email,
            });
        }catch(e){
            if(e.code === 'auth/email-already-in-use'){
                setError('An account with this email already exists.');
            }else if(e.code === 'auth/weak-password'){
                setError('Password must be at least 6 characters.');
            }else{
                setError(e.message);
            }
        }
    };

    return (
        <section id='signup'>
            <h2>Sign Up</h2>
            <p>
                First Name:{' '}
                <input
                    type='text'
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                />
            </p>
            <p>
                Last Name:{' '}
                <input
                    type='text'
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                />
            </p>
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
            <button onClick={handleAccountCreation}>Create Account</button>
            {error && <p>{error}</p>}
        </section>
    )
}