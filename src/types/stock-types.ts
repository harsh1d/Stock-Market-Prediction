export interface StockDataPoint {
  date: string;
  price: number;
  volume: number;
  isPredicted: boolean;
}

export type Algorithm = 
  | "dp-optimal" 
  | "dp-memoization" 
  | "dp-tabulation" 
  | "linear-regression";
