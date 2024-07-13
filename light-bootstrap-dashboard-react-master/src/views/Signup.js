import React, { useState, useEffect } from 'react';
import '../assets/css/SignupLogin.css';
import { useHistory } from 'react-router-dom';

const url = "https://dwebnet20240712221837.azurewebsites.net/api/v1";

export const Signup = () => {
    const history = useHistory();

    const [formData, setFormData] = useState({
        FirstName: '',
        LastName: '',
        UserName: '',
        Email: '',
        Password: '',
        ConfirmPassword: '',
        UserAutent: ''
    });

    const [passType, setPassType] = useState('password');
    const [compare, setCompare] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    const handleShowPassword = () => {
        setPassType(passType === 'password' ? 'text' : 'password');
    };

    useEffect(() => {
        if (formData.Password && formData.ConfirmPassword) {
            setCompare(formData.Password === formData.ConfirmPassword);
        }
    }, [formData.Password, formData.ConfirmPassword]);

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
    
        const payload = {
            UserName: formData.userName,
            Email: formData.email,
            Password: formData.password,
            UserAutent: formData.userAutent,
        };
        
        try {

            const response = await fetch(`${url}/Register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                history.push('/login');
            } else {
                setErrorMessage(data.message || "An error occurred. Please try again.");
            }

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
                            <input type="text" name="FirstName" value={formData.FirstName} onChange={handleChange} required />
                            <label>Nome</label>
                        </div>
                        <div className="input-box">
                            <input type="text" name="LastName" value={formData.LastName} onChange={handleChange} required />
                            <label>Apelido</label>
                        </div>
                        <div className="input-box">
                            <input type="text" name="UserName" value={formData.UserName} onChange={handleChange} required />
                            <label>Nome de Utilizador</label>
                        </div>
                        <div className="input-box">
                            <input type="email" name="Email" value={formData.Email} onChange={handleChange} required />
                            <label>Email</label>
                        </div>
                        <div className="input-box">
                            <input type={passType} name="Password" value={formData.Password} onChange={handleChange} required />
                            <label>Password</label>
                        </div>
                        <div className="input-box">
                            <input type={passType} name="ConfirmPassword" value={formData.ConfirmPassword} onChange={handleChange} required />
                            <label>Confirm Password</label>
                            <button type="button" onClick={handleShowPassword} className="btn">Show Password</button>
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