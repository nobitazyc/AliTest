function maxProfit(prices) {
  let minprice = Number.MAX_SAFE_INTEGER;
  let profit = 0;
  for (let i = 0; i < prices.length; i++) {
    if (prices[i] < minprice) minprice = prices[i];
    else if (prices[i] - minprice > profit) profit = prices[i] - minprice;
  }
  console.log(profit);
}
maxProfit([7, 1, 6, 3, 9, 4]);