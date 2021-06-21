import React from "react";
import Currency from "./Currency"
import "./App.css"
import { useEffect, useState, useRef } from "react";
import axios from "axios";

/* 
  FOR UPDATES:
    App is slow. Fix that
      IDEAS: 1) Add server side to download the data from the api.exchangerates daily and store it locally.
      This will save API calls (since they are limited)
      2) Add static starting screen without values. 
      3) Load data on first paint
      4) Show data only after first interaction (changing starting or target Currency)
      
    Add SWITCH functionality to switch starting and target currency
    Implement graphical representations
*/

function App() {
  const BASE_URL = `http://api.exchangeratesapi.io/v1/latest?access_key=${process.env.REACT_APP_API_KEY}`
  const [currencyOptions, setCurrencyOptions] = useState([])
  const [startingCurrency, setStartingCurrency] = useState("");
  const [targetCurrency, setTargetCurrency] = useState("");
  const [exchangeRate, setExchangeRate] = useState()
  const [amount, setAmount] = useState(1);
  const [amountInStartingCurrency, setAmountInTargetCurrency] = useState(true);
  const currencyRates = useRef({});
  const isFirstRun = useRef(true);

  let startingAmount, targetAmount
  if (amountInStartingCurrency) {
    startingAmount = amount;
    targetAmount = amount * exchangeRate;
  } else {
    targetAmount = amount;
    startingAmount = amount / exchangeRate;
  }

  useEffect(() => {
    if(isFirstRun.current) return;
    let exRate = currencyRates.current[targetCurrency] / currencyRates.current[startingCurrency]
    setExchangeRate(exRate)
  }, [startingCurrency, targetCurrency])

  useEffect(() => {
    axios({
      method: "get",
      url: BASE_URL
    })
    .then((res) => {
      const firstCurrency = Object.keys(res.data.rates)[0]
      setCurrencyOptions([...Object.keys(res.data.rates)]);
      setStartingCurrency(res.data.base);
      setTargetCurrency(firstCurrency);
      setExchangeRate(res.data.rates[firstCurrency]);
      currencyRates.current = res.data.rates;
      isFirstRun.current = false;
    })
  }, [])

  function handleStartingAmountChange(e) {
    setAmount(e.target.value);
    setAmountInTargetCurrency(true);
  }

  function handleTargetAmountChange (e) {
    setAmount(e.target.value);
    setAmountInTargetCurrency(false);
  }

  return (
    <>
    <h1>Convert</h1>
      <Currency 
        currencyOptions={currencyOptions} 
        selectedCurrency = {startingCurrency}
        onChangeCurrency = {e => setStartingCurrency(e.target.value)}
        onChangeAmount = {handleStartingAmountChange}
        amount = {startingAmount}
      />
      <div className="equals">=</div>
      <Currency 
        currencyOptions={currencyOptions} 
        selectedCurrency = {targetCurrency}
        onChangeCurrency = {e => setTargetCurrency(e.target.value)}
        onChangeAmount = {handleTargetAmountChange}
        amount = {targetAmount}
      />
    </>
  );
}

export default App;
