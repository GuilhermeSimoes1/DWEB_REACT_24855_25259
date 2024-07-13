import React, { useEffect, useState, useContext } from 'react';
import { AccountContext } from '../components/AccountContext/AccountContext.js';
import Dropdown from 'react-bootstrap/Dropdown';
import { Container, Row, Col, Card } from 'react-bootstrap';
import '../assets/css/Moedas.css';

function ConversorMoedas() {
    // Estados para a moeda selecionada, moeda de destino, valor e resultado da conversão
    const [moeda, setMoeda] = useState('euro');
    const [targetMoeda, setTargetMoeda] = useState('dolar');
    const [valor, setValor] = useState('');
    const [resultado, setResultado] = useState('');

    // Taxas de câmbio entre as moedas
    const exchangeRates = {
        euro: { dolar: 1.10, iene: 130, libra: 0.85 },
        dolar: { euro: 0.91, iene: 118.18, libra: 0.77 },
        iene: { euro: 0.0077, dolar: 0.0085, libra: 0.0065 },
        libra: { euro: 1.18, dolar: 1.29, iene: 152.94 },
    };

    // Função para lidar com a mudança da moeda selecionada
    const handleChangeMoeda = (novaMoeda) => {
        setMoeda(novaMoeda);
    };

    // Função para lidar com a mudança da moeda de destino selecionada
    const handleChangeTargetMoeda = (novaTargetMoeda) => {
        setTargetMoeda(novaTargetMoeda);
    };

    // Função para calcular a conversão da moeda
    const calcularConversao = () => {
        if (!exchangeRates[moeda] || !exchangeRates[moeda][targetMoeda]) {
            setResultado('Conversão inválida.');
        } else {
            const taxa = exchangeRates[moeda][targetMoeda];
            const resultadoConversao = valor * taxa;
            setResultado(`${valor.toFixed(2)} ${moeda.toUpperCase()} é igual a ${resultadoConversao.toFixed(2)} ${targetMoeda.toUpperCase()}`);
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-start" style={{ paddingTop: '20px', height: '100vh' }}>
            <Row>
                <Col className="text-center">
                    <h2 style={{ marginBottom: "40px" }}>Conversor de Moedas</h2>
                    <form id="conversor-form" onSubmit={(e) => { e.preventDefault(); calcularConversao(); }}>
                        <div className="form-group" style={{ marginBottom: "40px" }}>
                            <strong><label htmlFor="moeda">Moeda</label>:</strong>
                            <Dropdown className="custom-dropdown" style={{ marginBottom: "40px" }}>
                                <Dropdown.Toggle variant="secondary" id="dropdown-basic" className="custom-dropdown-toggle">
                                    {moeda.toUpperCase()}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => handleChangeMoeda('euro')}>Euro</Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleChangeMoeda('dolar')}>Dólar</Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleChangeMoeda('iene')}>Iene</Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleChangeMoeda('libra')}>Libra</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        <div className="form-group" style={{ marginBottom: "40px" }}>
                            <strong><label htmlFor="targetMoeda">Moeda de Destino</label>:</strong>
                            <Dropdown className="custom-dropdown" style={{ marginBottom: "40px" }}>
                                <Dropdown.Toggle variant="secondary" id="dropdown-basic2" className="custom-dropdown-toggle">
                                    {targetMoeda.toUpperCase()}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => handleChangeTargetMoeda('euro')}>Euro</Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleChangeTargetMoeda('dolar')}>Dólar</Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleChangeTargetMoeda('iene')}>Iene</Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleChangeTargetMoeda('libra')}>Libra</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        <div className="form-group" style={{ marginBottom: "40px" }}>
                            <strong><label htmlFor="valor">Valor</label>:</strong>
                            <input type="number" id="valor" name="valor" className="form-control" value={valor} onChange={(e) => setValor(parseFloat(e.target.value))} step="0.01" />
                        </div>
                        <button type="submit" className="btn-fix" style={{ marginLeft: "10px", width: "100%"}}>Converter</button>
                    </form>
                    {resultado && <p className="text-success fw-bold p-3 rounded shadow-sm" style={{ backgroundColor: "#f8f9fa", marginTop: "35px", fontSize: "20px" }}>{resultado}</p>}
                </Col>
            </Row>
        </Container>
    );
}

export default ConversorMoedas;