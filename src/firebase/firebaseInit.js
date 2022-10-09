import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB80-HaYUqMKE6H0A1hZQim58nDSxUEqbg",
  authDomain: "blog-61b4d.firebaseapp.com",
  projectId: "blog-61b4d",
  storageBucket: "blog-61b4d.appspot.com",
  messagingSenderId: "187882140907",
  appId: "1:187882140907:web:350393b665760c32dd7aae"
};


const firebaseApp = firebase.initializeApp(firebaseConfig);
const timestamp = firebase.firestore.FieldValue.serverTimestamp;

export { timestamp };
export default firebaseApp.firestore();