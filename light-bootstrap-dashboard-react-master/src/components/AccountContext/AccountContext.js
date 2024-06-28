import React, { createContext, useState } from 'react';

export const AccountContext = createContext();

export const AccountProvider = ({ children }) => {
  const [accountValue, setAccountValue] = useState(0);
  const [transactionHistory, setTransactionHistory] = useState([]);

  return (
    <AccountContext.Provider value={{ accountValue, setAccountValue, transactionHistory, setTransactionHistory }}>
      {children}
    </AccountContext.Provider>
  );
};
