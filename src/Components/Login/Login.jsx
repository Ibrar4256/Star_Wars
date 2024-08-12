import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = ({ setLoggedIn, setEmail }) => {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const emailErrorRef = useRef(null);
  const passwordErrorRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const onButtonClick = async (e) => {
    e.preventDefault(); // Prevent form submission

    emailErrorRef.current.textContent = "";
    passwordErrorRef.current.textContent = "";

    const username = emailRef.current.value;
    const password = passwordRef.current.value;

    if (username === "") {
      emailErrorRef.current.textContent = "Please enter your username";
      return;
    }

    if (password === "") {
      passwordErrorRef.current.textContent = "Please enter a password";
      return;
    }

    if (password.length < 8) {
      passwordErrorRef.current.textContent =
        "The password must be 8 characters or longer";
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://dummyjson.com/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          expiresInMins: 5,
        }),
      });

      if (!response.ok) {
        throw new Error("Login failed: " + response.statusText);
      }

      const result = await response.json();

      if (result.token) {
        const expirationTime = new Date().getTime() + 2 * 60 * 1000;

        localStorage.setItem("authToken", result.token);
        localStorage.setItem("expirationTime", expirationTime);

        setEmail(username);
        setLoggedIn(true);

        navigate("/");
      } else {
        throw new Error("Invalid response");
      }
    } catch (error) {
      passwordErrorRef.current.textContent = error.message;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkTokenExpiration = () => {
      const expirationTime = localStorage.getItem("expirationTime");
      if (expirationTime && new Date().getTime() > expirationTime) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("expirationTime");
        setLoggedIn(false);
        setEmail("");
        navigate("/login");
      }
    };

    const intervalId = setInterval(checkTokenExpiration, 1000);

    return () => clearInterval(intervalId);
  }, [setLoggedIn, setEmail, navigate]);

  return (
    <div className="mainContainer">
      <form onSubmit={onButtonClick} className="loginForm">
        <h2>Login</h2>
        <div className="inputContainer">
          <input
            ref={emailRef}
            placeholder="Enter your username"
            className="inputBox"
            type="text"
          />
          <label ref={emailErrorRef} className="errorLabel"></label>
        </div>
        <div className="inputContainer">
          <input
            ref={passwordRef}
            type="password"
            placeholder="Enter your password"
            className="inputBox"
          />
          <label ref={passwordErrorRef} className="errorLabel"></label>
        </div>
        <button type="submit" className="inputButton" disabled={loading}>
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>
    </div>
  );
};

export default Login;
