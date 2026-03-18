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
                        radius={Math.min(5 + (country.sampleCount / 10), 15)} // Size based on samples
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
                                
                                <p><strong>📊 Samples in database:</strong> {country.sampleCount}</p>
                                
                                {country.avgScore && (
                                    <p><strong>⭐ Average quality score:</strong> {country.avgScore}/100</p>
                                )}
                                
                                {country.varieties.length > 0 && (
                                    <div>
                                        <p><strong>🌱 Varieties:</strong></p>
                                        <p style={{ fontSize: '0.9em', marginLeft: '10px' }}>
                                            {country.varieties.slice(0, 5).join(', ')}
                                            {country.varieties.length > 5 && ` (+${country.varieties.length - 5} more)`}
                                        </p>
                                    </div>
                                )}
                                
                                {country.processingMethods.length > 0 && (
                                    <div>
                                        <p><strong>⚙️ Processing methods:</strong></p>
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


// import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
// import 'leaflet/dist/leaflet.css';

// function LeafletMap() {
//     // hardcoded coffee countries for testing
//     const coffeeCountries = [
//         { name: "Brazil", coords: [-14.235, -51.925], samples: 132 },
//         { name: "Colombia", coords: [4.571, -74.297], samples: 44 },
//         { name: "Ethiopia", coords: [9.145, 40.489], samples: 44 },
//         { name: "Guatemala", coords: [15.783, -90.230], samples: 15 },
//         { name: "Mexico", coords: [23.634, -102.552], samples: 28 },
//         { name: "Kenya", coords: [-0.023, 37.906], samples: 3 },
//         { name: "Costa Rica", coords: [9.748, -83.753], samples: 29 },
//         { name: "Honduras", coords: [15.200, -86.241], samples: 12 },
//         { name: "Peru", coords: [-9.190, -75.015], samples: 3 },
//         { name: "Indonesia", coords: [-0.789, 113.921], samples: 3 }
//     ];

//     return (
//         <MapContainer
//             center={[10, -20]}
//             zoom={2}
//             style={{ height: '600px', width: '100%', maxWidth: '1200px', margin: '0 auto' }}
//         >
//             <TileLayer
//                 attribution='© OpenStreetMap contributors'
//                 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//             />
            
//             {coffeeCountries.map((country, index) => (
//                 <CircleMarker
//                     key={index}
//                     center={country.coords}
//                     radius={10}
//                     fillColor="#8B4513"
//                     color="#000000"
//                     weight={2}
//                     opacity={1}
//                     fillOpacity={0.7}
//                 >
//                     <Popup>
//                         <div>
//                             <h3 style={{ margin: '0 0 10px 0', color: '#8B4513' }}>
//                                 {country.name}
//                             </h3>
//                             <p><strong>Samples in CQI database:</strong> {country.samples}</p>
//                             <p style={{ fontSize: '0.9em', color: '#666' }}>
//                                 Click to explore coffee from this region
//                             </p>
//                         </div>
//                     </Popup>
//                 </CircleMarker>
//             ))}
//         </MapContainer>
//     )
// }

// export default LeafletMap





// import { MapContainer, TileLayer, useMap } from 'react-leaflet'
// import 'leaflet/dist/leaflet.css';

// function LeafletMap() {
//     return (
//         <MapContainer
//             center={[0, 0]}
//             zoom={1}
//             style={{ height: '800px', width: '800px' }}
//         >
//         <TileLayer
//             attribution='© OpenStreetMap contributors'
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />
//         </MapContainer>
//     )
// }

// export default LeafletMap