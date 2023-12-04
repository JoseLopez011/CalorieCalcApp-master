 // Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';


const firebaseConfig = {
    apiKey: "AIzaSyBhBVkqA0fvpT57qjA5cQ0QMcupjlDj3es",
    authDomain: "caloriecounterapp-2f7cd.firebaseapp.com",
    projectId: "caloriecounterapp-2f7cd",
    storageBucket: "caloriecounterapp-2f7cd.appspot.com",
    messagingSenderId: "375790161151",
    appId: "1:375790161151:web:ce4727d39e8b86a92950ca",
    measurementId: "G-X7RWKC0JQF"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const fetchUserData = async (userId) => {
    try {
        const userDocRef = doc(db, 'users', userId);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
            return userDocSnapshot.data();
        } else {
            // If the user document doesn't exist, create one
            await setDoc(userDocRef, { /* Initial user data goes here */ });

            // Fetch the newly created user document
            const newUserDocSnapshot = await getDoc(userDocRef);
            return newUserDocSnapshot.data();
        }
    } catch (error) {
        throw new Error(`Error fetching user data: ${error.message}`);
    }
};

export { app, auth, fetchUserData };