import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { StockDataPoint } from "../types/stock-types";

interface StockChartProps {
  historicalData: StockDataPoint[];
  predictedData: StockDataPoint[];
}

export const StockChart: React.FC<StockChartProps> = ({ historicalData, predictedData }) => {
  const combinedData = [
    ...historicalData,
    ...predictedData
  ];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      const isPrediction = dataPoint.isPredicted;
      
      return (
        <div className="bg-content1 p-3 rounded-medium shadow-md border border-default-200">
          <p className="font-medium">{new Date(dataPoint.date).toLocaleDateString()}</p>
          <p className="text-small">
            <span className="font-medium">Price:</span> {formatPrice(dataPoint.price)}
          </p>
          {isPrediction && (
            <p className="text-small text-primary-500 font-medium">Predicted Value</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={combinedData}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="historicalGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--heroui-primary-500))" stopOpacity={0.3} />
            <stop offset="95%" stopColor="hsl(var(--heroui-primary-500))" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="predictedGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--heroui-success-500))" stopOpacity={0.3} />
            <stop offset="95%" stopColor="hsl(var(--heroui-success-500))" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis 
          dataKey="date" 
          tickFormatter={formatDate} 
          tick={{ fontSize: 12 }}
        />
        <YAxis 
          tickFormatter={formatPrice}
          tick={{ fontSize: 12 }}
          domain={['auto', 'auto']}
        />
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Area
          type="monotone"
          dataKey="price"
          name="Historical Price"
          data={historicalData}
          stroke="hsl(var(--heroui-primary-500))"
          fillOpacity={1}
          fill="url(#historicalGradient)"
          strokeWidth={2}
          activeDot={{ r: 6 }}
          isAnimationActive={true}
          animationDuration={1000}
        />
        {predictedData.length > 0 && (
          <Area
            type="monotone"
            dataKey="price"
            name="Predicted Price"
            data={predictedData}
            stroke="hsl(var(--heroui-success-500))"
            fillOpacity={1}
            fill="url(#predictedGradient)"
            strokeWidth={2}
            strokeDasharray="5 5"
            activeDot={{ r: 6 }}
            isAnimationActive={true}
            animationDuration={1000}
            animationBegin={500}
          />
        )}
      </AreaChart>
    </ResponsiveContainer>
  );
};