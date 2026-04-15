import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getFavorites, removeFromFavorites } from './favoriteDB';
import StarRating from './StarRating';
import { updateFavoriteRating } from './favoriteDB';

export default function Favorites() {
    const { user } = useAuth();
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [ratingFilter, setRatingFilter] = useState(0);

    const filteredFavorites = ratingFilter === 0
        ? favorites
        : favorites.filter(fav => (fav.rating || 0) === ratingFilter);

    //For pagination of favorites, show 10 items per page and 
    // have buttons to navigate between pages
    const [page, setPage] = useState(1);
    const itemsPerPage = 10;
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
            <section id="favorites"style={{ padding: '20px',  backgroundColor: '#e8e5da', minHeight: '100vh', boxSizing: 'border-box' , display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center'}}>
                <h2>My Favorites</h2>
                <p>please log in to view your favorite coffee beans.</p>
            </section>
        );
    }
    if (loading) {
        return (
            <section id="favorites" >
                <h2>My Favorites</h2>
                <p>Loading your favorites...</p>
            </section>
        );
    }

    if (favorites.length === 0) {
        return (
            <section id="favorites" >
                <h2>My Favorites</h2>
                <p>you haven't added any favorite coffee beans yet...</p>
                <p>go to the <a href="/#/search">Search</a> page to add some!</p>
            </section>
        );
    }

    return (
        <section id="favorites" >
            <h1 >My Favorites</h1>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '0 15px 16px' }}>
                {[0, 5, 4, 3, 2, 1].map((star) => (
                    <button
                        key={star}
                        onClick={() => { setRatingFilter(star); setPage(1); }}
                        style={{
                            fontWeight: ratingFilter === star ? 'bold' : 'normal',
                            border: ratingFilter === star ? '2px solid black' : '1px solid #ccc',
                            borderRadius: '6px',
                            padding: '4px 12px',
                            cursor: 'pointer',
                            background: 'white',
                        }}
                    >
                        {star === 0 ? 'All' : `${'★'.repeat(star)}`}
                    </button>
                ))}
            </div>

            {currentItems.map((fav, index) => (
                <div key={index} style={{border:"2px solid black", margin:"15px", padding:"15px"}}>
                    <p><b>Country:</b> {fav.country}</p>
                    <p><b>Region:</b> {fav.region}</p>
                    <p><b>Species:</b> {fav.species}</p>
                    <p><b>Aroma:</b> {fav.aroma}</p>
                    <p><b>Flavor:</b> {fav.flavor}</p>
                    <p><b>Acidity:</b> {fav.acidity}</p>
                    <p><b>Sweetness:</b> {fav.sweetness}</p>
                    <p><b>Score:</b> {fav.score}</p>
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
        </section>
    );
    
}