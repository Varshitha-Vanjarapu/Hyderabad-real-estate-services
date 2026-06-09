import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyA-AH7Xr3iWIe4wJqVPd0hI_p_HcIFbdsU",
    authDomain: "hyderabad-real-estate-services.firebaseapp.com",
    projectId: "hyderabad-real-estate-services",
    storageBucket: "hyderabad-real-estate-services.firebasestorage.app",
    messagingSenderId: "100895830660",
    appId: "1:100895830660:web:23a297884570f6fbc0c8d1",
    measurementId: "G-TCK6VKYW45"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);