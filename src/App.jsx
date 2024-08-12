import { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./HomePage/HomePage";
import Login from "./Components/Login/Login";
import "./App.css";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setLoggedIn(true);
      setEmail("emilys");
    }
  }, []);

  return (
    <>
      <h1>Star Wars</h1>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              loggedIn ? (
                <HomePage setLoggedIn={setLoggedIn} setEmail={setEmail} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/login"
            element={
              loggedIn ? (
                <Navigate to="/" />
              ) : (
                <Login setLoggedIn={setLoggedIn} setEmail={setEmail} />
              )
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
