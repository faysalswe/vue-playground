import firebase from "firebase/app";
import "firebase/database";

var config = {
  apiKey: "AIzaSyA2NkeyRp6pp-ecSqrVi4L4MKeJBY95Vzw",
  authDomain: "vue-firebase-d1c23.firebaseapp.com",
  databaseURL: "https://vue-firebase-d1c23.firebaseio.com",
  projectId: "vue-firebase-d1c23",
  storageBucket: "vue-firebase-d1c23.appspot.com",
  messagingSenderId: "184259396310",
  appId: "1:184259396310:web:be2d64c7b6a4bcbaf8ff77"
};
firebase.initializeApp(config);

export const database = firebase.database();
export const roomRef = database.ref("rooms");
