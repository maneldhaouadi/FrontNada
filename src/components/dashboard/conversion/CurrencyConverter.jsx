import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;  
    justify-content: flex-start;  
    width: 100vw;
    min-height: 100vh;
    background-color: #f9f9f9;
    padding: 20px 40px; /* Padding on all sides */
    padding-right: 450px; /* Added more space on the right */
`;

const Title = styled.h1`
    font-size: 30px; 
    color: #444;
    margin-bottom: 10px;
    text-align: center;
    font-weight: bold;
`;

const FormContainer = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 10px;
    width: 100%;
    background-color: #ffffff;
    padding: 6px; 
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
    width: 100px;
    padding: 11px;  
    border: 1px solid #ddd;
    border-radius: 8px;
    margin-right: 5px;
    font-size: 1.1rem;  
    color: #333;
    background-color: #fafafa;
`;

const Select = styled.select`
    padding: 11px;  
    border: 1px solid #ddd;
    border-radius: 8px;
    margin-right: 10px;
    font-size: 1.1rem;  
    color: #333;
    background-color: #fafafa;
`;

const Button = styled.button`
    padding: 11px 13px;  
    border: none;
    border-radius: 8px;
    background-color: orange;
    color: white;
    cursor: pointer;
    font-size: 1.1rem;  
    margin-left: 10px;

    &:hover {
        background-color: #e57c00;
    }
`;

const Result = styled.p`
    font-size: 1.3rem;  
    color: #27ae60; 
    text-align: center; 
`;

const ErrorMessage = styled.p`
    color: #e74c3c; 
    text-align: center; 
`;

const Loader = styled.div`
    text-align: center;
    color: orange;
`;

const HistoryContainer = styled.div`
    margin-top: 20px; 
    border-top: 2px solid #ddd;
    padding-top: 10px; 
`;

const HistoryItem = styled.p`
    font-size: 0.9rem;  
    color: #555;
`;

const CurrencyInfoContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-top: 20px;
`;

const CurrencyBox = styled.div`
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 15px;
    margin: 10px;
    width: calc(30% - 20px);
`;

const CurrencyTitle = styled.h3`
    font-size: 20px; 
    color: #333;
`;

const CurrencyDescription = styled.p`
    font-size: 16px; 
    color: #555;
`;

const CurrencyConverter = () => {
    const [fromCurrency, setFromCurrency] = useState('EUR');
    const [toCurrency, setToCurrency] = useState('USD');
    const [amount, setAmount] = useState(1);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]);

    const handleConvert = async () => {
        const token = localStorage.getItem('access_token');
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(`http://localhost:81/api/v1/bot/conversion/convert`, {
                params: {
                    fromCurrency,
                    toCurrency,
                    amount
                },
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const conversionResult = response.data;
            setResult(conversionResult);
            setHistory([...history, `${amount} ${fromCurrency} = ${conversionResult} ${toCurrency}`]);
            setError(null);
        } catch (err) {
            console.error("Error during conversion:", err);
            setError("Error during conversion. Please check your data.");
            setResult(null);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setAmount(1);
        setFromCurrency('EUR');
        setToCurrency('USD');
        setResult(null);
        setError(null);
    };

    return (
        <Container>
            <Title>Currency Converter</Title>
            <FormContainer>
                <Input 
                    type="number" 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)} 
                    aria-label="Amount to convert"
                />
                <Select 
                    value={fromCurrency} 
                    onChange={(e) => setFromCurrency(e.target.value)} 
                    aria-label="From currency"
                >
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                    <option value="GBP">GBP</option>
                    <option value="JPY">JPY</option>
                </Select>
                <span style={{ margin: '0 10px' }}>to</span> {/* Added margin for spacing */}
                <Select 
                    value={toCurrency} 
                    onChange={(e) => setToCurrency(e.target.value)} 
                    aria-label="To currency"
                >
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                    <option value="GBP">GBP</option>
                    <option value="JPY">JPY</option>
                </Select>
                <Button onClick={handleConvert}>Convert</Button>
                <Button onClick={handleReset}>Reset</Button>
            </FormContainer>

            {loading && <Loader>Loading...</Loader>}
            {result && <Result>Result: {result} {toCurrency}</Result>}
            {error && <ErrorMessage>{error}</ErrorMessage>}

            <HistoryContainer>
                <h3 style={{ fontSize: '27px', color: '#333', marginBottom: '10px', textAlign: 'left', fontWeight: 'bold' }}>Conversion History</h3>
                {history.length === 0 ? (
                    <p>No conversions made.</p>
                ) : (
                    history.map((item, index) => (
                        <HistoryItem key={index}>{item}</HistoryItem>
                    ))
                )}
            </HistoryContainer>

            <CurrencyInfoContainer>
                <CurrencyBox>
                    <CurrencyTitle>USD (United States Dollar)</CurrencyTitle>
                    <CurrencyDescription>The official currency of the United States, often used as a benchmark in global transactions.</CurrencyDescription>
                </CurrencyBox>
                <CurrencyBox>
                    <CurrencyTitle>EUR (Euro)</CurrencyTitle>
                    <CurrencyDescription>The official currency of the Eurozone, used by 19 of the 27 European Union countries.</CurrencyDescription>
                </CurrencyBox>
                <CurrencyBox>
                    <CurrencyTitle>GBP (British Pound)</CurrencyTitle>
                    <CurrencyDescription>The official currency of the United Kingdom, known for its stability and value.</CurrencyDescription>
                </CurrencyBox>
                <CurrencyBox>
                    <CurrencyTitle>JPY (Japanese Yen)</CurrencyTitle>
                    <CurrencyDescription>The official currency of Japan, widely used in international trade and finance.</CurrencyDescription>
                </CurrencyBox>
                <CurrencyBox>
                    <CurrencyTitle>AUD (Australian Dollar)</CurrencyTitle>
                    <CurrencyDescription>The official currency of Australia, often regarded as a commodity currency.</CurrencyDescription>
                </CurrencyBox>
                <CurrencyBox>
                    <CurrencyTitle>CAD (Canadian Dollar)</CurrencyTitle>
                    <CurrencyDescription>The official currency of Canada, known for its connection to natural resources.</CurrencyDescription>
                </CurrencyBox>
            </CurrencyInfoContainer>
        </Container>
    );
};

export default CurrencyConverter;
