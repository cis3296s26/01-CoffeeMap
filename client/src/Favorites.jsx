import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getFavorites, removeFromFavorites, updateFavoriteRating } from './favoriteDB';
import StarRating from './StarRating';
import { useNavigate } from 'react-router-dom';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';



export default function Favorites() {
    const { user } = useAuth();
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [ratingFilter, setRatingFilter] = useState(0);

    const filteredFavorites = ratingFilter === 0
        ? favorites
        : favorites.filter(fav => (fav.rating || 0) === ratingFilter);

    // For pagination of favorites, show 9 items per page and 
    // have buttons to navigate between pages
    const [page, setPage] = useState(1);
    const itemsPerPage = 21;
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
                        {currentItems.map((fav, index) => {
                            const chartData = [
                                { subject: 'Aroma', A: Number(fav.aroma) || 0 },
                                { subject: 'Flavor', A: Number(fav.flavor) || 0 },
                                { subject: 'Aftertaste', A: Number(fav.aftertaste) || 0 },
                                { subject: 'Acidity', A: Number(fav.acidity) || 0 },
                                { subject: 'Body', A: Number(fav.body) || 0 },
                                { subject: 'Balance', A: Number(fav.balance) || 0 },
                                { subject: 'Uniformity', A: Number(fav.uniformity) || 0 },
                                { subject: 'Clean Cup', A: Number(fav.cleanCup) || 0 },
                                { subject: 'Sweetness', A: Number(fav.sweetness) || 0 },
                                { subject: 'Cupper Points', A: Number(fav.cupperPoints) || 0 },
                            ];

                            return (
                                <div className="col-md-6" key={fav.id}>
                                    <div style={{border:"2px solid black", margin:"15px", padding:"15px", borderRadius:"12px", backgroundColor:"white", height:"100%"}}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div>
                                                <h2 style={{ marginBottom: '4px' }}>{fav.country}</h2>
                                                <p style={{ color: '#666', marginBottom: '12px' }}>{fav.region || 'Unknown'}</p>
                                            </div>

                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <StarRating
                                                    rating={fav.rating || 0}
                                                    onRate={async (stars) => {
                                                        await updateFavoriteRating(user.uid, fav.country, fav.region, fav.species, fav.aroma, fav.aftertaste, stars);
                                                        if (ratingFilter !== 0 && ratingFilter !== stars) {
                                                            setRatingFilter(0);
                                                            setPage(1);
                                                        }
                                                    }}
                                                />
                                                <button
                                                    onClick={() => removeFromFavorites(user.uid, fav)}
                                                    style={{
                                                        border: '1px solid #ccc',
                                                        background: '#fff',
                                                        padding: '6px 12px',
                                                        borderRadius: '8px',
                                                        color: '#333',
                                                        cursor: 'pointer',
                                                        fontSize: '0.95rem',
                                                        lineHeight: 1.2
                                                    }}
                                                    title="Remove"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>

                                        <div style={{ marginBottom: '12px' }}>
                                            <span
                                                style={{
                                                    display: 'inline-block',
                                                    backgroundColor: '#212529',
                                                    color: 'white',
                                                    padding: '4px 12px',
                                                    borderRadius: '10px',
                                                    fontSize: '0.9rem',
                                                    fontWeight: '600'
                                                }}
                                            >
                                                {fav.species || 'Unknown'}
                                            </span>
                                        </div>

                                        <div style={{ width: '100%', height: 320 }}>
                                            <ResponsiveContainer width="100%" height="100%">
                                                <RadarChart data={chartData}>
                                                    <PolarGrid />
                                                    <PolarAngleAxis dataKey="subject" />
                                                    <PolarRadiusAxis domain={[0, 10]} tickCount={6} />
                                                    <Radar
                                                        name="Bean Metrics"
                                                        dataKey="A"
                                                        stroke="#8B4513"
                                                        fill="#8B4513"
                                                        fillOpacity={0.25}
                                                    />
                                                </RadarChart>
                                            </ResponsiveContainer>
                                        </div>

                                        <div style={{ marginTop: '16px' }}>
                                            <p><b>Total Cup Points:</b> {Number(fav.score || 0).toFixed(2)}</p>
                                            <p><b>Moisture:</b> {Number(fav.moisture || 0).toFixed(2)}</p>
                                            <p><b>Category One Defects:</b> {fav.categoryOneDefects ?? 0}</p>
                                            <p><b>Category Two Defects:</b> {fav.categoryTwoDefects ?? 0}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
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