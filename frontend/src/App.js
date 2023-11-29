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
import Error404 from './pages/Error404';
import Profile from './pages/Profile';
import Salons from './pages/Salons';
import SalonCreate from './pages/SalonCreate';
import SalonEdit from './pages/SalonEdit';
import AdminAppointments from './pages/AdminAppointments';
import Dashboard from './pages/Dashboard';
import Appointments from './pages/Appointments';
import AppointmentEdit from './pages/AppointmentEdit';
import AppointmentCreate from './pages/AppointmentCreate';

function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />

          {/* Private Route */}
          <Route element={<RequireUser allowedRoles={['user']} />}>
            <Route path='profile' element={<Profile />} />
            <Route path='dashboard' element={<Dashboard />} />
            <Route path='appointments' element={<Appointments />} />
            <Route path='admin/appointments/create' element={<AppointmentCreate />} />
            <Route path='admin/appointments/edit/:id' element={<AppointmentEdit />} />
          </Route>
          <Route element={<RequireUser allowedRoles={['admin']} />}>
            <Route path='admin/users' element={<Users />} />
            <Route path='admin/salons' element={<Salons />} />
            <Route path='admin/salons/create' element={<SalonCreate />} />
            <Route path='admin/dashboard' element={<AdminDashboard />} />
            <Route path='admin/salons/edit/:id' element={<SalonEdit />} />
            <Route path='admin/users/edit/:id' element={<UserDetail />} />
            <Route path='admin/appointments' element={<AdminAppointments />} />
          </Route>
        </Route>
        <Route path='unauthorized' element={<UnauthorizePage />} />
        <Route path='admin/login' element={<AdminLogin />} />
        <Route path='login' element={<Login />} />
        <Route path='register' element={<Register />} />
        
        {/* NotFound Error page */}
        <Route path='*' element={<Error404 />} />
      </Routes>
    </>
  );
}

export default App;
