import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAW3_Gk27xDC2A5H3Q9pbwIdTVz5YAUhdo",
    authDomain: "coffeemap-4341a.firebaseapp.com",
    projectId: "coffeemap-4341a",
    storageBucket: "coffeemap-4341a.firebasestorage.app",
    messagingSenderId: "913593723306",
    appId: "1:913593723306:web:4142374658cb2770c0e3d3",
    measurementId: "G-452YMXM11Z"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);