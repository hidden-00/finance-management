import './App.css';
import AuthProvider from './provider/auth';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Login from './components/login';
import PrivateRoute from './routes/PrivateRoute';
import Dashboard from './components/dashboard';
import Signin from './components/signin';
import ListFinance from './components/finance/ListFinance';
import Profile from './components/profile';
import LogLogin from './components/logLogin';
import "react-windows-ui/config/app-config.css";
import "react-windows-ui/dist/react-windows-ui.min.css";
import "react-windows-ui/icons/winui-icons.min.css";

function App() {
  return (
    <div>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path='/' element={<Navigate to={'/dashboard'}/>}/>
            <Route path="/login" element={<Login />} />
            <Route path="/signin" element={<Signin />} />
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path='/finance/:id' element={<ListFinance/>}/>
              <Route path='/profile' element={<Profile/>}/>
              <Route path='/logs' element={<LogLogin/>}/>
            </Route>
            <Route path='*' element={<Navigate to={'/dashboard'}/>}/>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
