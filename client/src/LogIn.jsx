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

    return (
        <section className="container py-5" style={{ minHeight: '100vh', backgroundColor: '#e8e5da' }}>
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-5">
                    <div className="card shadow border-0">
                        <div className="card-body p-4 p-md-5">
                            <h2 className="text-center mb-4">Log In</h2>
            
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
                                <input
                                    type='password'
                                    className="form-control"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <button 
                                className="btn w-100 text-white shadow-sm" 
                                style={{backgroundColor: "#1e000e"}} 
                                onClick={handleLogin}
                            >
                                Log In
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