import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'; 
import { AuthProvider } from './AuthContext.jsx';
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
                    Coffee Map
                </h1>
                <p 
                    className="lead text-muted mx-auto"
                    style={{maxWidth: '900px'}}
                >
                    Explore coffee-producing countries below!
                </p>
            </div>

            <div className="card shadow-sm border-0 mb-4">
                <div style={{
                    height: '4px',
                    backgroundColor: '#1e000e',
                    borderTopLeftRadius: '0.5rem',
                    borderTopRightRadius: '0.5rem'
                }} />
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="card-title mb-3">
                        Interactive Coffee Map
                        </h4>
                        <span className="badge" style={{ backgroundColor: '#1e000e' }}>
                            CQI Data
                        </span>
                    </div>

                    <div style={{ height: '560px', width: '100%', overflow: 'hidden' }}>
                        <LeafletMap />
                    </div>
                </div>
            </div>

            <div className="row g-4 mt-2">
                <div className="col-lg-6">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-body">
                            <h5 className="card-title mb-3">
                                Country Details
                            </h5>
                            <p className="text-muted mb-0">
                                Click a country to learn more!
                            </p>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-body">
                            <h5 className="card-title mb-3">
                                Search & Favorites
                            </h5>
                            <p className="text-muted mb-0">
                                Search to explore and save your favorites!
                            </p>
                        </div>
                    </div>
                </div>
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
                    <Route path="/" element={<HomePage />} />
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