import React from "react";
import { motion } from "framer-motion";
import { Button, Input, Select, SelectItem, Spinner, Tabs, Tab, Card, CardBody } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useStockData } from "../context/stock-data-context";
import { StockChart } from "./stock-chart";
import { PredictionResults } from "./prediction-results";
import { AlgorithmInfo } from "./algorithm-info";

export const StockPricePredictor = () => {
  const { 
    stockData, 
    predictedData, 
    isLoading, 
    algorithm, 
    setAlgorithm, 
    predictionDays, 
    setPredictionDays, 
    stockSymbol, 
    setStockSymbol, 
    generatePrediction, 
    error 
  } = useStockData();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generatePrediction();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardBody>
              <div className="h-[400px]">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <Spinner size="lg" />
                  </div>
                ) : (
                  <StockChart 
                    historicalData={stockData} 
                    predictedData={predictedData}
                  />
                )}
              </div>
            </CardBody>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="h-full">
            <CardBody>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <h2 className="text-xl font-medium">Prediction Parameters</h2>
                
                <Input
                  label="Stock Symbol"
                  placeholder="e.g. AAPL, MSFT, GOOGL"
                  value={stockSymbol}
                  onValueChange={setStockSymbol}
                  startContent={<Icon icon="lucide:trending-up" className="text-default-400" />}
                  isRequired
                />
                
                <Select
                  label="Algorithm"
                  placeholder="Select an algorithm"
                  selectedKeys={[algorithm]}
                  onChange={(e) => setAlgorithm(e.target.value)}
                  isRequired
                >
                  <SelectItem key="dp-optimal" value="dp-optimal">DP Optimal Trading</SelectItem>
                  <SelectItem key="dp-memoization" value="dp-memoization">DP with Memoization</SelectItem>
                  <SelectItem key="dp-tabulation" value="dp-tabulation">DP with Tabulation</SelectItem>
                  <SelectItem key="linear-regression" value="linear-regression">Linear Regression</SelectItem>
                </Select>
                
                <Input
                  type="number"
                  label="Prediction Days"
                  placeholder="Number of days to predict"
                  value={predictionDays.toString()}
                  onValueChange={(value) => setPredictionDays(parseInt(value) || 7)}
                  min={1}
                  max={30}
                  isRequired
                />
                
                <div className="mt-2">
                  <Button 
                    type="submit" 
                    color="primary" 
                    className="w-full"
                    startContent={<Icon icon="lucide:calculator" />}
                    isLoading={isLoading}
                    isDisabled={isLoading}
                  >
                    Generate Prediction
                  </Button>
                </div>

                {error && (
                  <div className="text-danger text-small mt-2">{error}</div>
                )}
              </form>
            </CardBody>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Tabs aria-label="Prediction information">
          <Tab key="results" title={
            <div className="flex items-center gap-2">
              <Icon icon="lucide:bar-chart-2" />
              <span>Prediction Results</span>
            </div>
          }>
            <Card>
              <CardBody>
                <PredictionResults />
              </CardBody>
            </Card>
          </Tab>
          <Tab key="algorithm" title={
            <div className="flex items-center gap-2">
              <Icon icon="lucide:code" />
              <span>Algorithm Details</span>
            </div>
          }>
            <Card>
              <CardBody>
              <AlgorithmInfo algorithm={algorithm} />
              </CardBody>
            </Card>
          </Tab>
        </Tabs>
      </motion.div>
    </div>
  );
};