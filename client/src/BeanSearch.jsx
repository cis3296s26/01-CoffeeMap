import { useState } from 'react'
import { useEffect } from 'react'
import Papa from 'papaparse'
import { useAuth } from './AuthContext'
import { getFavorites, saveFavorite, removeFromFavorites } from './favoriteDB'
import { useNavigate } from 'react-router-dom'

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
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false);

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

    useEffect(() => {
        setPage(1);
    }, [query, filters]);

    const getBeanId = (bean) => `${bean["Country.of.Origin"]}_${bean["Region"]}`.replace(/\s+/g, '_')

    const isFavorited = (bean) => favorites.includes(getBeanId(bean))

    const Popup = ({ isOpen, onClose, children }) => {
        if (!isOpen) return null;
        //children is what's inside PopUp tags, &times creates X button to close popup
        return (
            <div 
                className="modal d-block"
                tabIndex="-1"
                style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content border-0 shadow">
                        <div className="modal-body text-center p-4">
                            {children}
                        </div>
                        <div className="modal-footer border-0 pt-0 justify-content-center">
                            <button 
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={onClose}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const toggleFavorite = async (bean) => {
        if (!user){
            setIsOpen(true);
        } else if (isFavorited(bean)) {
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
        const lowquery = query.toLowerCase();
        const matchSearch =
            bean["Country.of.Origin"]?.toLowerCase().includes(lowquery) ||
            bean["Region"]?.toLowerCase().includes(lowquery) ||
            bean["Variety"]?.toLowerCase().includes(lowquery);

        return matchSearch && applyFilters(bean);
    });

    //sort function
    const sorted = [...filtered].sort((a,b) => {
        if(filters.sortBy === "az") return a["Country.of.Origin"].localeCompare(b["Country.of.Origin"])
        if(filters.sortBy === "za") return b["Country.of.Origin"].localeCompare(a["Country.of.Origin"])
        return 0
    })    
    const totalPages = Math.max(1, Math.ceil(sorted.length / itemsPerPage));
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

    const clearAll = () => {
    setQuery('');
    setFilters({
        country: [],
        region: [],
        aroma: [],
        species: [],
        sortBy: '',
        minScore: 0,
        minFlavor: 0,
        minAcidity: 0,
        minSweetness: 0,
    });
    setPage(1);
};

const toggleArrayFilter = (key, value) => {
    const updated = filters[key].includes(value)
        ? filters[key].filter((x) => x !== value)
        : [...filters[key], value];

    setFilters({ ...filters, [key]: updated });
};

    // frontend design
    return (
        <section className="container-xl py-4">
            <div className="text-center mb-4">
                <h1 className="display-5 fw-bold">Bean Search</h1>
                <p className="lead text-muted">
                    Explore beans by origin, species, etc.
                </p>
            </div>

            <div className="card shadow-sm border-0 mb-4">
                <div className="card-body">
                    <div className="row g-3 align-items-end">
                        <div className="col-lg-8">
                            <label className="form-label">Search beans</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search by country, region, variety"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>

                        <div className="col-sm-6 col-lg-2">
                            <button
                                type="button"
                                className="btn btn-outline-secondary w-100"
                                onClick={() => setShowFilters(true)}
                            >
                                Filters
                            </button>
                        </div>

                        <div className="col-sm-6 col-lg-2">
                            <button
                                type="button"
                                className="btn btn-outline-danger w-100"
                                onClick={clearAll}
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="mb-0">Results</h4>
                <span className="text-muted">
                    {sorted.length} bean{sorted.length !== 1 ? 's' : ''} found
                </span>
            </div>

            {currentItems.length === 0 ? (
                <div className="alert alert-warning">
                    No beans matched your search and filter settings.
                </div>
            ) : (
                <div className="row g-4">
                    {currentItems.map((bean, index) => (
                        <div className="col-md-6 col-xl-4" key={index}>
                            <div className="card shadow-sm border-0 h-100">
                                <div className="card-body d-flex flex-column">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div>
                                            <h5 className="card-title mb-1">
                                                {bean['Country.of.Origin'] || 'Unknown Country'}
                                            </h5>
                                            <p className="text-muted mb-0">
                                                {bean['Region'] || 'Unknown Region'}
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            className={`btn btn-sm ${
                                                isFavorited(bean)
                                                    ? 'btn-warning'
                                                    : 'btn-outline-secondary'
                                            }`}
                                            onClick={() => toggleFavorite(bean)}
                                            title={
                                                isFavorited(bean)
                                                    ? 'Remove from favorites'
                                                    : 'Add to favorites'
                                            }
                                        >
                                            ★
                                        </button>
                                    </div>

                                    <div className="mb-3">
                                        <span className="badge text-bg-light me-2">
                                            {bean['Species'] || 'Unknown Species'}
                                        </span>
                                        {bean['Variety'] && (
                                            <span className="badge text-bg-secondary">
                                                {bean['Variety']}
                                            </span>
                                        )}
                                    </div>

                                    <div className="small">
                                        <p className="mb-2">
                                            <strong>Aroma:</strong> {bean['Aroma'] || 'N/A'}
                                        </p>
                                        <p className="mb-2">
                                            <strong>Flavor:</strong> {bean['Flavor'] || 'N/A'}
                                        </p>
                                        <p className="mb-2">
                                            <strong>Acidity:</strong> {bean['Acidity'] || 'N/A'}
                                        </p>
                                        <p className="mb-2">
                                            <strong>Sweetness:</strong> {bean['Sweetness'] || 'N/A'}
                                        </p>
                                        <p className="mb-2">
                                            <strong>Aftertaste:</strong> {bean['Aftertaste'] || 'N/A'}
                                        </p>
                                        <p className="mb-0">
                                            <strong>Total Cup Points:</strong>{' '}
                                            {bean['Total.Cup.Points'] || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <nav className="mt-4">
                <ul className="pagination justify-content-center flex-wrap">
                    <li className={`page-item ${page <= 1 ? 'disabled' : ''}`}>
                        <button
                            className="page-link"
                            onClick={() => setPage(page - 1)}
                            disabled={page <= 1}
                        >
                            Previous
                        </button>
                    </li>

                    {page - 2 > 0 && (
                        <li className="page-item">
                            <button className="page-link" onClick={() => setPage(page - 2)}>
                                {page - 2}
                            </button>
                        </li>
                    )}

                    {page - 1 > 0 && (
                        <li className="page-item">
                            <button className="page-link" onClick={() => setPage(page - 1)}>
                                {page - 1}
                            </button>
                        </li>
                    )}

                    <li className="page-item active">
                        <span className="page-link">{page}</span>
                    </li>

                    {page + 1 <= totalPages && (
                        <li className="page-item">
                            <button className="page-link" onClick={() => setPage(page + 1)}>
                                {page + 1}
                            </button>
                        </li>
                    )}

                    {page + 2 <= totalPages && (
                        <li className="page-item">
                            <button className="page-link" onClick={() => setPage(page + 2)}>
                                {page + 2}
                            </button>
                        </li>
                    )}

                    <li className={`page-item ${page >= totalPages ? 'disabled' : ''}`}>
                        <button
                            className="page-link"
                            onClick={() => setPage(page + 1)}
                            disabled={page >= totalPages}
                        >
                            Next
                        </button>
                    </li>
                </ul>
            </nav>

            {showFilters && (
                <>
                    <div
                        className="offcanvas offcanvas-end show"
                        tabIndex="-1"
                        style={{ visibility: 'visible', width: '360px' }}
                    >
                        <div className="offcanvas-header">
                            <h5 className="offcanvas-title">Filters</h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={() => setShowFilters(false)}
                            ></button>
                        </div>

                        <div className="offcanvas-body">
                            <div className="mb-4">
                                <label className="form-label fw-semibold">
                                    Sort by Country
                                </label>
                                <select
                                    className="form-select"
                                    value={filters.sortBy}
                                    onChange={(e) =>
                                        setFilters({ ...filters, sortBy: e.target.value })
                                    }
                                >
                                    <option value="">Sort Filter</option>
                                    <option value="az">A to Z</option>
                                    <option value="za">Z to A</option>
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-semibold">Country</label>
                                <div className="border rounded p-2" style={{ maxHeight: '160px', overflowY: 'auto' }}>
                                    {availableCountries.map((c, i) => (
                                        <div className="form-check" key={i}>
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id={`country-${i}`}
                                                checked={filters.country.includes(c)}
                                                onChange={() => toggleArrayFilter('country', c)}
                                            />
                                            <label
                                                className="form-check-label"
                                                htmlFor={`country-${i}`}
                                            >
                                                {c}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-semibold">Region</label>
                                <div className="border rounded p-2" style={{ maxHeight: '160px', overflowY: 'auto' }}>
                                    {availableRegions.map((r, i) => (
                                        <div className="form-check" key={i}>
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id={`region-${i}`}
                                                checked={filters.region.includes(r)}
                                                onChange={() => toggleArrayFilter('region', r)}
                                            />
                                            <label
                                                className="form-check-label"
                                                htmlFor={`region-${i}`}
                                            >
                                                {r}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-semibold">Species</label>
                                <div className="border rounded p-2" style={{ maxHeight: '120px', overflowY: 'auto' }}>
                                    {availableSpecies.map((s, i) => (
                                        <div className="form-check" key={i}>
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id={`species-${i}`}
                                                checked={filters.species.includes(s)}
                                                onChange={() => toggleArrayFilter('species', s)}
                                            />
                                            <label
                                                className="form-check-label"
                                                htmlFor={`species-${i}`}
                                            >
                                                {s}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="row g-3">
                                <div className="col-6">
                                    <label className="form-label fw-semibold">Min Score</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={filters.minScore}
                                        onChange={(e) =>
                                            setFilters({
                                                ...filters,
                                                minScore: Number(e.target.value) || 0,
                                            })
                                        }
                                    />
                                </div>

                                <div className="col-6">
                                    <label className="form-label fw-semibold">Min Flavor</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={filters.minFlavor}
                                        onChange={(e) =>
                                            setFilters({
                                                ...filters,
                                                minFlavor: Number(e.target.value) || 0,
                                            })
                                        }
                                    />
                                </div>

                                <div className="col-6">
                                    <label className="form-label fw-semibold">Min Acidity</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={filters.minAcidity}
                                        onChange={(e) =>
                                            setFilters({
                                                ...filters,
                                                minAcidity: Number(e.target.value) || 0,
                                            })
                                        }
                                    />
                                </div>

                                <div className="col-6">
                                    <label className="form-label fw-semibold">Min Sweetness</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={filters.minSweetness}
                                        onChange={(e) =>
                                            setFilters({
                                                ...filters,
                                                minSweetness: Number(e.target.value) || 0,
                                            })
                                        }
                                    />
                                </div>
                            </div>

                            <div className="d-grid gap-2 mt-4">
                                <button
                                    type="button"
                                    className="btn btn-outline-danger"
                                    onClick={clearAll}
                                >
                                    Clear All
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => setShowFilters(false)}
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    </div>

                    <div
                        className="offcanvas-backdrop fade show"
                        onClick={() => setShowFilters(false)}
                    ></div>
                </>
            )}

            <Popup isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <p className="mb-4">Please sign up or log in to save favorites.</p>
                <div className="d-flex justify-content-center gap-3">
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate('/signup')}
                    >
                        Sign Up
                    </button>
                    <button
                        className="btn btn-outline-secondary"
                        onClick={() => navigate('/login')}
                    >
                        Log In
                    </button>
                </div>
            </Popup>
        </section>
    );
}