import './App.css';
import ChangePassword from './Pages/ChangePassword';
import Login from './Pages/Login';
import Home from './Pages/Home';
import Register from './Pages/Register';
import { BrowserRouter , Routes, Route } from 'react-router-dom';
import ResetPasswordConfirm from './Pages/ResetPasswordConfirm';
import EmailVerification from './Pages/EmailVerification';
import ProtectedRoute from './Component/ProtectedRoute';
import Layout from './layout';
import StatCards from './Component/StatCards';
import OrdersTable from './Component/OrdersTable';
import SalesChart from './Component/SalesChart';



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
            <Layout>
              <StatCards/>
              <OrdersTable/>
              <SalesChart/>
            </Layout>
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
