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
export const signInWithGoogle = async (userType) => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    if(res){
      const q = query(collection(db, "users"), where("uid", "==", user.uid));
      const docs = await getDocs(q);
      if (docs.docs.length === 0) {
        await addDoc(collection(db, "users"), {
          uid: user.uid,
          email: user.email,
          userType:userType
        });
      }
    }
    window.location.reload()
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
    let res=await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    // console.error(err);
    throw err
  }
};
export const registerWithEmailAndPassword = async (email, password,userType) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user=res.user
    if(res){
      const q = query(collection(db, "users"), where("uid", "==", user.uid));
      const docs = await getDocs(q);
      if (docs.docs.length === 0) {
        await addDoc(collection(db, "users"), {
          uid: user.uid,
          email: user.email,
          userType:userType
        });
      }
    }
  } catch (err) {
    console.error(err);
    // alert(err.message);
  }
};
export const linkMailWithGoogle=async(email,password)=>{
  try{
  const credentials= EmailAuthProvider.credential(email, password);
  const res=await linkWithCredential(auth.currentUser,credentials)
  }
  catch(err){
    console.error(err);
    // alert(err.message)
  }
}
export const fetchUserType=async(email)=>{
  try{
  const q = query(collection(db, "users"), where("email", "==", email));
  const docs = await getDocs(q);
  return docs.docs[0]._document.data.value.mapValue.fields.userType.stringValue
  }
  catch(err){
    return ""
    console.log(err)
  }
}
export default app;
