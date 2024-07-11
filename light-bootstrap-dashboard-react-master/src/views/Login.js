import React, { useState } from 'react';
import axios from 'axios';
import '../assets/css/SignupLogin.css';
import { useHistory } from "react-router-dom";
import User from './UserProfile';

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
        try {
            const response = await fetch('https://localhost:7082/api/V1/LogIn', {
                body: JSON.stringify({
                    Email: email,
                    Password: password,
                    RememberMe: false
                }), 
                    
                headers: {
                    Accept: "*/*",
                    'Content-Type': "application/json" 
                },
                method: "POST",
                credentials: 'include'
            });
            
            if (!response.ok) {
                throw new Error('Invalid credentials');
            }

            const data = await response.json();
            console.log('Login successful');
            
            localStorage.setItem('user', JSON.stringify(data));
            history.push('/user/dashboard');
        } catch (error) {
            console.error('Error during login:', error);
            setErrorMessage('Invalid email or password');
        }
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