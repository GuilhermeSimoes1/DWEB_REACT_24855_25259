import React, { createContext, useState, useEffect } from 'react';

export const AccountContext = createContext();

export const AccountProvider = ({ children }) => {
  const [accounts, setAccounts] = useState([
    { id: 1, name: 'Conta 1', accountValue: 1000 },
    { id: 2, name: 'Conta 2', accountValue: 2000 },
  ]);
  const [selectedAccountId, setSelectedAccountId] = useState(accounts[0]?.id || null);
  const [transactionHistory, setTransactionHistory] = useState([]);
  

  useEffect(() => {
    if (accounts.length === 0) {
      setSelectedAccountId(null);
    } else if (!accounts.find(account => account.id === selectedAccountId)) {
      setSelectedAccountId(accounts[0].id);
    }
  }, [accounts, selectedAccountId]);

  const getSelectedAccount = () => accounts.find(account => account.id === selectedAccountId);

  return (
    <AccountContext.Provider value={{
      accounts,
      setAccounts,
      selectedAccountId,
      setSelectedAccountId,
      getSelectedAccount,
      transactionHistory,
      setTransactionHistory,
    }}>
      {children}
    </AccountContext.Provider>
  );
};
