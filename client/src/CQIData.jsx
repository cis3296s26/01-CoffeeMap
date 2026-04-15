import { useEffect, useState } from 'react'
import Papa from 'papaparse'

function PullCSV() {
    const [data, setData] = useState(null)
    const cqiDatabase = 'https://raw.githubusercontent.com/jldbc/coffee-quality-database/refs/heads/master/data/arabica_data_cleaned.csv'

    useEffect(() => {
        Papa.parse(cqiDatabase, {
            download: true,
            header: true,
            complete: (results) => {
                setData(results.data);
                console.log(results.data);
            },
        });
    }, []);
}

export default PullCSV