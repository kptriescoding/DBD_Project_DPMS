import logo from "./logo.svg";
// import "./App.css";
import { GoogleAuthProvider } from "firebase/auth";
import { signInWithGoogle, useAuth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { NextUIProvider } from '@nextui-org/react';


import StudentSignup from "./Components/Students/Login/Signup"
import StudentDashboard from "./Components/Students/Dashboard"
import ProfessorSignup from "./Components/Professor/Login/Signup"
import ProfessorLogin from "./Components/Login"
import ProfessorDashboard from "./Components/Professor/Dashboard"
import DragDrop from "./Components/DragDropComponents/DragDrop";
import ProfessorProject from "./Components/Professor/Projects.js";

/**
 TODO
 If logged in professor or student and try to access others links will not work properly
 A naive solution can be implemented by using local storages
 * 
 */
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
          {/*<Route exact path="/" element={<Login />} />
  <Route exact path="/dashboard" element={<Dashboard />} />*/}
          <Route exact path="/dragDropTest" element={<DragDrop/>}/>
          <Route exact path="/login" element={<ProfessorLogin/>}/>
          <Route exact path="/student/dashboard" element={<StudentDashboard/>}/>
          <Route exact path="/student/signup" element={<StudentSignup/>}/>
          <Route exact path="/professor/dashboard" element={<ProfessorDashboard/>}/>
          <Route exact path="/professor/signup" element={<ProfessorSignup/>}/>
          <Route exact path="/professor/project" element={<ProfessorProject/>}/>
        </Routes>
      </Router>
      </NextUIProvider>
  );
}

export default App;
