import { useState } from 'react';
import { useAuth } from './AuthContext';
import { updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

export default function EditAccount(){
    const {userData, user, refreshUserData} = useAuth();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleEditAccount = async() =>{
        try {
            //update firestore fields
            await updateDoc(doc(db, "users", user.uid), {
                firstName: firstName || userData.firstName,
                lastName: lastName || userData.lastName,
            });

            // re-authenticate before email/password changes
            if (email || password) {
                const credential = EmailAuthProvider.credential(user.email, currentPassword);
                await reauthenticateWithCredential(user, credential);
            }

            //update email
            if (email) await updateEmail(user, email);

            //update password
            if (password) await updatePassword(user, password);

            await refreshUserData();

        } catch (e) {
            setError(e.message);
        }
    };

    if (!userData) return <p>Loading...</p>;

    return(
        <section id='editaccount'>
            <h2>Edit Account</h2>
            <p>
                First Name:{' '}
                <input
                    type='text'
                    defaultValue={userData.firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                />
            </p>
            <p>
                Last Name:{' '}
                <input
                    type='text'
                    defaultValue={userData.lastName}
                    onChange={(e) => setLastName(e.target.value)}
                />
            </p>
            <p>
                Email:{' '}
                <input
                    type='text'
                    defaultValue={userData.email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </p>
            <p>
                Current Password:{' '}
                <input
                    type='password'
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                />
            </p>
            <p>
                New Password:{' '}
                <input
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </p>
            <button onClick={handleEditAccount}>Save</button>
            {error && <p>{error}</p>}
        </section>
    );
}