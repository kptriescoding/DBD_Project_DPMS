import logo from "./logo.svg";
// import "./App.css";
import { GoogleAuthProvider } from "firebase/auth";
import { signInWithGoogle, useAuth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Components/Login";
import Dashboard from "./Components/Dashboard";
import { NextUIProvider } from '@nextui-org/react';
function App() {
  // const { currentUser } = useAuth();
  // const render = () => {
  //   if (currentUser != null) {
  //     signInWithGoogle().then(() => {
  //       <>Rendering this</>;
  //     });
  //   } else {
  //     <>This is the conditions</>;
  //   }
  // };
  return (
    // <Drag
    <NextUIProvider>
      <Router>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/dashboard" element={<Dashboard />} />
     
        </Routes>
      </Router>
      </NextUIProvider>
  );
}

export default App;
