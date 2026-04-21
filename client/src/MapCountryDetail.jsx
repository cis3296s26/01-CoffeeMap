import { useParams, useNavigate } from 'react-router-dom'
import { useCoffeeData } from './useCoffeeData'
import { useCoffeeData2 } from './useCoffeeData2'
import coffeeCountries from "./data/coffeeCountries.json"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function CountryDetail() {
    const { countryName } = useParams()
    const { loading, error, countryData } = useCoffeeData()
    const { reviews, loading: reviewsLoading, error: reviewsError } = useCoffeeData2()

    const decodeName = decodeURIComponent(countryName)
    const countryInfo = coffeeCountries.countries.find(c => c.name === decodeName)
    const country = countryData.find(c => c.name === decodeName)
    const countryReviews = reviews.filter(review => review.country === decodeName)

    if (loading) return <p>Loading data...</p>
    if (error) return <p>Error</p>
    if (!country) return <p>Country not found</p>

    const chartData = [
        { name: 'Aroma', value: Number(country.avgAroma) },
        { name: 'Flavor', value: Number(country.avgFlavor) },
        { name: 'Aftertaste', value: Number(country.avgAftertaste) },
        { name: 'Acidity', value: Number(country.avgAcidity) },
        { name: 'Body', value: Number(country.avgBody) },
        { name: 'Balance', value: Number(country.avgBalance) },
        { name: 'Uniformity', value: Number(country.avgUniformity) },
        { name: 'Cup Cleanliness', value: Number(country.avgCupCleanliness) },
        { name: 'Sweetness', value: Number(country.avgSweetness) },
        { name: 'Cupper Points', value: Number(country.avgCupperPoints) },
        { name: 'Moisture', value: Number(country.avgMoisture) },
    ]

    const getMetricValue = (bean, key) => {
        if (key === 'Cup Cleanliness') {
            return Number(bean['Cup Cleanliness'] ?? bean['Clean.Cup']) || 0
        }
        if (key === 'Cupper Points') {
            return Number(bean['Cupper.Points']) || 0
        }
        return Number(bean[key]) || 0
    }

    return (
        <div style={{ padding: "20px" }}>
            <h1>{decodeName} Coffee</h1>
            
            {/* Description */}
            <h2>About</h2>
            {countryInfo && (      
                <>
                    <p>{countryInfo.description}</p>
                    <p><b>Region:</b> {countryInfo.region}</p>
                    <p><b>Altitude:</b> {countryInfo.altitude}</p>
                    <p><b>Flavor Notes:</b> {countryInfo.flavorNotes.join(', ')}</p>
                    <p><b>Harvest Months:</b> {countryInfo.harvestMonths.join(', ')}</p>
                </>
            )}
            {/* Harvesting info */}
            <h2>Harvesting</h2>
            <p><b>Processing Methods:</b> {country.processingMethods.join(', ')}</p>
            <p><b>Varieties:</b> {country.varieties.join(', ')}</p>
            <p><b>Total Samples:</b> {country.sampleCount}</p>
            <p><b>Total Reviews:</b> {countryReviews.length}</p>


            <h2>Averaged Quality Measures</h2>
            <div style={{ width: '100%', height: 420 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <XAxis
                            dataKey="name"
                            angle={-25}
                            textAnchor="end"
                            interval={0}
                            height={90}
                        />
                        <YAxis domain={[0, 10]} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#8B4513" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <h2 style={{ marginTop: '24px' }}>Final Cup Score</h2>
            <p>
                <b>Average Total Cup Points:</b> {country.avgScore}/100
            </p>

            <h2 style={{ marginTop: '32px' }}>Reviewed Retail Beans</h2>
            {countryReviews.length > 0 ? (
                 <div className="row g-4">
                    {countryReviews.map((review) => (
                        <div className="col-md-6 col-xl-4" key={review.id}>
                            <div className="card shadow-sm border-0 h-100">
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title mb-1">
                                        {review.title || 'Untitled Review'}
                                    </h5>
                                    <p className="text-muted mb-2">
                                        {review.roaster || 'Unknown Roaster'}
                                    </p>

                                    <p><b>Origin:</b> {review.coffeeOrigin || 'N/A'}</p>
                                    <p><b>Rating:</b> {review.rating || 'N/A'}</p>
                                    <p><b>Aroma:</b> {review.aroma || 'N/A'}</p>
                                    <p><b>Flavor:</b> {review.flavor || 'N/A'}</p>
                                    <p><b>Aftertaste:</b> {review.aftertaste || 'N/A'}</p>
                                    <p><b>Body:</b> {review.body || 'N/A'}</p>
                                    <p><b>Roast Level:</b> {review.roastLevel || 'N/A'}</p>
                                    <p><b>Bottom Line:</b> {review.bottomLine || 'N/A'}</p>
                                    <p><b>Notes:</b> {review.notes || 'N/A'}</p>
                                    <p><b>Estimated Price:</b> {review.estPrice || 'N/A'}</p>

                                    </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No individual retail review records found.</p>
            )}
        </div>
    )
}