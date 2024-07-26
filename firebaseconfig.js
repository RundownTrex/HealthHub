import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyCny6et4JuVqoAD2VI05TDS6ECQ0RGP5Rk",
  authDomain: "healthhub-2cbba.firebaseapp.com",
  projectId: "healthhub-2cbba",
  storageBucket: "healthhub-2cbba.appspot.com",
  messagingSenderId: "241519626607",
  appId: "1:241519626607:web:5d2e70f64336dd7edac09a",
  measurementId: "G-X2QWFVRSEP",
};

const app = initializeApp(firebaseConfig);
export default app;
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export { auth };
