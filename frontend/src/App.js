import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />

          {/* Private Route */}
          {/* <Route element={<RequireUser allowedRoles={['user', 'admin']} />}>
            <Route path='profile' element={<ProfilePage />} />
          </Route>
          <Route element={<RequireUser allowedRoles={['admin']} />}>
            <Route path='admin' element={<AdminPage />} />
          </Route>
          <Route path='unauthorized' element={<UnauthorizePage />} /> */}
        </Route>
        <Route path='login' element={<Login />} />
        <Route path='register' element={<Register />} />
      </Routes>
    </>
  );
}

export default App;
