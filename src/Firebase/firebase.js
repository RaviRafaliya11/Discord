import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBvi6kqAI5iMJeZiro65ShQSUJqwg_X0e4",
  authDomain: "discord-846c0.firebaseapp.com",
  projectId: "discord-846c0",
  storageBucket: "discord-846c0.appspot.com",
  messagingSenderId: "146230615331",
  appId: "1:146230615331:web:4c962b2ac9efdea3de4096",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
