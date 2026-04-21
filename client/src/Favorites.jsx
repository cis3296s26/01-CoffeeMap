import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getFavorites, removeFromFavorites, updateFavoriteRating } from './favoriteDB';
import StarRating from './StarRating';
import { useNavigate } from 'react-router-dom';

export default function Favorites() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [ratingFilter, setRatingFilter] = useState(0);

    const filteredFavorites = ratingFilter === 0
        ? favorites
        : favorites.filter(fav => (fav.rating || 0) === ratingFilter);

    // For pagination of favorites, show 9 items per page and 
    // have buttons to navigate between pages
    const [page, setPage] = useState(1);
    const itemsPerPage = 9;
    const totalPages = Math.ceil(filteredFavorites.length / itemsPerPage);
    const currentItems = filteredFavorites.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }
        const unsub = getFavorites(user.uid, (favs) => {
            setFavorites(favs);
            setLoading(false);
        });
        return () => unsub();
    }, [user]);

    if (!user) {
        return (
            <section className="container py-5 text-center" style={{ minHeight: '100vh', backgroundColor: '#e8e5da' }}>
                <h2>My Favorites</h2>
                <p>please log in to view your favorite coffee beans.</p>
            </section>
        );
    }

    if (loading) {
        return (
            <section className="container py-5 text-center" style={{ minHeight: '100vh', backgroundColor: '#e8e5da' }}>
                <h2>My Favorites</h2>
                <p>Loading your favorites...</p>
            </section>
        );
    }

    return (
        <section className="container-xl py-4" style={{ minHeight: '100vh' }}>
            <div className="text-center mb-4">
                <h1 className="display-5 fw-bold">My Favorites</h1>
                <p className="lead text-muted">
                    Your saved coffee beans and ratings.
                </p>
            </div>

            <div className="d-flex justify-content-center flex-wrap gap-2 mb-4">
                {[0, 5, 4, 3, 2, 1].map((star) => (
                    <button
                        key={star}
                        onClick={() => { setRatingFilter(star); setPage(1); }}
                        className={`btn ${
                            star === 0 
                                ? (ratingFilter === 0 ? 'btn-dark' : 'btn-outline-dark') 
                                : (ratingFilter === star ? 'btn-warning' : 'btn-outline-dark text-warning')
                        }`}
                        style={{
                            fontWeight: ratingFilter === star ? 'bold' : 'normal',
                            cursor: 'pointer'
                        }}
                                    >
                        {star === 0 ? 'All' : `${'★'.repeat(star)}`}
                    </button>
                ))}
            </div>

            {favorites.length === 0 ? (
                <div className="alert alert-danger text-center py-5 shadow-sm border-0">
                    <p>you haven't added any favorite coffee beans yet...</p>
                    <p>go to the <a href="/#/search">Search</a> page to add some!</p>
                </div>
            ) : (
                <>
                    <div className="row g-4">
                        {currentItems.map((fav, index) => (
                            <div key={index} style={{border:"2px solid black", margin:"15px", padding:"15px", borderRadius:"12px", backgroundColor:"white"}}>
                                <p><b>Country:</b> {fav.country}</p>
                                <p><b>Region:</b> {fav.region || 'Unknown'}</p>
                                <p><b>Species:</b> {fav.species || 'N/A'}</p>

                                {fav.variety && <p><b>Variety:</b> {fav.variety}</p>}
                                {fav.producer && <p><b>Producer:</b> {fav.producer}</p>}
                                {fav.farmName && <p><b>Farm:</b> {fav.farmName}</p>}
                                {fav.processingMethod && <p><b>Processing Method:</b> {fav.processingMethod}</p>}

                                <p><b>Aroma:</b> {fav.aroma || 'N/A'}</p>
                                <p><b>Flavor:</b> {fav.flavor || 'N/A'}</p>
                                <p><b>Aftertaste:</b> {fav.aftertaste || 'N/A'}</p>
                                <p><b>Acidity:</b> {fav.acidity || 'N/A'}</p>
                                <p><b>Body:</b> {fav.body || 'N/A'}</p>
                                <p><b>Balance:</b> {fav.balance || 'N/A'}</p>
                                <p><b>Uniformity:</b> {fav.uniformity || 'N/A'}</p>
                                <p><b>Cup Cleanliness:</b> {fav.cupCleanliness || 'N/A'}</p>
                                <p><b>Sweetness:</b> {fav.sweetness || 'N/A'}</p>
                                <p><b>Moisture:</b> {fav.moisture || 'N/A'}</p>
                                <p><b>Defects:</b> {fav.defects || 'N/A'}</p>
                                <p><b>Score:</b> {fav.score || 'N/A'}</p>

                                <div style={{ marginTop: '8px' }}>
                                    <StarRating
                                        rating={fav.rating || 0}
                                        onRate={(stars) => updateFavoriteRating(user.uid, fav.country, fav.region, stars)}
                                    />
                                    <br />
                                    <button onClick={() => removeFromFavorites(user.uid, { country: fav.country, region: fav.region })}>
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bottom of page numbers (pagination) */}
                    {totalPages > 1 && (
                        <nav className="mt-5">
                            <ul className="pagination justify-content-center flex-wrap">
                                {/* Left arrow button */}
                                <li className={`page-item ${page <= 1 ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => setPage(page - 1)} disabled={page <= 1}>
                                        &lt;
                                    </button>
                                </li>

                                {totalPages - page < 1 && page - 4 > 0 && <li className="page-item"><button className="page-link" onClick={() => setPage(page - 4)}>{page - 4}</button></li>}
                                {totalPages - page < 2 && page - 3 > 0 && <li className="page-item"><button className="page-link" onClick={() => setPage(page - 3)}>{page - 3}</button></li>}
                                
                                {page - 2 > 0 && <li className="page-item"><button className="page-link" onClick={() => setPage(page - 2)}>{page - 2}</button></li>}
                                {page - 1 > 0 && <li className="page-item"><button className="page-link" onClick={() => setPage(page - 1)}>{page - 1}</button></li>}

                                {/* Current page button */}
                                <li className="page-item active">
                                    <span className="page-link bg-dark border-dark" style={{ fontWeight: "bold" }}>{page}</span>
                                </li>

                                {page + 1 <= totalPages && <li className="page-item"><button className="page-link" onClick={() => setPage(page + 1)}>{page + 1}</button></li>}
                                {page + 2 <= totalPages && <li className="page-item"><button className="page-link" onClick={() => setPage(page + 2)}>{page + 2}</button></li>}
                                {page + 3 <= totalPages && page < 3 && <li className="page-item"><button className="page-link" onClick={() => setPage(page + 3)}>{page + 3}</button></li>}
                                {page + 4 <= totalPages && page < 2 && <li className="page-item"><button className="page-link" onClick={() => setPage(page + 4)}>{page + 4}</button></li>}
                                
                                {/* Right arrow button */}
                                <li className={`page-item ${page >= totalPages ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => setPage(page + 1)} disabled={page >= totalPages}>
                                        &gt;
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    )}
                </>
            )}
        </section>
    );
}