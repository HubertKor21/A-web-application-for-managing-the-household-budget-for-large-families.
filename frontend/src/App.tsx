import './App.css';
import ChangePassword from './Pages/ChangePassword';
import Login from './Pages/Login';
import Home from './Pages/Home';
import Register from './Pages/Register';
import { BrowserRouter , Routes, Route } from 'react-router-dom';
import ResetPasswordConfirm from './Pages/ResetPasswordConfirm';
import EmailVerification from './Pages/EmailVerification';
import ProtectedRoute from './Component/ProtectedRoute';



function RegisterAndLogout() {
  localStorage.clear()
  return <Register/>
}

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <ProtectedRoute>
            <Home/>
          </ProtectedRoute>
        }/>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<RegisterAndLogout />} />
        <Route path="change-password" element={<ChangePassword/>} />
        <Route path="dj-rest-auth/registration/account-confirm-email/:key/" element={<EmailVerification/>}></Route>
        <Route path="reset/password/confirm/:uid/:token" element={<ResetPasswordConfirm/>}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
