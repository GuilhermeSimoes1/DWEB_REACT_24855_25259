import React, { useState, useEffect } from 'react';
import '../assets/css/ola.css';

export const Signup = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passType, setPassType] = useState('password');
    const [compare, setCompare] = useState(true);

    const handleShowPassword = () => {
        setPassType(passType === 'password' ? 'text' : 'password');
    };

    useEffect(() => {
        if (password && confirmPassword) {
            setCompare(password === confirmPassword);
        }
    }, [password, confirmPassword]);

    return (
        <div className="login-container">
            <div className="form-box">
                <h2>Sign Up</h2>
                <form action="" method="POST">
                    <div className="input-box">
                        <input type="text" name="username" required />
                        <label>Username</label>
                    </div>
                    <div className="input-box">
                        <input type="email" name="email" required />
                        <label>Email</label>
                    </div>
                    <div className="input-box">
                        <input type={passType} name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        <label>Password</label>
                    </div>
                    <div className="input-box">
                        <input type={passType} name="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                        <label>Confirm Password</label>
                        <button type="button" onClick={handleShowPassword} className="btn"> Show Password </button>
                        {!compare && <a className="error">Passwords do not match!</a>}
                    </div>

                    <input type="submit" className="btna"/>
                </form>
                <p>Already have an account? <a href="/user/login">Login</a></p>
            </div>
        </div>
    );
};

export default Signup;
