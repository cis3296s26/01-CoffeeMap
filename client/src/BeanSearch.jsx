import { useState } from 'react'
import { useEffect } from 'react'
import Papa from 'papaparse'
import { useAuth } from './AuthContext'
import { getFavorites, saveFavorite, removeFromFavorites } from './favoriteDB'

export default function BeanSearch() {
    // initialize variables
    const [beans, setBeans] = useState([])
    const [query, setQuery] = useState("")
    const [showFilters, setShowFilters] = useState(false)

    const[filters, setFilters] = useState({
        country: [],
        region: [],
        aroma: [],
        species: [],
        sortBy: '',
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
        const matchCountry = filters.country.length === 0 || filters.country.includes(bean["Country.of.Origin"])
        const matchRegion = filters.region.length === 0 || filters.region.includes(bean["Region"])
        const matchAroma = filters.aroma.length === 0 || filters.aroma.includes(bean["Aroma"])
        const matchSpecies = filters.species.length === 0 || filters.species.includes(bean["Species"])
        const matchScore = !filters.minScore || parseFloat(bean["Total.Cup.Points"]) >= filters.minScore
        const matchFlavor = !filters.minFlavor || parseFloat(bean["Flavor"]) >= parseFloat(filters.minFlavor)
        const matchAcidity = !filters.minAcidity || parseFloat(bean["Acidity"]) >= parseFloat(filters.minAcidity)
        const matchSweetness = !filters.minSweetness || parseFloat(bean["Sweetness"]) >= parseFloat(filters.minSweetness)
        return matchCountry && matchRegion && matchAroma && matchSpecies && matchScore && matchFlavor && matchAcidity && matchSweetness
    }

    // search through database using search bar input
    const filtered = beans.filter((bean) => {
        const matchSearch = 
            bean["Country.of.Origin"]?.includes(query) ||
            bean["Region"]?.includes(query) ||
            bean["Variety"]?.includes(query)
        return matchSearch && applyFilters(bean)
    })

    //sort function
    const sorted = [...filtered].sort((a,b) => {
        if(filters.sortBy === "az") return a["Country.of.Origin"].localeCompare(b["Country.of.Origin"])
        if(filters.sortBy === "za") return b["Country.of.Origin"].localeCompare(a["Country.of.Origin"])
        return 0
    })    
    const totalPages = Math.ceil(sorted.length / itemsPerPage)
    const currentItems = sorted.slice((page - 1) * itemsPerPage, page * itemsPerPage)
    
    //Available region based on selected country and species filters
    const availableRegions = [...new Set(
        beans
            .filter(b => filters.country.length === 0 || filters.country.includes(b["Country.of.Origin"]))
            .filter(b => filters.species.length === 0 || filters.species.includes(b["Species"]))
            .map(b => b["Region"])
            .filter(Boolean)
    )].sort()
    
    //Available countries based on selected species filters  
    const availableCountries = [...new Set(
        beans
            .filter(b => filters.species.length === 0 || filters.species.includes(b["Species"]))
            .map(b => b["Country.of.Origin"])
            .filter(Boolean)
    )].sort()

    //Available species based on selected country and region filters 
    const availableSpecies = [...new Set(
        beans
            .filter(b => filters.country.length === 0 || filters.country.includes(b["Country.of.Origin"]))
            .filter(b => filters.region.length === 0 || filters.region.includes(b["Region"]))
            .map(b => b["Species"])
            .filter(Boolean)
    )].sort()

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
                <button onClick={() => setShowFilters(!showFilters)} style={{color: "white", backgroundColor: "transparent", border: "1px solid white", padding: "5px 10px", cursor: "pointer"}}>
                    {showFilters ? "Close Filters" : "Filter"}
                </button>
                <button onClick={() => {setQuery(""); setFilters({country: [], region: [], aroma: [], species: [], sortBy: '', minScore: 0, minFlavor: 0, minAcidity: 0, minSweetness: 0})}}>
                    Clear Search
                </button>
            </div>

            {/* Side filter panel */}
            {showFilters && (
                //Side panel style
                <div style={{position: "fixed", right: 0, top: 0, height: "100%", width: "350px", backgroundColor: "#ffffff", boxShadow: "-2px 0 5px #0000004d", padding: "20px", overflowY: "auto", zIndex: 1000}}>
                    <h3>Filters</h3>

                    {/* Sort */}
                    <label><b>Sort by Country:</b></label>
                    <select value={filters.sortBy} onChange={(e) => setFilters({...filters, sortBy: e.target.value})} style={{width: "100%", marginBottom: "20px"}}>
                        <option value="">Sort Filter</option>
                        <option value="az">A to Z</option>
                        <option value="za">Z to A</option>
                    </select>

                    {/* Country */}
                    <label><b>Country:</b></label>
                    <div style={{maxHeight: "150px", overflowY: "auto", border: "2px solid #431e1e", marginBottom: "15px"}}>
                        {availableCountries.map((c, i) => (
                            <div key={i}
                                onClick={() => {
                                    const updated = filters.country.includes(c)
                                        ? filters.country.filter(x => x !== c)
                                        : [...filters.country, c]
                                    setFilters({...filters, country: updated})
                                }}
                                //Inside style of country filter options
                                style={{padding: "4px 8px", cursor: "pointer", backgroundColor: filters.country.includes(c) ? "#1a73e8" : "#ffffff", color: filters.country.includes(c) ? "white" : "black"}}>
                                {filters.country.includes(c) ? "✓ " : "☐ "}{c}
                            </div>
                        ))}
                    </div>

                    {/* Region */}
                    <label><b>Region:</b></label>
                    <div style={{maxHeight: "150px", overflowY: "auto", border: "2px solid #431e1e", marginBottom: "15px"}}>
                        {availableRegions.map((r, i) => (
                            <div key={i}
                                onClick={() => {
                                    const updated = filters.region.includes(r)
                                        ? filters.region.filter(x => x !== r)
                                        : [...filters.region, r]
                                    setFilters({...filters, region: updated})
                                }}
                                style={{padding: "4px 8px", cursor: "pointer", backgroundColor: filters.region.includes(r) ? "#1a73e8" : "white", color: filters.region.includes(r) ? "white" : "black"}}>
                                {filters.region.includes(r) ? "✓ " : "☐ "}{r}
                            </div>
                        ))}
                    </div>

                    {/* Species */}
                    <label><b>Species:</b></label>
                    <div style={{maxHeight: "100px", overflowY: "auto", border: "2px solid #431e1e", marginBottom: "15px"}}>
                        {availableSpecies.map((s, i) => (
                            <div key={i}
                                onClick={() => {
                                    const updated = filters.species.includes(s)
                                        ? filters.species.filter(x => x !== s)
                                        : [...filters.species, s]
                                    setFilters({...filters, species: updated})
                                }}
                                style={{padding: "4px 8px", cursor: "pointer", backgroundColor: filters.species.includes(s) ? "#1a73e8" : "white", color: filters.species.includes(s) ? "white" : "black"}}>
                                {filters.species.includes(s) ? "✓ " : "☐ "}{s}
                            </div>
                        ))}
                    </div>

                    <button onClick={() => setShowFilters(false)} style={{width: "100%", padding: "5px", marginTop: "20px"}}>
                        Close
                    </button>
                </div>
            )}

            {/* display search results */}

            {/* display search results */}
            {currentItems.map((bean, index)=>(
                <div key={index} style={{border:"2px solid black", margin:"15px", padding:"15px"}}>
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