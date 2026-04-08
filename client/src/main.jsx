import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'; 
import { AuthProvider } from './AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
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
import Favorites from './Favorites.jsx';
import CountryDetail from './MapCountryDetail.jsx';

function HomePage() {
    return (
        <section className="container-xl py-4">
            <div className="text-center py-4">
                <h1 className="display-4 fw-bold mb-3">
                    Explore coffee-producing countries and their quality data from the Coffee Quality Institute database
                </h1>
                <p 
                    className="lead text-muted mx-auto"
                    style={{maxWidth: '850px'}}
                >
                    Explore coffee beans!
                </p>
            </div>


        </section>
    );
}

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AuthProvider>
            <HashRouter>
                <NavigationBar />
                <Routes>
                    <Route path="/about" element={<About />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/login" element={<LogIn />} />
                    <Route path="/editaccount" element={<EditAccount />} />
                    <Route path="/search" element={<BeanSearch />} />
                    <Route path="/favorites" element={<Favorites />} /> 
                    <Route path="/country/:countryName" element={<CountryDetail />}/>
                </Routes>
            </HashRouter>
        </AuthProvider>
    </StrictMode>,
);