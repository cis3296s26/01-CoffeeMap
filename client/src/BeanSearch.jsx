import { useState } from 'react'
import { useEffect } from 'react'
import Papa from 'papaparse'
import { useAuth } from './AuthContext'
import { getFavorites, saveFavorite, removeFromFavorites } from './favoriteDB'

export default function BeanSearch() {
    // initialize variables
    const [beans, setBeans] = useState([])
    const [query, setQuery] = useState("")
    const[filters, setFilters] = useState({
        country: "",
        region: "",
        aroma: "",
        species: "",
        minScore: 0,
        minFlavor: 0,
        minAcidity: 0,
        minSweetness: 0,
    })
    const { user } = useAuth()

    const [page, setPage] = useState(1)
    const itemsPerPage = 10
    const [favorites, setFavorites] = useState([])

    // extract data 
    useEffect(() => {
        const arabica_csv = "https://raw.githubusercontent.com/jldbc/coffee-quality-database/master/data/arabica_data_cleaned.csv"
        const robusta_csv = "https://raw.githubusercontent.com/jldbc/coffee-quality-database/refs/heads/master/data/robusta_data_cleaned.csv"

                Papa.parse(arabica_csv, {
                    download: true,
                    header: true,
                    complete: function(results) {
                        // compile database using extracted data
                        const database = results.data.map(bean => ({
                            ...bean,
                            Species: "Arabica"
                        }))
                        setBeans(((previousBeans) => [...previousBeans, ...database]))
                    }
                })
                Papa.parse(robusta_csv, {
                    download: true,
                    header: true,
                    complete: function(results) {
                        // compile database using extracted data
                        const database = results.data.map(bean => ({
                            ...bean,
                            Species: "Robusta",
                            Acidity: bean["Salt...Acid"],
                            Sweetness: bean["Bitter...Sweet"]
                        }))
                        setBeans(((previousBeans) => [...previousBeans, ...database]))
                    }
                })
    }, [])

    //subscribe to user's favorites in firestore (updates in real time)
    useEffect(() => {
        if (!user) return
        const unsub = getFavorites(user.uid, (favs) => {
            setFavorites(favs.map(f => `${f.country}_${f.region}`.replace(/\s+/g, '_')))
        })
        return () => unsub()
    }, [user])

    const getBeanId = (bean) => `${bean["Country.of.Origin"]}_${bean["Region"]}`.replace(/\s+/g, '_')

    const isFavorited = (bean) => favorites.includes(getBeanId(bean))

    const toggleFavorite = async (bean) => {
        if (!user) return
        if (isFavorited(bean)) {
            await removeFromFavorites(user.uid, {
                country: bean["Country.of.Origin"],
                region: bean["Region"]
            })
        } else {
            await saveFavorite(user.uid, bean)
        }
    }

    //Filter function
    const applyFilters = (bean) => {
        const matchCounty = !filters.country || bean["Country.of.Origin"] === filters.country
        const matchRegion = !filters.region || bean["Region"] === filters.region
        const matchAroma = !filters.aroma || bean["Aroma"] === filters.aroma
        const matchScore = !filters.minScore || parseFloat(bean["Total.Cup.Points"]) >= filters.minScore
        const matchSpecies = !filters.species || bean["Species"] === filters.species
        const matchFlavor = !filters.minFlavor || bean["Flavor"] === filters.minFlavor
        const matchAcidity = !filters.minAcidity || bean["Acidity"] === filters.minAcidity
        const matchSweetness = !filters.minSweetness || bean["Sweetness"] === filters.minSweetness

        return matchCounty && matchRegion && matchAroma && matchScore && matchSpecies && matchFlavor && matchAcidity && matchSweetness
    }

    // search through database using search bar input
    const filtered = beans.filter((bean) => {
        const matchSearch = 
            bean["Country.of.Origin"]?.includes(query) ||
            bean["Region"]?.includes(query) ||
            bean["Variety"]?.includes(query)
        return matchSearch && applyFilters(bean)
    })

    const totalPages = Math.ceil(filtered.length / itemsPerPage)
    const currentItems = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage)
    
    console.log("user:", user)
    // frontend design
    return (
        <div style={{padding:"10px"}}>
            <h1>Bean Search</h1>

            {/* search bar and filters */}
            <div style={{backgroundColor: "#000000", padding: "12px", display: "flex", gap: "10px", alignItems: "center"}}>
                    {/* search bar */}
                    <input  
                    type="text"
                    placeholder="Search"
                    value={query}
                    onChange={(e)=>setQuery(e.target.value)}
                    style={{padding: "2px", width: "500px"}}
                />
                <select 
                    value={filters.country}
                    onChange={(e) => setFilters({...filters, country: e.target.value})}
                    >
                    <option value = ''>All Countries</option>
                    {[...new Set(beans.map(bean => bean["Country.of.Origin"]).filter(Boolean))].sort().map((c, i) => (
                        <option key={i} value={c}>{c}</option>
                    ))}
                    </select>
                
                <select 
                    value={filters.region}
                    onChange={(e) => setFilters({...filters, region: e.target.value})}
                    >
                    <option value = ''>All Regions</option>
                    {[...new Set(beans.map(bean => bean["Region"]).filter(Boolean))].sort().map((r, i) => (
                        <option key={i} value={r}>{r}</option>
                    ))}
                    </select>

                <select 
                    value={filters.aroma}
                    onChange={(e) => setFilters({...filters, aroma: e.target.value})}
                    >
                    <option value = ''>All Aromas</option>
                    {[...new Set(beans.map(bean => bean["Aroma"]).filter(Boolean))].sort().map((a, i) => (
                        <option key={i} value={a}>{a}</option>
                    ))}
                    </select>

                <select 
                    value={filters.species}
                    onChange={(e) => setFilters({...filters, species: e.target.value})}
                    >
                    <option value = ''>All Species</option>
                    {[...new Set(beans.map(bean => bean["Species"]).filter(Boolean))].sort().map((s, i) => (
                        <option key={i} value={s}>{s}</option>
                    ))}
                    </select>
                
                {/*Clear filters button*/}
                <button onClick={() => {setQuery(""); setFilters({country: "", region:"", aroma: "", species: "", minScore: 0})}}>
                    Clear Filters
                </button>
            </div>

            {/* display search results */}
            {currentItems.map((bean, index)=>(
                <div key={index} style={{border:"1px solid black", margin:"15px", padding:"15px"}}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <b></b>
                        {user && (
                            <span
                                onClick={() => toggleFavorite(bean)}
                                title={isFavorited(bean) ? "Remove from favorites" : "Add to favorites"}
                                style={{
                                    cursor: "pointer",
                                    fontSize: "20px",
                                    color: isFavorited(bean) ? "#f5a623" : "#ccc"
                                }}
                            >
                                ★
                            </span>
                        )}
                    </div>
                    <p><b>Country:</b> {bean["Country.of.Origin"]}</p>
                    <p><b>Region:</b> {bean["Region"]}</p>
                    <p><b>Species:</b> {bean["Species"]}</p>
                    <p><b>Aroma:</b> {bean["Aroma"]}</p>
                    <p><b>Flavor:</b> {bean["Flavor"]}</p>
                    <p><b>Acidity:</b> {bean["Acidity"]}</p>
                    <p><b>Sweetness:</b> {bean["Sweetness"]}</p>
                    <p><b>Aftertaste:</b> {bean["Aftertaste"]}</p>
                </div>
            ))}


            {/* Bottom of page numbers (pagination) */}
            <div style={{display: "flex", gap: "10px", padding: "12px", justifyContent: "center"}}>
                {/*Left arrow button*/}
                <button onClick={() => setPage(page - 1)} disabled={page <= 1}>&lt;</button>
               
                {totalPages - page < 1 && page - 4 > 0 && <button onClick={() => setPage(page - 4)}>{page - 4}</button>}
                {totalPages - page < 2 && page - 3 > 0 && <button onClick={() => setPage(page - 3)}>{page - 3}</button>}
                
                {page - 2 > 0 && <button onClick={() => setPage(page - 2)}>{page - 2}</button>}
                {page - 1 > 0 && <button onClick={() => setPage(page - 1)}>{page - 1}</button>}

                 {/*Current page button*/}
                <button style={{fontWeight: "bold", border: "1.5px solid black", width: "30px", height: "35px"}}>{page}</button>
               
                {page + 1 <= totalPages && <button onClick={() => setPage(page + 1)}>{page + 1}</button>}
                {page + 2 <= totalPages && <button onClick={() => setPage(page + 2)}>{page + 2}</button>}
                {page + 3 <= totalPages && page < 3 && <button onClick={() => setPage(page + 3)}>{page + 3}</button>}
                {page + 4 <= totalPages && page < 2 && <button onClick={() => setPage(page + 4)}>{page + 4}</button>}
                
                 {/*Right arrow button*/}
                <button onClick={() => setPage(page + 1)} disabled={page >= totalPages}>&gt;</button>
            </div>
        </div>
    )
}