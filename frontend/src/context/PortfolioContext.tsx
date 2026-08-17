"use client";

import { createContext, useContext, useEffect, useState } from "react";

import api from "@/services/api";

type Holding = {
  symbol: string;

  quantity: number;

  averagePrice: number;

  currentPrice?: number;

  currentValue?: number;

  profitLoss?: number;

  returnPercentage?: number;

  allocationPercentage?: number;
};

// type Holding = {

//  symbol: string

//  quantity: number

//  averagePrice: number

//  currentPrice?: number

//  currentValue?: number

//  profitLoss?: number

// }

type Portfolio = {
  balance: number;

  investedAmount: number;

  totalProfit: number;

  currentPortfolioValue?: number;

  totalReturnPercentage?: number;

  holdings: Holding[];
};

type Order = {
  symbol: string;

  orderType: "BUY" | "SELL";

  quantity: number;

  price: number;

  createdAt: string;
};

type PortfolioContextType = {
  portfolio: Portfolio | null;

  orders: Order[];

  loading: boolean;

  refreshPortfolio: () => Promise<void>;

  refreshOrders: () => Promise<void>;
};

const PortfolioContext = createContext<PortfolioContextType | null>(null);

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);

  const [orders, setOrders] = useState<Order[]>([]);

  const [loading, setLoading] = useState(true);

  /*
 ====================================
 FETCH PORTFOLIO
 ====================================
 */

  const refreshPortfolio = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);

        return;
      }

      /*
    FETCH PORTFOLIO
    */

      const response = await api.get("/portfolio");

      const portfolioData = response.data;

      /*
    LIVE PORTFOLIO VALUE
    */

      const currentPortfolioValue = portfolioData.holdings.reduce(
        (acc: number, holding: Holding) =>
          acc +
          holding.quantity * (holding.currentPrice || holding.averagePrice),

        0,
      );

      /*
    TOTAL INVESTED VALUE
    */

      const investedValue = portfolioData.holdings.reduce(
        (acc: number, holding: Holding) =>
          acc + holding.quantity * holding.averagePrice,

        0,
      );

      /*
    TOTAL PROFIT
    */

      const totalProfit = Number(
        (currentPortfolioValue - investedValue).toFixed(2),
      );

      /*
    RETURN %
    */

      const totalReturnPercentage =
        investedValue > 0
          ? Number(((totalProfit / investedValue) * 100).toFixed(2))
          : 0;

      /*
    UPDATE HOLDINGS LIVE VALUES
    */

      const updatedHoldings = portfolioData.holdings.map((holding: Holding) => {
        const currentPrice = holding.currentPrice || holding.averagePrice;

        const currentValue = Number(
          (holding.quantity * currentPrice).toFixed(2),
        );

        const invested = Number(
          (holding.quantity * holding.averagePrice).toFixed(2),
        );

        const profitLoss = Number((currentValue - invested).toFixed(2));

        const returnPercentage =
          invested > 0 ? Number(((profitLoss / invested) * 100).toFixed(2)) : 0;

        const allocationPercentage =
          currentPortfolioValue > 0
            ? Number(((currentValue / currentPortfolioValue) * 100).toFixed(2))
            : 0;

        return {
          ...holding,

          currentPrice,

          currentValue,

          profitLoss,

          returnPercentage,

          allocationPercentage,
        };
      });

      //

      // const updatedHoldings = portfolioData.holdings.map((holding: Holding) => {
      //   const currentPrice = holding.currentPrice || holding.averagePrice;

      //   const currentValue = Number(
      //     (holding.quantity * currentPrice).toFixed(2),
      //   );

      //   const invested = Number(
      //     (holding.quantity * holding.averagePrice).toFixed(2),
      //   );

      //   const profitLoss = Number((currentValue - invested).toFixed(2));

      //   return {
      //     ...holding,

      //     currentPrice,

      //     currentValue,

      //     profitLoss,
      //   };
      // });

      /*
    UPDATE PORTFOLIO STATE
    */

      setPortfolio({
        ...portfolioData,

        investedAmount: investedValue,

        holdings: updatedHoldings,

        totalProfit,

        currentPortfolioValue,

        totalReturnPercentage,
      });
      // setPortfolio({
      //   ...portfolioData,

      //   holdings: updatedHoldings,

      //   totalProfit,

      //   currentPortfolioValue,

      //   totalReturnPercentage,
      // });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  /*
 ====================================
 FETCH ORDERS
 ====================================
 */

  const refreshOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) return;

      const response = await api.get("/orders");

      setOrders(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  /*
 ====================================
 INITIAL LOAD
 ====================================
 */

  useEffect(() => {
    refreshPortfolio();

    refreshOrders();
  }, []);

  /*
 ====================================
 AUTO REFRESH
 ====================================
 */

  useEffect(() => {
    const interval = setInterval(() => {
      refreshPortfolio();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <PortfolioContext.Provider
      value={{
        portfolio,
        orders,
        loading,

        refreshPortfolio,
        refreshOrders,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);

  if (!context) {
    throw new Error("usePortfolio must be used inside PortfolioProvider");
  }

  return context;
};
