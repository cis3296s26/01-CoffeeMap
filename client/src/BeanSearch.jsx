import { useState } from 'react'
import { useEffect } from 'react'
import Papa from 'papaparse'

export default function BeanSearch() {
    // initialize variables
    const [beans, setBeans] = useState([])
    const [query, setQuery] = useState("")

    // extract data 
    useEffect(() => {
        const arabica_csv = "https://raw.githubusercontent.com/jldbc/coffee-quality-database/master/data/arabica_data_cleaned.csv"
        // add robusta later

                Papa.parse(arabica_csv, {
                    download: true,
                    header: true,
                    complete: function(results) {
                        // compile database using extracted data
                        const database = results.data
                        console.log("database loaded:", database)
                        console.log("first row:", database[0])
                        console.log("row number:", database.length)
                        setBeans(database)
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
        <div style={{padding:"20px"}}>
            <h1>Bean Search</h1>
            <p>Beans loaded: {beans.length}</p>
            <p>results: {filtered.length}</p>
            <input  
                type="text"
                placeholder="Search"
                value={query}
                onChange={(e)=>setQuery(e.target.value)}
            />

            {filtered.slice(0,15).map((bean, index)=>(
                <div key={index} style={{border:"1px solid lightgray", margin:"10px", padding:"10px"}}>
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