import React, { useEffect, useState, useContext } from 'react';
import { AccountContext } from '../components/AccountContext/AccountContext.js';
import Dropdown from 'react-bootstrap/Dropdown';
import { Container, Row, Col, Card } from 'react-bootstrap';
import '../assets/css/Moedas.css';

function ConversorMoedas() {
    const { getSelectedAccount } = useContext(AccountContext);
    const selectedAccount = getSelectedAccount();
    const accountValue = selectedAccount ? selectedAccount.accountValue : 0;

    const [moeda, setMoeda] = useState('euro');
    const [targetMoeda, setTargetMoeda] = useState('dolar');
    const [resultado, setResultado] = useState('');

    const exchangeRates = {
        euro: { dolar: 1.10, iene: 130, libra: 0.85 },
        dolar: { euro: 0.91, iene: 118.18, libra: 0.77 },
        iene: { euro: 0.0077, dolar: 0.0085, libra: 0.0065 },
        libra: { euro: 1.18, dolar: 1.29, iene: 152.94 },
    };

    useEffect(() => {
        const storedValue = localStorage.getItem('ola');
        if (storedValue) {
            setMoeda(storedValue);
        }
    }, []);

    const handleChangeMoeda = (novaMoeda) => {
        setMoeda(novaMoeda);
        localStorage.setItem('ola', novaMoeda);
    };

    const handleChangeTargetMoeda = (novaTargetMoeda) => {
        setTargetMoeda(novaTargetMoeda);
    };

    const calcularConversao = () => {
        const taxa = exchangeRates[moeda][targetMoeda];
        const resultadoConversao = accountValue * taxa;
        setResultado(`${accountValue.toFixed(2)} ${moeda} é igual a ${resultadoConversao.toFixed(2)} ${targetMoeda}`);
    };

    const handleSubmit = (event) => {
        event.preventDefault(); // Previne o comportamento padrão do formulário (recarregar a página)
        calcularConversao();
    };

    return (
        <Container fluid>
            <Row className="justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                <Col md={6}>
                    <Card className="shadow">
                        <Card.Body>
                            <h2 className="text-center mb-4">Conversor de Moedas</h2>
                            <form onSubmit={handleSubmit}>
                                <Dropdown className="custom-dropdown mb-3">
                                    <Dropdown.Toggle variant="secondary" id="dropdown-basic" className="custom-dropdown-toggle">
                                        {moeda.toUpperCase()}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={() => handleChangeMoeda('dolar')}>Dólar</Dropdown.Item>
                                        <Dropdown.Item onClick={() => handleChangeMoeda('euro')}>Euro</Dropdown.Item>
                                        <Dropdown.Item onClick={() => handleChangeMoeda('iene')}>Iene</Dropdown.Item>
                                        <Dropdown.Item onClick={() => handleChangeMoeda('libra')}>Libra</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                                <Dropdown className="custom-dropdown mb-3">
                                    <Dropdown.Toggle variant="secondary" id="dropdown-basic2" className="custom-dropdown-toggle">
                                        {targetMoeda.toUpperCase()}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={() => handleChangeTargetMoeda('dolar')}>Dólar</Dropdown.Item>
                                        <Dropdown.Item onClick={() => handleChangeTargetMoeda('euro')}>Euro</Dropdown.Item>
                                        <Dropdown.Item onClick={() => handleChangeTargetMoeda('iene')}>Iene</Dropdown.Item>
                                        <Dropdown.Item onClick={() => handleChangeTargetMoeda('libra')}>Libra</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                                <button type="submit" className="btn btn-convert w-100">Converter</button>
                            </form>
                            {resultado && <p className="result-box text-center mt-3">{resultado}</p>}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default ConversorMoedas;
