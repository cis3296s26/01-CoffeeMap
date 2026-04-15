import {db} from "./firebase"; 
import {doc, setDoc, deleteDoc, collection, onSnapshot} from "firebase/firestore";


//Save favorite options
export async function saveFavorite(userId, bean){
    const beanData = {
        country: bean["Country.of.Origin"] ?? '',
        region: bean["Region"] ?? '',
        species: bean["Species"] ?? '',
        aroma: bean["Aroma"] ?? '',
        flavor: bean["Flavor"] ?? '',
        acidity: bean["Acidity"] ?? '',
        sweetness: bean["Sweetness"] ?? '',
        aftertaste: bean["Aftertaste"] ?? '',
        score: bean["Total.Cup.Points"] ?? ''
    }
    const beanId = `${bean["Country.of.Origin"]}_${bean["Region"]}`.replace(/\s+/g, '_');
    await setDoc(doc(db, "users", userId, "favorites", beanId), beanData);
}

//Remove favorite options
export async function removeFromFavorites(userId, bean){
    const favoriteBean = `${bean["country"]}_${bean["region"]}`.replace(/\s+/g, '_');
    await deleteDoc(doc(db, "users", userId, "favorites", favoriteBean));
}

//Get favorite options from spcecific user
export function getFavorites(userId, callback){
    const favoriteBeansRef = collection(db, "users", userId, "favorites");
    return onSnapshot(favoriteBeansRef, (snapshot) => {
        const favorites = snapshot.docs.map(doc => doc.data())
        callback(favorites);
    })

}

//rate favorite out of 5 stars
export const updateFavoriteRating = async (userId, country, region, rating) => {
    const beanId = `${country}_${region}`.replace(/\s+/g, '_');
    await setDoc(doc(db, 'users', userId, 'favorites', beanId), { rating }, { merge: true });
};