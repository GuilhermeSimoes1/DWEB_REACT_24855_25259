import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../assets/css/SignupLogin.css';
import { useHistory } from "react-router-dom";

export const Signup = () => {

    const history = useHistory();


    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        userName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [passType, setPassType] = useState('password');
    const [compare, setCompare] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    const handleShowPassword = () => {
        setPassType(passType === 'password' ? 'text' : 'password');
    };

    useEffect(() => {
        if (formData.password && formData.confirmPassword) {
            setCompare(formData.password === formData.confirmPassword);
        }
    }, [formData.password, formData.confirmPassword]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!compare) {
            setErrorMessage("Passwords do not match!");
            return;
        }

        try {
            const response = await axios.post('https://localhost:7082/api/V1/Register', formData);
            alert(response.data.message);
            history.push('/login');
        } catch (error) {
            setErrorMessage("An error occurred. Please try again.");
        }
    };

    return (
        <div className="SignupLogin">
            <div className="login-container">
                <div className="form-box">
                    <h2>Sign Up</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="input-box">
                            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
                            <label>Nome</label>
                        </div>
                        <div className="input-box">
                            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
                            <label>Apelido</label>
                        </div>
                        <div className="input-box">
                            <input type="text" name="userName" value={formData.userName} onChange={handleChange} required />
                            <label>Nome de Utilizador</label>
                        </div>
                        <div className="input-box">
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                            <label>Email</label>
                        </div>
                        <div className="input-box">
                            <input type={passType} name="password" value={formData.password} onChange={handleChange} required />
                            <label>Password</label>
                        </div>
                        <div className="input-box">
                            <input type={passType} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
                            <label>Confirm Password</label>
                            <button type="button" onClick={handleShowPassword} className="btn"> Show Password </button>
                            {!compare && <span className="error">Passwords do not match!</span>}
                        </div>
                        {errorMessage && <span className="error">{errorMessage}</span>}
                        <input type="submit" className="btna" />
                    </form>
                    <p>Already have an account? <a href="/login">Login</a></p>
                    <p>Initial page: <a href="/hero">Comeback</a></p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
