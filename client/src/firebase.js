// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut,createUserWithEmailAndPassword,signInWithEmailAndPassword,EmailAuthProvider,linkWithCredential } from "firebase/auth";
import { addDoc, collection, getDocs, getFirestore, query, where } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCN8p3twGs7rcEWamrHJfLVk0HznmuieG0",
  authDomain: "dpms-9b1dc.firebaseapp.com",
  projectId: "dpms-9b1dc",
  storageBucket: "dpms-9b1dc.appspot.com",
  messagingSenderId: "58937290151",
  appId: "1:58937290151:web:ebcf3146a87b9e64b69a82",
  measurementId: "G-BT56KGYPN7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();
export const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
  } catch (err) {
    console.error(err);
    // alert(err.message);
  }
};
export const logout = () => {
  signOut(auth);
};
export const logInWithEmailAndPassword = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error(err);
    // alert(err.message);
  }
};
export const registerWithEmailAndPassword = async (email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
  } catch (err) {
    console.error(err);
    // alert(err.message);
  }
};
export const linkMailWithGoogle=async(email,password)=>{
  try{
  const credentials= EmailAuthProvider.credential(email, password);
  const res=await linkWithCredential(auth.currentUser,credentials)
  console.log(res)
  }
  catch(err){
    console.error(err);
    // alert(err.message)
  }
}
export default app;
