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
                            <div className="col-md-6 col-xl-4" key={index}>
                                <div className="card shadow-sm border-0 h-100">
                                    <div className="card-body d-flex flex-column">
                                        
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <div>
                                                <h5 className="card-title mb-1">{fav.country || 'Unknown'}</h5>
                                                <p className="text-muted mb-0">{fav.region || 'Unknown'}</p>
                                            </div>
                                            
                                            {/* Top right interactive area for X and Stars */}
                                            <div className="d-flex flex-column align-items-end">
                                                <button
                                                    type="button"
                                                    className="btn btn-sm text-dark p-0 border-0 mb-1"
                                                    style={{ fontSize: '1.8rem', lineHeight: '0.8' }}
                                                    onClick={() => removeFromFavorites(user.uid, fav)}
                                                    title="Remove"
                                                >
                                                    &times;
                                                </button>
                                                <StarRating
                                                    rating={fav.rating || 0}
                                                    onRate={(stars) => updateFavoriteRating(user.uid, fav, stars)}
                                                />
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <span className="badge text-bg-dark">{fav.species || 'Unknown'}</span>
                                        </div>

                                        <div className="small mb-3">
                                            <p className="mb-1"><b>Aroma:</b> {fav.aroma || 'N/A'}</p>
                                            <p className="mb-1"><b>Flavor:</b> {fav.flavor || 'N/A'}</p>
                                            <p className="mb-1"><b>Acidity:</b> {fav.acidity || 'N/A'}</p>
                                            <p className="mb-1"><b>Sweetness:</b> {fav.sweetness || 'N/A'}</p>
                                            <p className="mb-0"><b>Score:</b> {fav.score || 'N/A'}</p>
                                        </div>

                                    </div>
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