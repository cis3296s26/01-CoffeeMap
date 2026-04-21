import { useParams, useNavigate } from 'react-router-dom'
import { useCoffeeData } from './useCoffeeData'
import coffeeCountries from "./data/coffeeCountries.json"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function CountryDetail() {
    const { countryName } = useParams()
    const { loading, error, countryData } = useCoffeeData()

    const decodeName = decodeURIComponent(countryName)
    const countryInfo = coffeeCountries.countries.find(c => c.name === decodeName)
    const country = countryData.find(c => c.name === decodeName)

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

            <h2>Quality Measures</h2>
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

            <h2 style={{ marginTop: '24px' }}>Defect Penalty</h2>
            <p>
                <b>Average Defects:</b>{" "}
                {Number.isFinite(Number(country.avgDefects))
                    ? Number(country.avgDefects)
                    : 'N/A'}
            </p>

            <h2 style={{ marginTop: '24px' }}>Final Cup Score</h2>
            <p>
                <b>Average Total Cup Points:</b> {country.avgScore}/100
            </p>
        </div>
    )
}