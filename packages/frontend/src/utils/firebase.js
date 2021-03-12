import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCHS0zrAihW4oiiS1BBZ_CBz8jE6h9eLqc",
  authDomain: "auth-b09a3.firebaseapp.com",
  projectId: "auth-b09a3",
  storageBucket: "auth-b09a3.appspot.com",
  messagingSenderId: "706305928290",
  appId: "1:706305928290:web:6678c4d208cbb428e2f53b",
};

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const firestore = firebase.firestore();
