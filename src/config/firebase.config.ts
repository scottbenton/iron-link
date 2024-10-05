import { FirebaseOptions, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  Firestore,
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

const firebaseConfig: FirebaseOptions = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTHDOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECTID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_FIREBASE_APPID,
};

export const projectId = firebaseConfig.projectId;

export const firebaseApp = initializeApp(firebaseConfig);

export const firebaseAuth = getAuth(firebaseApp);

let hasInitializedFirestore = false;
export const firestore = getOrInitializeFirestore();

export const storage = getStorage(firebaseApp);

export const functions = getFunctions(firebaseApp);

function getOrInitializeFirestore(): Firestore {
  if (!hasInitializedFirestore) {
    hasInitializedFirestore = true;
    return initializeFirestore(firebaseApp, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager(),
      }),
    });
  } else {
    return getFirestore();
  }
}
