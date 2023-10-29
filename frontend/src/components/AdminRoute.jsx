import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
    const { userInfo } = useSelector((state) => state.auth);

    if (userInfo && userInfo.isAdmin) {
        return <Outlet />;
    }

    return <Navigate to="/login" />;
};
export default AdminRoute;
