import { useParams, useNavigate } from 'react-router-dom'
import { useCoffeeData } from './useCoffeeData'
import coffeeCountries from "./data/coffeeCountries.json"
import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'

export default function CountryDetail() {
    const { countryName } = useParams()
    const { loading, error, countryData } = useCoffeeData()
    const navigate = useNavigate()

    const decodeName = decodeURIComponent(countryName)
    const countryInfo = coffeeCountries.countries.find(c => c.name === countryName)
    const country = countryData.find(c => c.name === countryName)

    if (loading) return <p>Loading data...</p>
    if (error) return <p>Error</p>
    if (!country) return <p>Country not found</p>

    const chartData = [
        { name: 'Aroma', value: Number(country.avgAroma)},
        { name: 'Flavor', value: Number(country.avgFlavor)},
        { name: 'Acidity', value: Number(country.avgAcidity) },
        { name: 'Sweetness', value: Number(country.avgSweetness) },
        { name: 'Aftertaste', value: Number(country.avgAftertaste) },
    ]

    return (
        <div style={{padding: "20px"}}>
            <h1>{countryName} Coffee</h1>
            
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

            {/* Graph - Bar Charts */}
            <h2>Flavor Profile</h2>
            <BarChart width={500} height={300} data={chartData}>
                <XAxis dataKey="name" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Bar dataKey="value" fill="#8B4513" />
            </BarChart>

            <p><b>Average Quality Score:</b> {country.avgScore}/100</p>
        </div>
    )
}