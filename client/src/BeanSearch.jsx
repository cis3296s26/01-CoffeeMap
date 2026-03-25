import { useState } from 'react'
import { useEffect } from 'react'
import Papa from 'papaparse'
import { data } from 'react-router-dom'

export default function BeanSearch() {
    // initialize variables
    const [beans, setBeans] = useState([])
    const [query, setQuery] = useState("")

    useEffect(() => {
        const arabica_csv = "https://raw.githubusercontent.com/jldbc/coffee-quality-database/master/data/arabica_data_cleaned.csv"
        const robusta_csv = "https://raw.githubusercontent.com/jldbc/coffee-quality-database/refs/heads/master/data/robusta_data_cleaned.csv"

                Papa.parse(arabica_csv, {
                    download: true,
                    header: true,
                    complete: function(results) {
                        // compile database using extracted data
                        const database = results.data
                        setBeans(((previousBeans) => [...previousBeans, ...database]))
                    }
                })
                Papa.parse(robusta_csv, {
                    download: true,
                    header: true,
                    complete: function(results) {
                        // compile database using extracted data
                        const database = results.data
                        setBeans((previousBeans) => [...previousBeans, ...database])
                    }
                })
    }, [])

    // search through database using search bar input
    const filtered = beans.filter((bean) => {
        return (
            bean["Country.of.Origin"]?.includes(query) ||
            bean["Region"]?.includes(query) ||
            bean["Variety"]?.includes(query)
        )
    })

    // frontend design
    return (
        <div style={{padding:"10px"}}>
            <h1>Bean Search</h1>
            <input  
                type="text"
                placeholder="Search"
                value={query}
                onChange={(e)=>setQuery(e.target.value)}
            />

            {filtered.slice(0,15).map((bean, index)=>(
                <div key={index} style={{border:"1px solid brown", margin:"15px", padding:"15px"}}>
                    <p><b>Country:</b> {bean["Country.of.Origin"]}</p>
                    <p><b>Region:</b> {bean["Region"]}</p>
                    <p><b>Variety:</b> {bean["Variety"]}</p>
                    <p><b>Aroma:</b> {bean["Aroma"]}</p>
                    <p><b>Flavor:</b> {bean["Flavor"]}</p>
                </div>
            ))}

        </div>
    )
}