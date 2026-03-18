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

    //Add horizontal navigation bar
    //Navigation bar have link to home, about and sign up page.
    return (
        //... merges conditional object into style object
            <nav style={{backgroundColor: "#000000", color: "#FFFFFF", padding: "25px", position: "sticky", top: 0, zIndex: 1000}}>
                <ul style={{listStyle: "none", display: "flex", gap: "20px", margin: 0, padding: 0, 
                    ...(isAuthenticated && userData && {justifyContent: "space-between", width: "100%"})}}>
                    <li><Link to="/" style={{color: "white", textDecoration: "none"}}>Home</Link></li>
                    <li><Link to="/about" style={{color: "white", textDecoration: "none"}}>About</Link></li>
                    <li><Link to="/signup" style={{color: "white", textDecoration: "none"}}>Sign Up</Link></li>
                    <li><Link to="/login" style={{color: "white", textDecoration: "none"}}>Log In</Link></li>
                    <li><Link to="/search" style={{color: "white", textDecoration: "none"}}>Search</Link></li>
                    {isAuthenticated && userData && (
                        <>
                            <li style={{color: "white", marginLeft: "auto"}}>Welcome, {userData.firstName}</li>
                            <li><button onClick={handleLogOut}>Log Out</button></li>
                            <li><Link to="/editaccount"><button>Edit Account</button></Link></li>
                            {error && <p>{error}</p>}
                        </>
                    )}
                </ul>
            </nav>
    )
}