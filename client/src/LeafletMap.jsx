import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { useCoffeeData } from './useCoffeeData';
import { useCoffeeData2 } from './useCoffeeData2';
import { useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';

function LeafletMap() {
    const { loading, error, countryData } = useCoffeeData();
    const { reviews, loading: reviewsLoading, error: reviewsError } = useCoffeeData2()
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    const filtered = countryData.filter(country =>
        country.name.toLowerCase().includes(search.toLowerCase())
    );

    const reviewsByCountry = reviews.reduce((acc, review) => {
        if (!review.country) return acc;

        if (!acc[review.country]) {
            acc[review.country] = [];
        }

        acc[review.country].push(review);
        return acc;
    }, {});

    if (loading || reviewsLoading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <h3>Loading coffee data from CQI database...</h3>
            </div>
        );
    }

    if (error || reviewsError) {
        return (
            <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
                <h3>Error loading data: {error}</h3>
            </div>
        );
    }

    return (
        <div className="h-100 d-flex flex-column">
            <div className="text-center mb-3">
                <input
                    type='text'
                    placeholder='Search country...'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="form-control mx-auto"
                    style={{ maxWidth: '350px' }}
                />
            </div>

            <p className="text-center mb-3">
                Showing {filtered.length} of {countryData.length} coffee-producing countries from CQI database
            </p>
            <div style={{ flex: 1, minHeight: 0}}>
                <MapContainer
                    center={[10, -20]}
                    zoom={2}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        attribution='© OpenStreetMap contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    
                    {filtered.map((country, index) => (
                        const countryReviews = reviewsByCountry[country.name] || [];
                        return (

                        )
                        
                    ))}
                </MapContainer>
            </div>
        </div>
    );
}

export default LeafletMap;


