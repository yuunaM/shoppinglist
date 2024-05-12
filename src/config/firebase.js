import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDs2wH0xcgufq6uvDsVYNOOXdDzsTY_vY4",
    authDomain: "shoppinglistapp-c50c8.firebaseapp.com",
    projectId: "shoppinglistapp-c50c8",
    storageBucket: "shoppinglistapp-c50c8.appspot.com",
    messagingSenderId: "795414434670",
    appId: "1:795414434670:web:3db6704aecf1a61381277f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export default db