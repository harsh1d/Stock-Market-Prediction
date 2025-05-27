import { StockDataPoint } from "../types/stock-types";

// Generate mock historical stock data
export const generateMockStockData = (days: number, symbol: string): StockDataPoint[] => {
  const data: StockDataPoint[] = [];
  
  // Base price depends on the stock symbol to make it more realistic
  let basePrice = 0;
  switch (symbol.toUpperCase()) {
    case "AAPL":
      basePrice = 180;
      break;
    case "MSFT":
      basePrice = 350;
      break;
    case "GOOGL":
      basePrice = 140;
      break;
    case "AMZN":
      basePrice = 160;
      break;
    case "META":
      basePrice = 450;
      break;
    case "TSLA":
      basePrice = 200;
      break;
    default:
      basePrice = 100 + Math.random() * 200;
  }
  
  // Volatility factor
  const volatility = 0.02; // 2% daily volatility
  
  // Generate data for the past 'days'
  const today = new Date();
  let currentPrice = basePrice;
  
  for (let i = days; i > 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    // Random daily change with slight upward bias
    const change = (Math.random() - 0.48) * volatility * currentPrice;
    currentPrice += change;
    
    // Ensure price doesn't go below a reasonable value
    if (currentPrice < basePrice * 0.7) {
      currentPrice = basePrice * 0.7 + Math.random() * 5;
    }
    
    data.push({
      date: date.toISOString(),
      price: parseFloat(currentPrice.toFixed(2)),
      volume: Math.floor(1000000 + Math.random() * 9000000),
      isPredicted: false
    });
  }
  
  return data;
};

// Predict future stock prices based on historical data and algorithm
export const predictStockPrices = (
  historicalData: StockDataPoint[],
  days: number,
  algorithm: string
): StockDataPoint[] => {
  const predictedData: StockDataPoint[] = [];
  
  if (historicalData.length === 0) return predictedData;
  
  const lastDate = new Date(historicalData[historicalData.length - 1].date);
  const lastPrice = historicalData[historicalData.length - 1].price;
  
  // Different algorithms have slightly different prediction patterns
  let trendFactor = 0;
  let volatilityFactor = 0;
  
  switch (algorithm) {
    case "dp-optimal":
      // More optimistic predictions with moderate volatility
      trendFactor = 0.002;
      volatilityFactor = 0.015;
      break;
    case "dp-memoization":
      // Slightly less optimistic with similar volatility
      trendFactor = 0.0015;
      volatilityFactor = 0.018;
      break;
    case "dp-tabulation":
      // Balanced approach
      trendFactor = 0.001;
      volatilityFactor = 0.016;
      break;
    case "linear-regression":
      // More stable predictions with less volatility
      trendFactor = 0.0008;
      volatilityFactor = 0.01;
      break;
    default:
      trendFactor = 0.001;
      volatilityFactor = 0.015;
  }
  
  // Calculate price trend from historical data
  const priceChanges = [];
  for (let i = 1; i < historicalData.length; i++) {
    const change = (historicalData[i].price - historicalData[i-1].price) / historicalData[i-1].price;
    priceChanges.push(change);
  }
  
  // Calculate average trend
  const avgTrend = priceChanges.reduce((sum, change) => sum + change, 0) / priceChanges.length;
  
  // Use the calculated trend with some randomness for predictions
  let currentPrice = lastPrice;
  
  for (let i = 1; i <= days; i++) {
    const nextDate = new Date(lastDate);
    nextDate.setDate(lastDate.getDate() + i);
    
    // Calculate next price with trend and volatility
    const randomFactor = (Math.random() - 0.5) * 2; // -1 to 1
    const trendChange = (avgTrend + trendFactor) * currentPrice;
    const volatilityChange = randomFactor * volatilityFactor * currentPrice;
    currentPrice += trendChange + volatilityChange;
    
    // Ensure price doesn't go negative
    if (currentPrice < 0) currentPrice = lastPrice * 0.8;
    
    predictedData.push({
      date: nextDate.toISOString(),
      price: parseFloat(currentPrice.toFixed(2)),
      volume: Math.floor(1000000 + Math.random() * 9000000),
      isPredicted: true
    });
  }
  
  return predictedData;
};

// Dynamic Programming implementation for optimal stock trading
// This is a simplified version of the algorithm for demonstration purposes
export const dpOptimalTrading = (prices: number[]): number => {
  let maxProfit = 0;
  
  for (let i = 1; i < prices.length; i++) {
    if (prices[i] > prices[i-1]) {
      maxProfit += prices[i] - prices[i-1];
    }
  }
  
  return maxProfit;
};

// Dynamic Programming with memoization for stock trading
export const dpMemoization = (prices: number[]): number => {
  const memo: Record<string, number> = {};
  
  const dp = (day: number, holding: boolean): number => {
    if (day >= prices.length) return 0;
    
    const key = `${day}-${holding}`;
    if (memo[key] !== undefined) return memo[key];
    
    // Skip this day
    const skip = dp(day + 1, holding);
    
    let result;
    if (holding) {
      // Sell
      const sell = prices[day] + dp(day + 1, false);
      result = Math.max(skip, sell);
    } else {
      // Buy
      const buy = -prices[day] + dp(day + 1, true);
      result = Math.max(skip, buy);
    }
    
    memo[key] = result;
    return result;
  };
  
  return dp(0, false);
};

// Dynamic Programming with tabulation for stock trading
export const dpTabulation = (prices: number[]): number => {
  const n = prices.length;
  if (n <= 1) return 0;
  
  // dp[i][0] = max profit on day i without stock
  // dp[i][1] = max profit on day i with stock
  const dp: number[][] = Array(n).fill(0).map(() => [0, 0]);
  
  dp[0][0] = 0;
  dp[0][1] = -prices[0];
  
  for (let i = 1; i < n; i++) {
    dp[i][0] = Math.max(dp[i-1][0], dp[i-1][1] + prices[i]);
    dp[i][1] = Math.max(dp[i-1][1], dp[i-1][0] - prices[i]);
  }
  
  return dp[n-1][0];
};

// Linear regression for stock price prediction
export const linearRegression = (x: number[], y: number[]): (x: number) => number => {
  const n = x.length;
  
  // Calculate means
  const xMean = x.reduce((sum, val) => sum + val, 0) / n;
  const yMean = y.reduce((sum, val) => sum + val, 0) / n;
  
  // Calculate coefficients
  let numerator = 0;
  let denominator = 0;
  
  for (let i = 0; i < n; i++) {
    numerator += (x[i] - xMean) * (y[i] - yMean);
    denominator += Math.pow(x[i] - xMean, 2);
  }
  
  const slope = numerator / denominator;
  const intercept = yMean - slope * xMean;
  
  // Return prediction function
  return (xNew: number) => intercept + slope * xNew;
};
