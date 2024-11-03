import './App.css';
import ChangePassword from './Pages/ChangePassword';
import Login from './Pages/Login';
import Home from './Pages/Home';
import Register from './Pages/Register';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="change-password" element={<ChangePassword/>} />
      </Routes>
    </Router>
  );
};

export default App;
