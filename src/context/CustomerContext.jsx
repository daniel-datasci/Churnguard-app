import { createContext, useContext, useMemo } from 'react';
import { generateCustomers } from '../data/generateData';

const CustomerContext = createContext(null);

export function CustomerProvider({ children }) {
  const data = useMemo(() => generateCustomers(), []);
  return (
    <CustomerContext.Provider value={data}>
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomers() {
  const ctx = useContext(CustomerContext);
  if (!ctx) throw new Error('useCustomers must be used within CustomerProvider');
  return ctx;
}