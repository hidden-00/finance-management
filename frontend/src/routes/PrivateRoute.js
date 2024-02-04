import Header from "../components/header";

const { Navigate, Outlet } = require("react-router-dom");
const { useAuth } = require("../provider/auth")

const PrivateRoute = ()=>{
    const auth = useAuth();
    console.log(auth)
    if(!auth.token) return <Navigate to='/login'/>
    return (
        <>
            <Header/>
            <Outlet/>
        </>
    );
}

export default PrivateRoute;