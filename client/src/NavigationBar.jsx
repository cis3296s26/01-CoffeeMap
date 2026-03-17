import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function NavigationBar() {
    const user = useAuth();

    //Add horizontal navigation bar
    //Navigation bar have link to home, about and sign up page
    return (
    
            <nav style={{backgroundColor: "#000000", color: "#FFFFFF", padding: "25px", position: "sticky", top: 0, zIndex: 1000}}>
                <ul style={{listStyle: "none", display: "flex", gap: "20px", margin: 0, padding: 0, justifyContent: "space-between", width: "100%"}}>
                    <li><Link to="/" style={{color: "white", textDecoration: "none"}}>Home</Link></li>
                    <li><Link to="/about" style={{color: "white", textDecoration: "none"}}>About</Link></li>
                    <li><Link to="/signup" style={{color: "white", textDecoration: "none"}}>Sign Up</Link></li>
                    <li><Link to="/login" style={{color: "white", textDecoration: "none"}}>Log In</Link></li>
                    {user && <li style={{color: "white", marginLeft: "auto"}}>Welcome, {user.displayName}!</li>}
                </ul>
            </nav>
    )
}