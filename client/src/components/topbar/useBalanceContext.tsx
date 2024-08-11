import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the type for the context value
interface BalanceContextType {
    balance: string;
    setBalance: React.Dispatch<React.SetStateAction<string>>;
}

// Create a context with the defined type
export const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

// Define the type for the provider's props
interface BalanceProviderProps {
    children: ReactNode;
}

// Create a provider component
export const BalanceProvider: React.FC<BalanceProviderProps> = ({ children }) => {
    const [balance, setBalance] = useState<string>('0');

    return (
        <BalanceContext.Provider value={{ balance, setBalance }}>
            {children}
        </BalanceContext.Provider>
    );
};

// Custom hook for easy access to context
export const useBalance = (): BalanceContextType => {
    const context = useContext(BalanceContext);
    if (context === undefined) {
        throw new Error('useBalance must be used within a BalanceProvider');
    }
    return context;
};
