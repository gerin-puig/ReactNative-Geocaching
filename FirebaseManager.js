import firebase from 'firebase/app'
import "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyAapx6f1dY03VQs6S2JhPjsey2WNwZhgRA",
    authDomain: "geocaching-42886.firebaseapp.com",
    databaseURL: "https://geocaching-42886.firebaseio.com",
    projectId: "geocaching-42886",
    storageBucket: "geocaching-42886.appspot.com",
    messagingSenderId: "328969019767",
    appId: "1:328969019767:web:ad2f21a3c90f7a2dafc172"
}

firebase.initializeApp(firebaseConfig)

export const db = firebase.firestore()