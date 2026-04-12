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

return (
        <section className="container py-5" style={{ minHeight: '100vh', backgroundColor: '#e8e5da' }}>
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-5">
                    <div className="card shadow border-0">
                        <div className="card-body p-4 p-md-5">
                            <h2 className="text-center mb-4">Edit Account</h2>

                            <div className="mb-3">
                                <label className="form-label">First Name</label>
                                <input
                                    type='text'
                                    className="form-control"
                                    defaultValue={userData.firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Last Name</label>
                                <input
                                    type='text'
                                    className="form-control"
                                    defaultValue={userData.lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input
                                    type='email'
                                    className="form-control"
                                    defaultValue={userData.email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Current Password</label>
                                <input
                                    type='password'
                                    className="form-control"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="form-label">New Password</label>
                                <input
                                    type='password'
                                    className="form-control"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <button
                                className="btn w-100 text-white shadow-sm"
                                style={{ backgroundColor: '#1e000e' }}
                                onClick={handleEditAccount}
                            >
                                Save
                            </button>

                            {error && (
                                <div className="alert alert-danger mt-3 text-center py-2 small">
                                    {error}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}