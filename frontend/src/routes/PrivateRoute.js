const { Navigate, Outlet } = require("react-router-dom");
const { useAuth } = require("../provider/auth")

const PrivateRoute = ({children})=>{
    const user = useAuth();
    if(!user.token) return <Navigate to='/login'/>
    return children;
}

export default PrivateRoute;