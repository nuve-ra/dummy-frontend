// common/firebase.js
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDvOEDJIRw7F_r0rTwzLRnmy0E34Y7a5ZQ",
    authDomain: "reactjs-blogging-website-68a8f.firebaseapp.com",
    projectId: "reactjs-blogging-website-68a8f",
    storageBucket: "reactjs-blogging-website-68a8f.appspot.com",
    messagingSenderId: "925893541279",
    appId: "1:925893541279:web:b19b7bd6d5abe24b7a91aa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
const auth = getAuth();

export const authWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        return { user: result.user }; // Return user data
    } catch (error) {
        console.error("Error during Google authentication:", error);
        throw new Error(error.message);
    }
};
