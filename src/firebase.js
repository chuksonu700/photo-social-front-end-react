import firebase from 'firebase'

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD1NFAuLetPCd5bEdu5sQPtMQbWTLm0X4M",
    authDomain: "photo-based-social.firebaseapp.com",
    projectId: "photo-based-social",
    storageBucket: "photo-based-social.appspot.com",
    messagingSenderId: "739346737381",
    appId: "1:739346737381:web:d887d7c77912f1fd5a4c0c",
    measurementId: "G-PF3MV0JFXG"
  };

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore()
const auth = firebase.auth()
const storage = firebase.storage();

export {db,auth, storage}