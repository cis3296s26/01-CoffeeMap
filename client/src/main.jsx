import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import './index.css'
import App from './App.jsx'
import FetchCoffeeImage from "./CoffeeAPI.jsx";
import LeafletMap from "./LeafletMap.jsx";
import PullCSV from "./CQIData.jsx";
import PrintJson from "./ParseJson.jsx";
import NavigationBar from "./NavigationBar.jsx";
import About from "./About.jsx"
import SignUp from "./SignUp.jsx"
import LogIn from "./LogIn.jsx"
import EditAccount from './EditAccount.jsx';
import BeanSearch from './BeanSearch.jsx';

createRoot(document.getElementById('root')).render(
  
    //Body of the page
    <StrictMode>
        <AuthProvider>
            <HashRouter>
                <NavigationBar />
                <Routes>
                    <Route path="/" element={
                        <section id="home" style={{ padding: '20px' }}>
                            <h1>Coffee Harvest Tracker</h1>
                            <p style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 30px' }}>
                                Explore coffee-producing countries and their quality data from the Coffee Quality Institute database
                            </p>
                            <LeafletMap />
                            <div style={{ marginTop: '40px' }}>
                                <h2>Random Coffee Image</h2>
                                <FetchCoffeeImage />
                            </div>
                        </section>
                    }/>
                    <Route path="/about" element={<About />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/login" element={<LogIn />} />
                    <Route path="/editaccount" element={<EditAccount />} />
                    <Route path="/search" element={<BeanSearch />} /> 
                </Routes>
            </HashRouter>
        </AuthProvider>
    </StrictMode>,
)
