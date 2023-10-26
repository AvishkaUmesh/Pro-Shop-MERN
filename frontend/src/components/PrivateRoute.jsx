import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
    const { userInfo } = useSelector((state) => state.auth);

    if (!userInfo) {
        return <Navigate to="/login" />;
    }

    return <Outlet />;
};
export default PrivateRoute;
