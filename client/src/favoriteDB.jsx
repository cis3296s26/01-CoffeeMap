import {db} from "./firebase"; 
import {doc, setDoc, deleteDoc, collection, onSnapshot} from "firebase/firestore";


//Save favorite options
export async function saveFavorite(userId, bean, countryStats = {}){
    const beanData = {
        country: bean["Country.of.Origin"] ?? '',
        region: bean["Region"] ?? '',
        species: bean["Species"] ?? '',
        variety: bean["Variety"] ?? '',
        producer: bean["Producer"] ?? '',
        farmName: bean["Farm.Name"] ?? '',
        processingMethod: bean["Processing.Method"] ?? '',
        aroma: bean["Aroma"] ?? '',
        flavor: bean["Flavor"] ?? '',
        aftertaste: bean["Aftertaste"] ?? '',
        acidity: bean["Acidity"] ?? '',
        body: bean["Body"] ?? '',
        balance: bean["Balance"] ?? '',
        uniformity: bean["Uniformity"] ?? '',
        cupCleanliness: bean["Cup Cleanliness"] ?? bean["Clean.Cup"] ?? '',
        sweetness: bean["Sweetness"] ?? '',
        moisture: bean["Moisture"] ?? '',
        defects: bean["Defects"] ?? '',
        score: bean["Total.Cup.Points"] ?? ''
    };
    const beanId = `${bean["Country.of.Origin"]}_${bean["Region"]}_${bean["Species"]}_${bean["Aroma"]}_${bean["Aftertaste"]}`
        .replace(/\s+/g, '_')
        .replace(/[^a-zA-Z0-9_]/g, '');
    await setDoc(doc(db, "users", userId, "favorites", beanId), beanData);
}

//Remove favorite options
export async function removeFromFavorites(userId, bean){
    const beanId = bean.docId;
    await deleteDoc(doc(db, "users", userId, "favorites", beanId));
}

//Get favorite options from spcecific user
export function getFavorites(userId, callback){
    const favoriteBeansRef = collection(db, "users", userId, "favorites");
    return onSnapshot(favoriteBeansRef, (snapshot) => {
        const favorites = snapshot.docs.map(doc => ({ ...doc.data(), docId: doc.id }))
        callback(favorites);
    })

}

//rate favorite out of 5 stars
export const updateFavoriteRating = async (userId, bean, rating) => {
    const beanId = bean.docId
    await setDoc(doc(db, 'users', userId, 'favorites', beanId), { rating }, { merge: true });
};