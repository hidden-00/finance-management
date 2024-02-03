import './App.css';
import AuthProvider from './provider/auth';
import { Route, Router, Routes } from 'react-router-dom';
import Login from './components/login';
import PrivateRoute from './routes/PrivateRoute';
import Dashboard from './components/dashboard';

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard"  element={<PrivateRoute>
              <Dashboard/>
            </PrivateRoute>}/>
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
