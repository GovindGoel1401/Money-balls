export function useCurrencify(amount) {
    let posNegSymbol = ''
    if (amount > 0) posNegSymbol = '+'
    else if (amount < 0) posNegSymbol = '-'
    const currencySymbol = '$',
          amountPositive= Math.abs(amount)
  
    if (typeof amount !== 'number') {
      amount = Number(amount) || 0
    }
    
    const amountFormatted = amountPositive.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
}