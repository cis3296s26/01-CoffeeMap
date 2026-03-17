import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

createRoot(document.getElementById('root')).render(
  
    //Body of the page
    <StrictMode>
        <AuthProvider>
            <BrowserRouter>
                <NavigationBar />
                <Routes>
                    <Route path="/" element={
                        <section id="home">
                            <h1>Proof Of Concept</h1>
                            <h2>ReactJS</h2>
                            <App />
                            <h2>CoffeeAPI Image</h2>
                            <FetchCoffeeImage />
                            <h2>Example Leaflet Map</h2>
                            <LeafletMap />
                            <h2>CQI Database has been printed to console</h2>
                            <PullCSV />
                            <h2>Json data held client-side has been printed to console</h2>
                            <PrintJson />
                        </section>
                    }/>
                    <Route path="/about" element={<About />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/login" element={<LogIn />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    </StrictMode>,
)
