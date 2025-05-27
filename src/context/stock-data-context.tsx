import React from "react";
import { StockDataPoint } from "../types/stock-types";
import { generateMockStockData, predictStockPrices } from "../utils/stock-utils";

interface StockDataContextType {
  stockData: StockDataPoint[];
  predictedData: StockDataPoint[];
  isLoading: boolean;
  error: string | null;
  algorithm: string;
  setAlgorithm: (algo: string) => void;
  predictionDays: number;
  setPredictionDays: (days: number) => void;
  stockSymbol: string;
  setStockSymbol: (symbol: string) => void;
  generatePrediction: () => void;
  predictionAccuracy: number;
}

const StockDataContext = React.createContext<StockDataContextType | undefined>(undefined);

export const StockDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stockData, setStockData] = React.useState<StockDataPoint[]>([]);
  const [predictedData, setPredictedData] = React.useState<StockDataPoint[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [algorithm, setAlgorithm] = React.useState<string>("dp-optimal");
  const [predictionDays, setPredictionDays] = React.useState<number>(7);
  const [stockSymbol, setStockSymbol] = React.useState<string>("AAPL");
  const [predictionAccuracy, setPredictionAccuracy] = React.useState<number>(85);

  // Load initial stock data
  React.useEffect(() => {
    setStockData(generateMockStockData(30, "AAPL"));
  }, []);

  const generatePrediction = () => {
    if (!stockSymbol) {
      setError("Please enter a stock symbol");
      return;
    }

    setIsLoading(true);
    setError(null);

    // Simulate API call delay
    setTimeout(() => {
      try {
        // Generate new historical data for the selected stock
        const newHistoricalData = generateMockStockData(30, stockSymbol);
        setStockData(newHistoricalData);

        // Generate prediction based on the algorithm
        const prediction = predictStockPrices(
          newHistoricalData,
          predictionDays,
          algorithm
        );
        setPredictedData(prediction);

        // Generate a realistic accuracy based on the algorithm and days
        const baseAccuracy = 
          algorithm === "dp-optimal" ? 88 :
          algorithm === "dp-memoization" ? 86 :
          algorithm === "dp-tabulation" ? 85 :
          algorithm === "linear-regression" ? 82 : 85;
        
        // Accuracy decreases as prediction days increase
        const dayFactor = Math.max(0, 1 - (predictionDays / 100));
        const randomFactor = Math.random() * 5 - 2.5; // +/- 2.5%
        const calculatedAccuracy = Math.min(99, Math.max(60, baseAccuracy * dayFactor + randomFactor));
        
        setPredictionAccuracy(parseFloat(calculatedAccuracy.toFixed(1)));
        
        setIsLoading(false);
      } catch (err) {
        setError("Failed to generate prediction. Please try again.");
        setIsLoading(false);
      }
    }, 1500);
  };

  const value = {
    stockData,
    predictedData,
    isLoading,
    error,
    algorithm,
    setAlgorithm,
    predictionDays,
    setPredictionDays,
    stockSymbol,
    setStockSymbol,
    generatePrediction,
    predictionAccuracy
  };

  return (
    <StockDataContext.Provider value={value}>
      {children}
    </StockDataContext.Provider>
  );
};

export const useStockData = (): StockDataContextType => {
  const context = React.useContext(StockDataContext);
  if (context === undefined) {
    throw new Error("useStockData must be used within a StockDataProvider");
  }
  return context;
};