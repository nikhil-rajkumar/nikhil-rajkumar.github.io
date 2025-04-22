// Your Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBmvjbJg6iPA2Cfp7hqHoHASY36Q2NOi3M",
    authDomain: "history-trivia-41187.firebaseapp.com",
    projectId: "history-trivia-41187",
    storageBucket: "history-trivia-41187.firebasestorage.app",
    messagingSenderId: "240138574064",
    appId: "1:240138574064:web:33ad4f85216bd35883ca35",
    measurementId: "G-706JKE67PQ"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get a reference to the database service
const database = firebase.database(); 