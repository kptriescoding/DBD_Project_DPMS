import logo from "./logo.svg";
import "./App.css";
import { GoogleAuthProvider } from "firebase/auth";
import { signInWithGoogle, useAuth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Components/Login";
import Dashboard from "./Components/Dashboard";
import { NextUIProvider } from '@nextui-org/react';
import DragDrop from "./Components/DragDrop"
import { DndProvider } from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend"
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
    <DndProvider backend={HTML5Backend}>
    <NextUIProvider>
      <Router>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/dashboard" element={<Dashboard />} />
          <Route exact path="/dragndnd" element={<DragDrop />} />
        </Routes>
      </Router>
      </NextUIProvider>
      </DndProvider>
  );
}

export default App;
