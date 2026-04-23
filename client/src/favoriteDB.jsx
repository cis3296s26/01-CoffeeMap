import {db} from "./firebase"; 
import {doc, setDoc, deleteDoc, collection, onSnapshot} from "firebase/firestore";

export function normalizeBeanId(bean = {}) {
  return [
    bean["Country.of.Origin"] ?? bean.country ?? "",
    bean["Region"] ?? bean.region ?? "Unknown",
    bean["Species"] ?? bean.species ?? "",
    bean["Variety"] ?? bean.variety ?? "",
    bean["Producer"] ?? bean.producer ?? "",
    bean["Farm.Name"] ?? bean.farmName ?? "",
    bean["Processing.Method"] ?? bean.processingMethod ?? "",
    bean["Aroma"] ?? bean["Fragrance...Aroma"] ?? bean.aroma ?? "",
    bean["Aftertaste"] ?? bean.aftertaste ?? "",
    bean["Total.Cup.Points"] ?? bean.score ?? ""
  ]
    .map(v => String(v).trim())
    .join("_")
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_]/g, "");
}

function getCleanCup(bean) {
  return bean["Clean.Cup"] ?? bean["Uniform.Cup"] ?? bean["Cup Cleanliness"] ?? "";
}

function getAcidity(bean) {
  return bean["Acidity"] ?? bean["Salt...Acid"] ?? "";
}

function getSweetness(bean) {
  return bean["Sweetness"] ?? bean["Bitter...Sweet"] ?? "";
}

function getBody(bean) {
  return bean["Body"] ?? bean["Mouthfeel"] ?? "";
}

function getAroma(bean) {
  return bean["Aroma"] ?? bean["Fragrance...Aroma"] ?? "";
}

//Save favorite options
export async function saveFavorite(userId, bean){
    const country = bean["Country.of.Origin"] ?? "";
    const region = bean["Region"] ?? "Unknown";
    const species = bean["Species"] ?? "";
    const aroma = getAroma(bean);
    const aftertaste = bean["Aftertaste"] ?? "";

    const beanId = normalizeBeanId(bean);
    
    const beanData = {
        id: beanId,
        country,
        region,
        species: bean["Species"] ?? '',
        variety: bean["Variety"] ?? '',
        producer: bean["Producer"] ?? '',
        farmName: bean["Farm.Name"] ?? '',
        processingMethod: bean["Processing.Method"] ?? '',
        aroma: getAroma(bean),
        flavor: bean["Flavor"] ?? "",
        aftertaste: bean["Aftertaste"] ?? "",
        acidity: getAcidity(bean),
        body: getBody(bean),
        balance: bean["Balance"] ?? "",
        uniformity: bean["Uniformity"] ?? "",
        cleanCup: getCleanCup(bean),
        sweetness: getSweetness(bean),
        cupperPoints: bean["Cupper.Points"] ?? "",
        score: bean["Total.Cup.Points"] ?? "",
        moisture: bean["Moisture"] ?? "",
        categoryOneDefects: bean["Category.One.Defects"] ?? 0,
        categoryTwoDefects: bean["Category.Two.Defects"] ?? 0,
        rating: bean.rating ?? 0
    };
    await setDoc(doc(db, "users", userId, "favorites", beanId), beanData);
}

//Remove favorite options
export async function removeFromFavorites(userId, bean){
    const beanId = bean.id;
    await deleteDoc(doc(db, "users", userId, "favorites", beanId));
}

//Get favorite options from spcecific user
export function getFavorites(userId, callback){
    const favoriteBeansRef = collection(db, "users", userId, "favorites");
    return onSnapshot(favoriteBeansRef, (snapshot) => {
        const favorites = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data()
            }));
            callback(favorites);
    })

}

//rate favorite out of 5 stars
export const updateFavoriteRating = async (userId, country, region, species, aroma, aftertaste, rating) => {
    const beanId = normalizeBeanId(country, region, species, aroma, aftertaste);
  await setDoc(
    doc(db, "users", userId, "favorites", beanId),
    { rating },
    { merge: true }
  );
};