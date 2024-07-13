import React, { useState } from 'react';
import '../assets/css/SignupLogin.css';
import { useHistory } from "react-router-dom";

// URL base da API
const url = "https://dwebnet20240712221837.azurewebsites.net/api/v1";

export const Login = () => {
    // Estados para armazenar email, password, tipo de password (visível ou não), e mensagem de erro
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passType, setPassType] = useState('password'); 
    const [errorMessage, setErrorMessage] = useState('');
    // Hook do React Router para redirecionar o usuário
    const history = useHistory();
    
    // Função para alternar a visibilidade da password
    const handleShowPassword = () => {
        setPassType(passType === 'password' ? 'text' : 'password');
    };

    // Função para tratar o envio do formulário de login
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevenir o comportamento padrão do formulário

        // Realiza a chamada à API para efetuar o login
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
          .then((res) => res.json()) // Converte a resposta em JSON
          .then((data) => {
            console.log(data); 
            localStorage.setItem("user", JSON.stringify(data)); // Armazena os dados do usuário no localStorage
            history.push('/user/Dashboard'); // Redireciona para o Dashboard
          })
          .catch((error) => {
            console.error('Error during login:', error);
            setErrorMessage('Erro durante o login, por favor tente novamente.'); // Define a mensagem de erro
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
                            <button type="button" onClick={handleShowPassword} className="btn" style={{marginTop:"20px"}}> Show Password </button>
                        </div>
                        <button type="submit" className="btna">Login</button>
                        {errorMessage && <p className="error">{errorMessage}</p>} {/* Mostra a mensagem de erro, se houver */}
                    </form>
                    <p>Don't have an account? <a href="/signup"> Sign up </a></p>
                    <p>Initial page: <a href="/hero">Comeback</a></p>
                </div>
            </div>
        </div>
    );
}

export default Login;