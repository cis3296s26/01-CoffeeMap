import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { signOut } from 'firebase/auth';
import {useState} from 'react';
import {auth} from './firebase';

export default function NavigationBar() {
    const {isAuthenticated, userData} = useAuth();
    const [error, setError] = useState('');
    const handleLogOut = async () => {
        try {
            await signOut(auth);
            console.log("Signed out successfully");
        } catch (e) {
            setError(e.message);
        }
    };


    // bootstrap
    return (
        //... merges conditional object into style object
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
            <div className = "container">
                <Link className = "navbar-brand" to="/">
                    Coffee Map
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#mainNavbar"
                    aria-controls="mainNavbar"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="mainNavbar">
                    <div className="navbar-nav me-auto">
                        <Link className="nav-link" to="/">Home</Link>
                        <Link className="nav-link" to="/about">About</Link>
                        <Link className="nav-link" to="/search">Search</Link>
                        <Link className="nav-link" to="/favorites">Favorites</Link>
                    </div>
                </div>

                <div className="navbar-nav ms-auto">
                    {!isAuthenticated ? (
                        <>
                            <Link className="nav-link" to="/signup">Sign Up</Link>
                            <Link className="nav-link" to="/login">Log In</Link>
                        </>
                    ) : (
                        <>
                            <span className="navbar-text text-white me-3">
                                Welcome, {userData?.firstName}
                            </span>
                            <Link className="nav-link" to="/editaccount">Edit Account</Link>
                            <button
                                className="btn btn-outline-light ms-2"
                                onClick={handleLogOut}
                            >
                                Log Out
                            </button>
                        </>
                    )}
                </div>
            </div> 
        </nav>
    );
}