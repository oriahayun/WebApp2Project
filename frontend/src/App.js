import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import RequireUser from './components/RequiredUser';
import UnauthorizePage from './pages/Unauthorized';
import Users from './pages/Users';
import UserDetail from './pages/UserDetail';

function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />

          {/* Private Route */}
          <Route element={<RequireUser allowedRoles={['user', 'admin']} />}>
            {/* <Route path='profile' element={<ProfilePage />} /> */}
            <Route path='admin/dashboard' element={<AdminDashboard />} />
            <Route path='admin/users/edit/:id' element={<UserDetail />} />
          </Route>
          {/* <Route element={<RequireUser allowedRoles={['admin']} />}> */}
            <Route path='admin/users' element={<Users />} />
          {/* </Route> */}
          <Route path='unauthorized' element={<UnauthorizePage />} />
        </Route>
        <Route path='admin/login' element={<AdminLogin />} />
        <Route path='login' element={<Login />} />
        <Route path='register' element={<Register />} />
      </Routes>
    </>
  );
}

export default App;
