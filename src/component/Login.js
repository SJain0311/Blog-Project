import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile ,
    signOut,
  } from "firebase/auth";
  import React, { useState } from "react";
  import { auth } from "../firebaseConfig";
  import { useNavigate,Link } from "react-router-dom";
  import { toast } from "react-toastify";
  
  export default function Login() {
    let navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
 
       
    const handleSignup = async () => {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        navigate("/blog");
      } catch (error) {
        toast(error.code, { type: "error" });
      }
    };

  
    return (
      <div
        className="border p-3 bg-light mx-auto"
        style={{ maxWidth: 400, marginTop: 60 }}
      >
        <h1>Login</h1>
        <div className="form-group">
        <label>Email</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter your email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>
  
        <div className="form-group">
        <label>Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
        <br />
        <button className="btn btn-primary" onClick={handleSignup}>
          Login
        </button>
        <div>
          Don't have an account? <Link to="/SignUp">SignUp</Link> now.
        </div>
      </div>
    );
  }
  