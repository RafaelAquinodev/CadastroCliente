import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyD55I33RHhwOtCdRoOKm40TVMuzXla7fCs",
    authDomain: "usercadastro-625da.firebaseapp.com",
    projectId: "usercadastro-625da",
    storageBucket: "usercadastro-625da.appspot.com",
    messagingSenderId: "288994400174",
    appId: "1:288994400174:web:d9f939cbdbb5c87f25da3f",
    measurementId: "G-WBRV3GWJM2"
  };

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
const provider = new GoogleAuthProvider(firebaseApp);

export {db, auth, provider};