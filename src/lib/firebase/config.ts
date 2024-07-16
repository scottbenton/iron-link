import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export const firebaseConfig = {
	apiKey: import.meta.env.VITE_IRON_LINK_FIREBASE_APIKEY,
	authDomain: import.meta.env.VITE_IRON_LINK_FIREBASE_AUTHDOMAIN,
	projectId: import.meta.env.VITE_IRON_LINK_FIREBASE_PROJECTID,
	storageBucket: import.meta.env.VITE_IRON_LINK_FIREBASE_STORAGEBUCKET,
	messagingSenderId: import.meta.env.VITE_IRON_LINK_FIREBASE_MESSAGINGSENDERID,
	appId: import.meta.env.VITE_IRON_LINK_FIREBASE_APPID
};

export const app = initializeApp(firebaseConfig);

export const firestore = getFirestore(app);
export const auth = getAuth(app);
