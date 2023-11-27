import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getMeApi } from '../redux/api/getMeApi';
import FullScreenLoader from './FullScreenLoader';
import { getToken } from '../utils/Utils';

const RequireUser = ({ allowedRoles }) => {
    const accessToken = getToken();

    const { data: user } = getMeApi.endpoints.getMe.useQuery(null);
    const location = useLocation();

    if (accessToken && !user) {
        return <FullScreenLoader />;
    }

    return accessToken && allowedRoles.includes(user?.role) ? (
        <Outlet />
    ) : accessToken && user ? (
        <Navigate to='/unauthorized' state={{ from: location }} replace />
    ) : (
        <Navigate to='/login' state={{ from: location }} replace />
    );
};

export default RequireUser;
