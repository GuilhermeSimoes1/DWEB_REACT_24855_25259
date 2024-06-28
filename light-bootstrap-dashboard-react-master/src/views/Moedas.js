import React, { useEffect, useState, useContext } from 'react';
import { AccountContext } from '../components/AccountContext/AccountContext.js';
import Dropdown from 'react-bootstrap/Dropdown';
import 'bootstrap/dist/css/bootstrap.min.css';

function ConversorMoedas() {
    const { accountValue } = useContext(AccountContext);
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

    return (
        <div>
            <h2>Conversor de Moedas</h2>
            <Dropdown>
                <Dropdown.Toggle variant="secondary" id="dropdown-basic" style={{width:"100px"}}>
                    {moeda.toUpperCase()}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handleChangeMoeda('dolar')}>Dólar</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleChangeMoeda('euro')}>Euro</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleChangeMoeda('iene')}>Iene</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleChangeMoeda('libra')}>Libra</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            <Dropdown>
                <Dropdown.Toggle variant="secondary" id="dropdown-basic2" style={{width:"100px"}}>
                    {targetMoeda.toUpperCase()}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handleChangeTargetMoeda('dolar')}>Dólar</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleChangeTargetMoeda('euro')}>Euro</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleChangeTargetMoeda('iene')}>Iene</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleChangeTargetMoeda('libra')}>Libra</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            <button type="button" class="btn btn-outline-secondary" style ={{marginLeft:"10px", width:"100px"}} onClick={calcularConversao}>Convert</button>

            {resultado && <p className="text-success fw-bold p-3 rounded shadow-sm" style={{backgroundColor: "#f8f9fa", marginTop:"35px", fontSize:"20px"}}>{resultado}</p>}
        </div>
    );
}

export default ConversorMoedas;