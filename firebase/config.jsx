import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// lite = CRUD, smaller in size

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyA7txWcuaoBoYcSpqTf4l3nKfiiV0C1BYs',
  authDomain: 'notebook-32257.firebaseapp.com',
  projectId: 'notebook-32257',
  storageBucket: 'notebook-32257.appspot.com',
  messagingSenderId: '943342600146',
  appId: '1:943342600146:web:c7f3d4dcdea750e2f4920b',
  measurementId: 'G-YD3HEKY8G3',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize firestore
export const db = getFirestore(app);

const auth = getAuth(app);

export { auth };




