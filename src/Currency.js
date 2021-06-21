import React from 'react'

export default function Currency(props) {
    const {
        currencyOptions, 
        selectedCurrency,
        onChangeCurrency,
        amount,
        onChangeAmount
    } = props;

    console.log(`Amount: ${amount}`);
    console.log(`selectedCurrency ${selectedCurrency}`)
    // function setSelect(isStartingCurrency) {
    //     isStartingCurrency ? setStartingCurrency(selectedC) : setTargetCurrency(value);
    // }
    return (
        <>
        <input className = "input" type="number" value={amount} onChange={onChangeAmount}/>
        <select value = {selectedCurrency} onChange = {onChangeCurrency}>
        {currencyOptions.map(option => {
            return <option key={option} value={option}> {option} </option>
          })}
        </select>
        
        </>
    )
}
