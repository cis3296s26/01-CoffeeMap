import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getFavorites, removeFromFavorites } from './favoriteDB';

export default function Favorites() {
    const { user } = useAuth();
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

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
            <section id="favorites">
                <h2>My Favorites</h2>
                <p>please log in to view your favorite coffee beans.</p>
            </section>
        );
    }
    if (loading) {
        return (
            <section id="favorites">
                <h2>My Favorites</h2>
                <p>Loading your favorites...</p>
            </section>
        );
    }

    if (favorites.length=== 0) {
        return (
            <section id="favorites">
                <h2>my Favorites</h2>
                <p>you haven't added any favorite coffee beans yet...</p>
                <p>go to the <a href="/#/search">Search</a> page to add some!</p>
            </section>
        );
    }

    return (
        <section id="favorites">
            <h2>My Favorites</h2>
            {favorites.map((fav, index) => (
                <div key={index} style={{ marginBottom: '15px' }}>
                    <p><b>Country:</b> {fav.country}</p>
                    <p><b>Region:</b> {fav.region}</p>
                    <p><b>Variety:</b> {fav.variety}</p>
                    <p><b>Aroma:</b> {fav.aroma}</p>
                    <p><b>Score:</b> {fav.score}</p>
                    <button onClick={() => removeFromFavorites(user.uid, { country: fav.country, region: fav.region })}>
                        Remove
                    </button>
                </div>
            ))}
        </section>
    );
}