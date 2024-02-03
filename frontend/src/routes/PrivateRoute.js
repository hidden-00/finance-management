const { Navigate, Outlet } = require("react-router-dom");
const { useAuth } = require("../provider/auth")

const PrivateRoute = ()=>{
    const auth = useAuth();
    console.log(auth)
    if(!auth.token) return <Navigate to='/login'/>
    return <Outlet/>;
}

export default PrivateRoute;