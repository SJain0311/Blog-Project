import {initializeApp} from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
import {getStorage} from 'firebase/storage';


const firebaseConfig = {
  apiKey: "AIzaSyAYhiNdG-6U-_hXFgstZ3n3vezq6VINmBQ",
  authDomain: "my-blogs-59964.firebaseapp.com",
  projectId: "my-blogs-59964",
  storageBucket: "my-blogs-59964.appspot.com",
  messagingSenderId: "172101185781",
  appId: "1:172101185781:web:db0ceb25cdc1bd02eed5bc"
};

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
export const db = getFirestore(app);
export const auth = getAuth(app);