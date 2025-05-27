import React from "react";
import { Card, CardBody, CardHeader, Divider } from "@heroui/react";
import { StockPricePredictor } from "./components/stock-price-predictor";
import { StockDataProvider } from "./context/stock-data-context";

export default function App() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <Card className="max-w-6xl mx-auto">
        <CardHeader className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold">Dynamic Programming Stock Price Predictor</h1>
          <p className="text-default-500">
            Predict future stock prices using dynamic programming algorithms
          </p>
        </CardHeader>
        <Divider />
        <CardBody>
          <StockDataProvider>
            <StockPricePredictor />
          </StockDataProvider>
        </CardBody>
      </Card>
    </div>
  );
}