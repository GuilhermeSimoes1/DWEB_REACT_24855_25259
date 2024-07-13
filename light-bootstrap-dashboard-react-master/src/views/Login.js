import React, { useState } from 'react';
import '../assets/css/SignupLogin.css';
import { useHistory } from "react-router-dom";

const url = "https://dwebnet20240712221837.azurewebsites.net/api/v1";

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passType, setPassType] = useState('password'); 
    const [errorMessage, setErrorMessage] = useState('');
    const history = useHistory();
    
    const handleShowPassword = () => {
        setPassType(passType === 'password' ? 'text' : 'password');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        fetch(`${url}/Login?${new URLSearchParams({
            Email: email,
            Password: password,
            remainder: false
          })}`, {
            headers: {
              Accept: "*/*"
            },
            method: "POST",
            credentials: 'include'
          })
          .then((res) => res.json())
          .then((data) => {

            console.log(data) 
            localStorage.setItem("user", JSON.stringify(data))
            history.push('/user/Dashboard');
           

          })
          .catch((error) => {
            console.error('Error during login:', error);
            throw error;
          });
    };

    return (
        <div className="SignupLogin">
            <div className="login-container">
                <div className="form-box">
                    <h2>Login</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="input-box">
                            <input type="text" name="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            <label>Email</label>
                        </div>
                        <div className="input-box">
                            <input type={passType} name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            <label>Password</label>
                            <button type="button" onClick={handleShowPassword} className="btn"> Show Password </button>
                        </div>
                        <button type="submit" className="btna">Login</button>
                        {errorMessage && <p className="error">{errorMessage}</p>}
                    </form>
                    <p>Don't have an account? <a href="/signup"> Sign up </a></p>
                    <p>Initial page: <a href="/hero">Comeback</a></p>
                </div>
            </div>
        </div>
    );
}

export default Login;