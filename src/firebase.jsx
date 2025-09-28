import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDTHwKi-fAM4hNx1rJYBXyrUzWZp7YcWoc",
  authDomain: "tourism-633c6.firebaseapp.com",
  projectId: "tourism-633c6",
  storageBucket: "tourism-633c6.appspot.com",
  messagingSenderId: "615304518016",
  appId: "1:615304518016:web:43fd4ca8a915a9b2b7c965",
  measurementId: "G-SX86MNE9XQ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
export default app;
