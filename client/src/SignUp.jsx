import {useState} from 'react';
import {createUserWithEmailAndPassword} from 'firebase/auth';
import {auth} from './firebase';
import {doc, setDoc} from 'firebase/firestore';
import {db} from './firebase';

export default function SignUp() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    // State variable to track password visibility
    const [showPassword, setShowPassword] = useState(false);

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
        <section className="container py-5" style={{ minHeight: '100vh', backgroundColor: '#e8e5da' }}>
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-5">
                    <div className="card shadow border-0">
                        <div className="card-body p-4 p-md-5">
                            <h2 className="text-center mb-4">Sign Up</h2>
            
                            <div className="mb-3">
                                <label className="form-label">First Name</label>
                                <input
                                    type='text'
                                    className="form-control"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Last Name</label>
                                <input
                                    type='text'
                                    className="form-control"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input
                                    type='email'
                                    className="form-control"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="form-label">Password</label>
                                <div className="input-group">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        className="form-control"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        style={{ borderRight: 'none' }}
                                    />
                                    <span 
                                        className="input-group-text bg-white text-muted" 
                                        style={{ cursor: 'pointer', userSelect: 'none' }}
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? 'Hide' : 'Show'}
                                    </span>
                                </div>
                            </div>

                            <button 
                                className="btn w-100 text-white shadow-sm" 
                                style={{backgroundColor: "#1e000e"}} 
                                onClick={handleAccountCreation}
                            >
                                Create Account
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