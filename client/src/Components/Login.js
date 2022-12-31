import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, signInWithGoogle } from "../firebase";
import GoogleButton from 'react-google-button'
export default function Login() {
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    if (user) navigate("/dashboard");
  }, [user, loading]);

  return (
    <div>
      <GoogleButton onClick={signInWithGoogle} className="login__btn login__google">
        <img
          src="https://img.icons8.com/ios-filled/50/000000/google-logo.png"
          alt="google icon"
        />
        <span> Continue with Google</span>
      </GoogleButton>
    </div>
  );
}