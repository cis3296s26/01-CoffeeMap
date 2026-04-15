import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { useCoffeeData } from './useCoffeeData';
import { useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';

function LeafletMap() {
    const { loading, error, countryData } = useCoffeeData();
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    const filtered = countryData.filter(country =>
        country.name.toLowerCase().includes(search.toLowerCase())
    );
    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <h3>Loading coffee data from CQI database...</h3>
            </div>
        );
    }

    if (error) {
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
                maxBounds={[
                    [-90, -180],
                    [90, 180]
                     ]}
                maxBoundsViscosity={1.0}
                //added the map not wrapping
                >
                    <TileLayer
                        attribution='© OpenStreetMap contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        noWrap={true}
                    />
                    
                    {filtered.map((country, index) => (
                        <CircleMarker
                            key={index}
                            center={country.coords}
                            radius={Math.min(5 + (country.sampleCount / 10), 15)} //size based on samples
                            fillColor="#8B4513"
                            color="#000000"
                            weight={2}
                            opacity={1}
                            fillOpacity={0.7}
                        >
                            <Popup maxWidth={350}>
                                <div style={{ maxWidth: '330px' }}>
                                    <h3 style={{ margin: '0 0 10px 0', color: '#1e000e', borderBottom: '2px solid #1e000e', paddingBottom: '5px' }}>
                                        {country.name} 

                                    </h3>
                                    
                                    <p><strong> Samples:</strong> {country.sampleCount}</p>
                                    
                                    {country.avgScore && (
                                        <p><strong> Average quality score:</strong> {country.avgScore}/100</p>
                                    )}
                                    
                                    {country.varieties.length > 0 && (
                                        <p><strong>Varieties:</strong> {country.varieties.slice(0, 5).join(', ')}
                                        {country.varieties.length > 5 && ` (+${country.varieties.length - 5} more)`}
                                            </p>
                                    )}
                                    
                                    {country.processingMethods.length > 0 && (
                                        <div>
                                            <p><strong> Processing methods:</strong></p>
                                            <p style={{ fontSize: '0.9em', marginLeft: '10px' }}>
                                                {country.processingMethods.join(', ')}
                                            </p>
                                        </div>
                                    )}

                                    {/*Button to navigate to country detail page with more information about the country and its coffee quality data*/}
                                    <button
                                        onClick={() => navigate(`/country/${country.name}`)}
                                        className="btn btn-sm btn-dark mt-2"
                                        style={{
                                            backgroundColor: '#1e000e',
                                            color: 'white',
                                            border: 'none'
                                        }}
                                    >
                                        View Details
                                    </button>
                                </div>
                            </Popup>
                        </CircleMarker>
                    ))}
                </MapContainer>
            </div>
        </div>
    );
}

export default LeafletMap;


