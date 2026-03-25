import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { useCoffeeData } from './useCoffeeData';
import 'leaflet/dist/leaflet.css';

function LeafletMap() {
    const { loading, error, countryData } = useCoffeeData();

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
        <div>
            <p style={{ textAlign: 'center', marginBottom: '10px' }}>
                Showing {countryData.length} coffee-producing countries from CQI database
            </p>
            <MapContainer
                center={[10, -20]}
                zoom={2}
                style={{ height: '600px', width: '100%', maxWidth: '1200px', margin: '0 auto' }}
            >
                <TileLayer
                    attribution='© OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {countryData.map((country, index) => (
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
                                <h3 style={{ margin: '0 0 10px 0', color: '#8B4513', borderBottom: '2px solid #8B4513', paddingBottom: '5px' }}>
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
                            </div>
                        </Popup>
                    </CircleMarker>
                ))}
            </MapContainer>
        </div>
    );
}

export default LeafletMap;


