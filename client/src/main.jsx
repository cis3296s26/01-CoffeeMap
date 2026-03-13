import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import FetchCoffeeImage from "./CoffeeAPI.jsx";
import LeafletMap from "./LeafletMap.jsx";
import PullCSV from "./CQIData.jsx";
import PrintJson from "./ParseJson.jsx";

createRoot(document.getElementById('root')).render(
    <StrictMode>
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
    </StrictMode>,
)
