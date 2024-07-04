import React, { useState } from 'react';
import '../assets/css/SignupLogin.css';

export const Login = () => {
    const [pass, setPass] = useState('password'); 

    const handleShowPassword = () => {
        setPass(pass === 'password' ? 'text' : 'password');
    };

    return (
        <div className="SignupLogin">
            <div className="login-container">
                <div className="form-box">
                    <h2>Login</h2>
                    <form action="" method="POST">
                        <div className="input-box">
                            <input type="text" name="username" required />
                            <label>Username</label>
                        </div>
                        <div className="input-box">
                            <input type={pass} name="password" required />
                            <label>Password</label>
                            <button type="button" onClick={handleShowPassword} className="btn"> Show Password </button>
                        </div>
                        <button type="submit" className="btna">Login</button>
                    </form>
                    <p>Don't have an account? <a href="/signup"> Sign up </a></p>
                    <p>Initial page: <a href="/hero">Comeback</a></p>
                </div>
            </div>
        </div>
    );
}

export default Login;
