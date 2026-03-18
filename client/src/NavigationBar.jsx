import { Link } from 'react-router-dom';

export default function NavigationBar() {

    //Add horizontal navigation bar
    //Navigation bar have link to home, about and sign up page.
    return (
    
            <nav style={{backgroundColor: "#000000", color: "FFFFFF", padding: "25px", position: "sticky", top: 0, zIndex: 1000}}>
                <ul style={{listStyle: "none", display: "flex", gap: "20px", margin: 0, padding: 0}}>
                    <li><Link to="/" style={{color: "white", textDecoration: "none"}}>Home</Link></li>
                    <li><Link to="/about" style={{color: "white", textDecoration: "none"}}>About</Link></li>
                    <li><Link to="/signup" style={{color: "white", textDecoration: "none"}}>Sign Up</Link></li>

                </ul>
            </nav>
    )
}