import './App.css';
import AuthProvider from './provider/auth';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Login from './components/login';
import PrivateRoute from './routes/PrivateRoute';
import Register from './components/register';
import Feature from './components/feature';
import Finance from './components/finance';
import ListGroup from './components/finance/listGroup';

function App() {
  return (
    <div>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path='/' element={<Navigate to={'/feature'}/>}/>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<PrivateRoute />}>
              <Route path="/feature" element={<Feature />} />
              <Route path='/group' element={<ListGroup/>}/>
              <Route path='/group/:id' element={<Finance/>}/>
            </Route>
            <Route path='*' element={<Navigate to={'/feature'}/>}/>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
