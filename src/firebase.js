// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyBRfY0xdSNcot0YJhb4s_BQj8-Bl9GLBqY",
	authDomain: "experiment-a9d0d.firebaseapp.com",
	projectId: "experiment-a9d0d",
	storageBucket: "experiment-a9d0d.firebasestorage.app",
	messagingSenderId: "1053611852720",
	appId: "1:1053611852720:web:be9741ce1f9bfee99e8c75",
	measurementId: "G-84SVWSDRTN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const db = getFirestore(app);
export { db };
