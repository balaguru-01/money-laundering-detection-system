import { useState, useEffect } from "react";
import {
  subscribeToAlerts,
  unsubscribeFromAlerts,
} from "../services/socketService";

export const useAlerts = (initialAlerts = []) => {
  const [alerts, setAlerts] = useState(initialAlerts);

  useEffect(() => {
    subscribeToAlerts((newAlert) => {
      setAlerts((prevAlerts) => [newAlert, ...prevAlerts]);
    });

    return () => {
      unsubscribeFromAlerts();
    };
  }, []);

  return alerts;
};

export const useTransactions = (initialTransactions = []) => {
  const [transactions, setTransactions] = useState(initialTransactions);

  useEffect(() => {
    const {
      subscribeToTransactions,
      unsubscribeFromTransactions,
    } = require("../services/socketService");
    subscribeToTransactions((newTransaction) => {
      setTransactions((prevTransactions) => [
        newTransaction,
        ...prevTransactions,
      ]);
    });

    return () => {
      unsubscribeFromTransactions();
    };
  }, []);

  return transactions;
};
