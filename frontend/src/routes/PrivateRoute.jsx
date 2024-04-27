import HeaderNavigation from "../components/header";

const { Navigate, Outlet } = require("react-router-dom");
const { useAuth } = require("../provider/auth")

const PrivateRoute = () => {
    const auth = useAuth();
    if (!auth.token) return <Navigate to='/login' />
    return (
        <>
            <HeaderNavigation children={<Outlet />} />
        </>
    );
}

export default PrivateRoute;