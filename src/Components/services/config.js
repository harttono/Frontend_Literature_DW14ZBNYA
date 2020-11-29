import firebase from 'firebase';
import 'firebase/firebase';

const firebaseConfig = {
    apiKey: "AIzaSyACq1avK5O2cP5Qb8qkBix8dJaQkC6D8Ww",
    authDomain: "literature-49aab.firebaseapp.com",
    databaseURL: "https://literature-49aab.firebaseio.com",
    projectId: "literature-49aab",
    storageBucket: "literature-49aab.appspot.com",
    messagingSenderId: "794472590598",
    appId: "1:794472590598:web:647c100b7e6d3bee978287",
    measurementId: "G-W58X8LLV5S"
};

firebase.initializeApp(firebaseConfig);

const Storage = firebase.storage();

export {Storage}