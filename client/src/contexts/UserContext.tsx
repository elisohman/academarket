import { createContext, useContext, useState, ReactNode } from 'react';
import { useAuthContext } from './AuthContext';
import useAPI from '../utils/network';

// Define the type for the context value
type UserContextType = {
    userInfo: any;
    updateUserInfo: () => Promise<void>;
}

// Create a context with the defined type
const UserContext = createContext<UserContextType | undefined>(undefined);
export default UserContext;

// Create a provider component
export const UserProvider = ({ children }: {children: ReactNode}) => {
    const { authTokens } = useAuthContext();
    const sendRequest = useAPI();
    const [userInfo, setUserInfo] = useState<any>(null);

    const updateUserInfo = async () => {
        if (!authTokens) {
            return;
        }
        try {
            const response = await sendRequest('/user_info/', 'GET');
            if (response && response.status == 200) {
                const responseData = await response.data;
                setUserInfo(responseData);
            } else {
                console.log('Error when getting user info');
            }
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    }

    return (
        <UserContext.Provider value={{ userInfo, updateUserInfo }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook for easy access to context
export const useUserContext = (): UserContextType => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUserContext must be used within a UserProvider');
    }
    return context;
};
