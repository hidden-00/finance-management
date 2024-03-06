import './App.css';
import AuthProvider from './provider/auth';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Login from './components/login';
import PrivateRoute from './routes/PrivateRoute';
import Dashboard from './components/dashboard';
import Signin from './components/signin';
import ListFinance from './components/finance/ListFinance';
import Profile from './components/profile';

function App() {
  return (
    <div className="App">
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
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
