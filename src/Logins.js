import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import CryptoJS from "crypto-js";

const Logins = () => {
  const secretKey = "secretkey";
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const encryptData = (text) => {
    return CryptoJS.AES.encrypt(text, secretKey).toString();
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    const enPassword = encryptData(password);
    console.log("encrypted passwoed", enPassword);
    
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password: enPassword }),
      });

      if (response.status === 200) {
        const data = await response.json();
        localStorage.setItem("email", data.user.email);
        localStorage.setItem("token", data.token);
        navigate("/Home");
      } else {
        setError("Invalid credentials");
      }
    } catch (error) {
      setError("Server error, please try again later.");
    }
  };

  //register
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
  };
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    console.log("value passed");
    const userid = uuidv4();
    try {
      if (!validateEmail(registerEmail)) {
        setError("Invalid email format");
        return;
      }
      if (!validatePassword(registerPassword)) {
        setError(
          "Password must be at least 8 characters long and contain letters and numbers"
        );
        return;
      }
      if (registerPassword !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      const encryptData = (text) => {
        return CryptoJS.AES.encrypt(text, secretKey).toString();
      };

      const enPassword = encryptData(registerPassword);
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email: registerEmail,
          phoneNumber,
          password: enPassword,
          confirmPassword: enPassword,
          userid,
        }),
      });

      const data = await response.json();

      if (response.status === 200) {
        setShowRegisterForm(false);
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (error) {
      setError("Server error, please try again later.");
    }
  };

  return (
    <div className="container">
      <h2 className="title">CareerNexus</h2>
      <h4 className="welcome-title">
        Welcome Back Don’t miss your next opportunity.
      </h4>
      <div className="box">
        <div className="left">
          <img
            src={
              showRegisterForm
                ? //https://img.freepik.com/free-vector/personal-data-protection-isometric-landing-page_107791-5302.jpg?t=st=1741669854~exp=1741673454~hmac=a1a83845389ef47fc45dcccfbec7ae225fb8a55cdac1985eba47079427e8410a&w=1380
                  " https://i.pinimg.com/736x/08/ac/5b/08ac5b79b178bfaa3d304d55ecde1f4d.jpg"
                : "https://i.pinimg.com/736x/b9/6f/60/b96f604b57273a5f6ff9bb2da7302a6b.jpg"
            }
            alt="login / register image"
          />
        </div>
        <div
          className={`right ${showRegisterForm ? "register-bg" : "login-bg"}`}
        >
          <div className="login-form">
            {showRegisterForm ? (
              <>
                <h2>Register</h2>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <form onSubmit={handleRegister}>
                  <div className="input-groups">
                    <input
                      type="text"
                      placeholder="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />

                    <input
                      type="email"
                      placeholder="Email"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Phone Number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      required
                    />
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="reg-button">
                    Register
                  </button>
                  <p>
                    Already have an account?{" "}
                    <span onClick={() => setShowRegisterForm(false)}>
                      Login
                    </span>
                  </p>
                </form>
              </>
            ) : (
              <>
                <p>Sign in to stay updated on your professional world.</p>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <form onSubmit={handleLogin}>
                  <div className="input-group">
                    <input
                      type="text"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit">Sign in </button>
                  <p>
                    New to CareerNexus?{" "}
                    <span onClick={() => setShowRegisterForm(true)}>
                      Join Now
                    </span>
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
      <style jsx>{`
        /* General Styles */
        body {
          font-family: "Poppins", sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f0f2f5;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }

        /* Container */
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          padding: 20px;
        }

        /* Titles */
        .title {
          font-size: 32px;
          font-weight: 600;
          color: #333;
          text-transform: capitalize;
          letter-spacing: 1px;
        }

        .welcome-title {
          font-size: 18px;
          font-weight: 400;
          color: #555;
          margin-bottom: 20px;
        }

        /* Card Box */
        .box {
          width: 100%;
          max-width: 850px;
          display: flex;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.15);
          margin-top: 20px;
          transition: transform 0.3s ease-in-out;
        }

        .box:hover {
          transform: scale(1.02);
        }

        /* Left Section */
        .left {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #e3f2fd, #bbdefb);
          padding: 30px;
        }

        .left img {
          max-width: 90%;
          height: auto;
          border-radius: 10px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }

        /* Right Section */
        .right {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px;
          background: white;
          border-radius: 0 12px 12px 0;
        }

        /* Input Fields */
        .input-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 100%;
          max-width: 300px;
        }

        .input-group input {
          width: 100%;
          padding: 12px;
          border-radius: 8px;
          border: 1px solid #ccc;
          font-size: 16px;
          background: white;
          transition: 0.3s ease-in-out;
        }

        .input-group input:focus {
          border-color: #007bff;
          outline: none;
          box-shadow: 0px 0px 10px rgba(0, 123, 255, 0.3);
        }
        .input-groups {
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 100%;
          max-width: 500px;
          margin-right: 90px;
        }
        .input-groups input {
          width: 100%;
          padding: 12px;
          border-radius: 8px;
          border: 1px solid #ccc;
          font-size: 16px;
          background: white;
          transition: 0.3s ease-in-out;
        }

        button {
          margin-top: 10px;
          width: 92%;
          padding: 14px;
          border: none;
          border-radius: 8px;
          background: #007bff;
          color: white;
          font-size: 18px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease-in-out;
        }

        button:hover {
          background: #0056b3;
          transform: translateY(-2px);
        }
        .reg-button {
          margin-top: 10px;
          width: 110%;
          padding: 14px;
          border: none;
          border-radius: 8px;
          background: #007bff;
          color: white;
          font-size: 18px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease-in-out;
        }
        /* Logout Button */
        .logout-btn {
          width: 40%;
          padding: 12px;
          border-radius: 8px;
          background: #dc3545;
          color: white;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease-in-out;
        }

        .logout-btn:hover {
          background: #b22234;
          transform: translateY(-2px);
        }

        span {
          color: #007bff;
          cursor: pointer;
          font-weight: 500;
          transition: color 0.3s ease;
        }

        span:hover {
          color: #0056b3;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default Logins;
