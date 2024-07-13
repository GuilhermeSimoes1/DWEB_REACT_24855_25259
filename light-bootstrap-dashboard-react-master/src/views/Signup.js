import React, { useState, useEffect } from 'react';
import '../assets/css/SignupLogin.css'; 
import { useHistory } from 'react-router-dom'; 

const url = "https://dwebnet20240712221837.azurewebsites.net/api/v1"; 

export const Signup = () => {
    const history = useHistory(); 

    // armazenar dados do formulário, tipo de password, comparação de passwords e mensagens de erro
    const [formData, setFormData] = useState({
        FirstName: '',
        LastName: '',
        UserName: '',
        Email: '',
        Password: '',
        ConfirmPassword: '',
        UserAutent: ''
    });

    const [passType, setPassType] = useState('password'); // Estado para controlar o tipo de input de password
    const [compare, setCompare] = useState(true); // Estado para comparar se as passwords coincidem
    const [errorMessage, setErrorMessage] = useState(''); // Estado para armazenar mensagens de erro

    // Função para alternar entre mostrar/esconder password
    const handleShowPassword = () => {
        setPassType(passType === 'password' ? 'text' : 'password');
    };

    // Efeito para comparar as passwords e atualizar o estado 'compare'
    useEffect(() => {
        if (formData.Password && formData.ConfirmPassword) {
            setCompare(formData.Password === formData.ConfirmPassword);
        }
    }, [formData.Password, formData.ConfirmPassword]);

    // Função para lidar com as mudanças nos inputs do formulário
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Função assíncrona para submeter o formulário de registo
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!compare) {
            setErrorMessage("As passwords não coincidem!");
            return;
        }
    
        const payload = {
            UserName: formData.userName,
            Email: formData.email,
            Password: formData.password,
            UserAutent: formData.userAutent,
        };
        
        try {
            // Envia um pedido POST para a API para registar o utilizador
            const response = await fetch(`${url}/Register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json(); // Converte a resposta para JSON
            if (response.ok) {
                alert(data.message); // Mostra uma mensagem de sucesso
                history.push('/login'); // Redireciona para a página de login
            } else {
                setErrorMessage(data.message || "Ocorreu um erro. Por favor, tente novamente.");
            }

        } catch (error) {
            setErrorMessage("Ocorreu um erro. Por favor, tente novamente.");
        }
    };

    // Renderização do componente de registo
    return (
        <div className="SignupLogin">
            <div className="login-container">
                <div className="form-box">
                    <h2>Sign Up</h2>
                    <form onSubmit={handleSubmit}>
                        {/* Inputs do formulário */}
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
                            <label>Confirmar Password</label>
                            <button type="button" onClick={handleShowPassword} className="btn">Mostrar Password</button>
                            {!compare && <span className="error">As passwords não coincidem!</span>}
                        </div>
                        {errorMessage && <span className="error">{errorMessage}</span>}
                        <input type="submit" className="btna" />
                    </form>
                    {/* Links adicionais para navegação */}
                    <p>Já tem uma conta? <a href="/login">Login</a></p>
                    <p>Página inicial: <a href="/hero">Voltar</a></p>
                </div>
            </div>
        </div>
    );
};

export default Signup; 
