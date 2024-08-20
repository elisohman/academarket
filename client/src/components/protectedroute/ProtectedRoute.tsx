import {useAuthContext} from '../../contexts/AuthContext';
import {Navigate} from 'react-router-dom';

const ProtectedRoute = ({ children }: { children: JSX.Element }): JSX.Element => {
    let {authTokens} = useAuthContext();

    if (!authTokens) {
        console.log('User not logged in');
        return <Navigate to="/signin" replace />;
    }

    return children;
};

export default ProtectedRoute;