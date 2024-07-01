import React, { useState } from 'react'
import '../assets/css/ola.css';

export const Login = () => {
    const [pass, setPass] = useState(''); 

    const handleShowPassword = () => {
        if (pass === 'password') {
            setPass('text');
        } else {
            setPass('password');
        }
    }  
    return (
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
                    <button type="submit" class="btna">Login</button>
                </form>
                <p>Don't have an account? <a href="/user/signup"> Sign up </a> </p>
            </div>
        </div>
  )
}
export default Login;