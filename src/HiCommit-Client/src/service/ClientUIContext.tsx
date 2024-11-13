
import React, { createContext, useContext, useState } from 'react';

interface ClientUIContextProps {
    loading: boolean;
    expanded: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}

const ClientUIContext = createContext<ClientUIContextProps | undefined>(undefined);

export const ClientUIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState(true);

    return (
        <ClientUIContext.Provider value={{ loading, setLoading, expanded, setExpanded }}>
            {children}
        </ClientUIContext.Provider>
    );
};

export const useClientUI = () => {
    const context = useContext(ClientUIContext);
    if (context === undefined) {
        throw new Error('useLogin must be used within a LoginProvider');
    }
    return context;
};