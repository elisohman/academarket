import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { AUTH_TOKENS } from '../utils/constants';

type AuthContextType = {
    authTokens: any;
    setAuthTokens: React.Dispatch<React.SetStateAction<any>>;
    user: CustomJwtPayload | null;
    setUser: React.Dispatch<React.SetStateAction<CustomJwtPayload | null>>;
    signUp: (username: string, email: string, password: string, rpt_password: string) => Promise<number>;
    signIn: (email: string, password: string) => Promise<number>;
    signOut: () => void;
};

interface CustomJwtPayload extends JwtPayload {
    user_id: string;
  }

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export default AuthContext;

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [authTokens, setAuthTokens] = 
    useState(() => 
        localStorage.getItem(AUTH_TOKENS) ? 
            JSON.parse(localStorage.getItem(AUTH_TOKENS) as string) 
            : 
            null
    );

    const [user, setUser] = 
    useState<CustomJwtPayload | null>(() => 
        localStorage.getItem(AUTH_TOKENS) ? 
            jwtDecode<CustomJwtPayload>(localStorage.getItem(AUTH_TOKENS) as string) 
            : 
            null
    );

    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const ipAddress = window.location.hostname;
    let apiUrl = ipAddress === 'localhost' ? 'http://localhost:8000/api' : `http://${ipAddress}:8000/api`;

    const signUp = async (username: string, email: string, password: string, rpt_password: string) => {
        try {
            const response = await fetch(`${apiUrl}/sign_up/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password, rpt_password })
            });

            return response.status;

        } catch (error) {
            console.error('An error occurred during signup', error);
            return 500;
        }
    };

    // Function to handle login
    const signIn = async (username: string, password: string) => {
        try {
            const response = await fetch(`${apiUrl}/token/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            if (response.ok) {
                const tokens = await response.json();
                setAuthTokens(tokens);
                setUser(jwtDecode<CustomJwtPayload>(tokens.access));
                localStorage.setItem(AUTH_TOKENS, JSON.stringify(tokens));
                setLoading(false);
                navigate('/dashboard');
            } else {
                console.error('Error:', response);
            }
            console.log('response:', response.status);
            return response.status;
        } catch (error) {
            console.error('An error occurred during signin', error);
            return 500;
        }
        
    };

    // Function to handle logout
    const signOut = async () => {
            setAuthTokens(null);
            setUser(null);
            localStorage.removeItem(AUTH_TOKENS);
            navigate('/signin');
    };

    const contextData = {
        authTokens, setAuthTokens,
        user, setUser,
        signUp, signIn, signOut,

    }

    
    useEffect(() => {
        if (authTokens) {
            setUser(jwtDecode<CustomJwtPayload>(authTokens.access));
        }
        setLoading(false);
    }, [authTokens]);

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be used within a AuthProvider');
    }
    return context;
};