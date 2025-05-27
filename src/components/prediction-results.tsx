import React from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Card, CardBody } from "@heroui/react";
import { useStockData } from "../context/stock-data-context";
import { Icon } from "@iconify/react";

export const PredictionResults = () => {
  const { predictedData, stockData, algorithm, predictionAccuracy } = useStockData();

  if (predictedData.length === 0) {
    return (
      <div className="text-center py-8">
        <Icon icon="lucide:bar-chart-2" className="text-default-300 text-6xl mx-auto mb-4" />
        <h3 className="text-xl font-medium mb-2">No Prediction Data</h3>
        <p className="text-default-500">
          Generate a prediction to see detailed results here
        </p>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString();
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  const getChangePercent = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100;
    return change.toFixed(2);
  };

  const getLastHistoricalPrice = () => {
    if (stockData.length === 0) return 0;
    return stockData[stockData.length - 1].price;
  };

  const lastPrice = getLastHistoricalPrice();
  const predictedEndPrice = predictedData.length > 0 ? predictedData[predictedData.length - 1].price : 0;
  const overallChange = ((predictedEndPrice - lastPrice) / lastPrice) * 100;
  const isPositive = overallChange >= 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardBody className="flex flex-col items-center justify-center py-6">
            <div className="text-default-500 text-small mb-1">Algorithm Used</div>
            <div className="text-xl font-semibold">{algorithm.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="flex flex-col items-center justify-center py-6">
            <div className="text-default-500 text-small mb-1">Predicted Change</div>
            <div className={`text-xl font-semibold flex items-center gap-1 ${isPositive ? 'text-success' : 'text-danger'}`}>
              {isPositive ? <Icon icon="lucide:trending-up" /> : <Icon icon="lucide:trending-down" />}
              {overallChange.toFixed(2)}%
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="flex flex-col items-center justify-center py-6">
            <div className="text-default-500 text-small mb-1">Prediction Accuracy</div>
            <div className="text-xl font-semibold">{predictionAccuracy}%</div>
          </CardBody>
        </Card>
      </div>

      <Table removeWrapper aria-label="Prediction results table">
        <TableHeader>
          <TableColumn>DATE</TableColumn>
          <TableColumn>PREDICTED PRICE</TableColumn>
          <TableColumn>CHANGE</TableColumn>
          <TableColumn>CONFIDENCE</TableColumn>
        </TableHeader>
        <TableBody>
          {predictedData.map((data, index) => {
            const prevPrice = index === 0 ? lastPrice : predictedData[index - 1].price;
            const changePercent = getChangePercent(data.price, prevPrice);
            const isPositiveChange = parseFloat(changePercent) >= 0;
            
            // Calculate confidence based on how far into the future we're predicting
            // (This is a simplified model - in a real app this would be calculated by the algorithm)
            const confidence = Math.max(95 - (index * 5), 60);
            
            return (
              <TableRow key={data.date}>
                <TableCell>{formatDate(data.date)}</TableCell>
                <TableCell>{formatPrice(data.price)}</TableCell>
                <TableCell>
                  <div className={`flex items-center gap-1 ${isPositiveChange ? 'text-success' : 'text-danger'}`}>
                    {isPositiveChange ? <Icon icon="lucide:trending-up" size={16} /> : <Icon icon="lucide:trending-down" size={16} />}
                    {changePercent}%
                  </div>
                </TableCell>
                <TableCell>
                  <Chip
                    size="sm"
                    color={confidence > 80 ? "success" : confidence > 70 ? "primary" : "warning"}
                  >
                    {confidence}%
                  </Chip>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};