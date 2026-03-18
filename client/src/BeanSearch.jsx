import { useState } from 'react'
import Papa from 'papaparse'

export default function BeanSearch() {
    // initialize variables
    const [beans, setBeans] = useState([])
    const [query, setQuery] = useState("")

    // extract data 
    useEffect(() => {
        const arabica_csv = "https://github.com/jldbc/coffee-quality-database/blob/master/data/arabica_data_cleaned.csv"
        // add robusta later

        Papa.parse(arabica_csv, {
            download: true,
            header: true,
            complete: function(results) {
                // compile database using extracted data
                const database = results.data
                setBeans(database)
            }
        })

    }, [])

    // search through database using search bar input

    // frontend design
}