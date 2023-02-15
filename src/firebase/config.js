// Import the functions you need from the SDKs you need

import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
// import "firebase/auth";
// import "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAszvws9bqn5pmlaM9ZLVniOOAXKntq8xE",
  authDomain: "chat-app-4db03.firebaseapp.com",
  projectId: "chat-app-4db03",
  storageBucket: "chat-app-4db03.appspot.com",
  messagingSenderId: "384925565951",
  appId: "1:384925565951:web:3c5cbc769908e7dd611dca",
};

firebase.initializeApp(firebaseConfig); // Initialize Firebase

// const auth = getAuth(app)
const auth = firebase.auth();
const db = firebase.firestore();

auth.useEmulator("http://localhost:9099/");
if (window.location.hostname === "localhost") {
  db.useEmulator("localhost", "8080");
}

export { db, auth };
export default firebase;
