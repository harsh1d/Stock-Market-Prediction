import React from "react";
import { Accordion, AccordionItem, Code } from "@heroui/react";
import { Icon } from "@iconify/react";

interface AlgorithmInfoProps {
  algorithm: string;
}

export const AlgorithmInfo: React.FC<AlgorithmInfoProps> = ({ algorithm }) => {
  const algorithmDetails = {
    "dp-optimal": {
      name: "Dynamic Programming Optimal Trading",
      description: "This algorithm uses dynamic programming to find the optimal trading strategy by calculating the maximum profit possible from a series of stock prices. It considers buying and selling multiple times to maximize profit.",
      complexity: "Time Complexity: O(n), Space Complexity: O(1)",
      pseudocode: `function maxProfit(prices):
    maxProfit = 0
    for i from 1 to prices.length - 1:
        if prices[i] > prices[i-1]:
            maxProfit += prices[i] - prices[i-1]
    return maxProfit`,
      advantages: [
        "Optimal solution guaranteed",
        "Linear time complexity",
        "Constant space complexity",
        "Works well with volatile markets"
      ],
      limitations: [
        "Assumes no transaction costs",
        "Requires complete price history",
        "Cannot handle constraints on number of transactions"
      ]
    },
    "dp-memoization": {
      name: "Dynamic Programming with Memoization",
      description: "This top-down approach uses recursion with memoization to avoid redundant calculations. It's particularly effective for problems with overlapping subproblems.",
      complexity: "Time Complexity: O(n), Space Complexity: O(n)",
      pseudocode: `function maxProfit(prices):
    memo = {}
    
    function dp(i, holding):
        if i >= prices.length:
            return 0
            
        if (i, holding) in memo:
            return memo[(i, holding)]
            
        // Skip this day
        skip = dp(i+1, holding)
        
        if holding:
            // Sell
            sell = prices[i] + dp(i+1, false)
            memo[(i, holding)] = max(skip, sell)
        else:
            // Buy
            buy = -prices[i] + dp(i+1, true)
            memo[(i, holding)] = max(skip, buy)
            
        return memo[(i, holding)]
        
    return dp(0, false)`,
      advantages: [
        "Avoids redundant calculations",
        "Works well for complex constraints",
        "Can be adapted for various trading rules",
        "Good for problems with overlapping subproblems"
      ],
      limitations: [
        "Higher space complexity than tabulation",
        "Stack overflow risk for large inputs",
        "Recursive calls add overhead"
      ]
    },
    "dp-tabulation": {
      name: "Dynamic Programming with Tabulation",
      description: "This bottom-up approach builds a table of solutions for subproblems, eliminating recursion and improving space efficiency.",
      complexity: "Time Complexity: O(n), Space Complexity: O(n)",
      pseudocode: `function maxProfit(prices):
    n = prices.length
    
    // dp[i][0] = max profit on day i without stock
    // dp[i][1] = max profit on day i with stock
    dp = array of size [n][2] filled with 0
    
    dp[0][0] = 0
    dp[0][1] = -prices[0]
    
    for i from 1 to n-1:
        dp[i][0] = max(dp[i-1][0], dp[i-1][1] + prices[i])
        dp[i][1] = max(dp[i-1][1], dp[i-1][0] - prices[i])
    
    return dp[n-1][0]`,
      advantages: [
        "No recursion overhead",
        "No risk of stack overflow",
        "Efficient for large datasets",
        "Easier to analyze space complexity"
      ],
      limitations: [
        "Must solve all subproblems",
        "May use unnecessary space for sparse problems",
        "Less intuitive than recursive approach"
      ]
    },
    "linear-regression": {
      name: "Linear Regression",
      description: "While not a dynamic programming approach, linear regression is commonly used for stock price prediction. It fits a linear model to historical data to predict future values.",
      complexity: "Time Complexity: O(n), Space Complexity: O(1)",
      pseudocode: `function linearRegression(x, y):
    n = x.length
    
    // Calculate means
    x_mean = sum(x) / n
    y_mean = sum(y) / n
    
    // Calculate coefficients
    numerator = 0
    denominator = 0
    
    for i from 0 to n-1:
        numerator += (x[i] - x_mean) * (y[i] - y_mean)
        denominator += (x[i] - x_mean)^2
    
    slope = numerator / denominator
    intercept = y_mean - slope * x_mean
    
    // Predict function
    function predict(x_new):
        return intercept + slope * x_new
        
    return predict`,
      advantages: [
        "Simple to implement and understand",
        "Works well for stable trends",
        "Fast computation",
        "Easy to interpret results"
      ],
      limitations: [
        "Assumes linear relationship",
        "Sensitive to outliers",
        "Poor for volatile or cyclical stocks",
        "Cannot capture complex market patterns"
      ]
    }
  };

  const currentAlgorithm = algorithmDetails[algorithm as keyof typeof algorithmDetails] || algorithmDetails["dp-optimal"];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-medium mb-2">{currentAlgorithm.name}</h2>
        <p className="text-default-600">{currentAlgorithm.description}</p>
        
        <div className="mt-4 p-3 bg-content2 rounded-medium">
          <div className="flex items-center gap-2 text-small font-medium">
            <Icon icon="lucide:clock" />
            <span>Complexity:</span>
            <span className="text-default-600">{currentAlgorithm.complexity}</span>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-medium font-medium mb-2">Pseudocode</h3>
        <Code className="w-full">
          {currentAlgorithm.pseudocode}
        </Code>
      </div>
      
      <Accordion>
        <AccordionItem
          key="advantages"
          aria-label="Advantages"
          title={
            <div className="flex items-center gap-2">
              <Icon icon="lucide:check-circle" className="text-success" />
              <span>Advantages</span>
            </div>
          }
        >
          <ul className="list-disc pl-6 space-y-1">
            {currentAlgorithm.advantages.map((advantage, index) => (
              <li key={index} className="text-default-600">{advantage}</li>
            ))}
          </ul>
        </AccordionItem>
        
        <AccordionItem
          key="limitations"
          aria-label="Limitations"
          title={
            <div className="flex items-center gap-2">
              <Icon icon="lucide:alert-circle" className="text-warning" />
              <span>Limitations</span>
            </div>
          }
        >
          <ul className="list-disc pl-6 space-y-1">
            {currentAlgorithm.limitations.map((limitation, index) => (
              <li key={index} className="text-default-600">{limitation}</li>
            ))}
          </ul>
        </AccordionItem>
      </Accordion>
    </div>
  );
};