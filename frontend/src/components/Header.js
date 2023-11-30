/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from 'reactstrap';
import { toast } from 'react-toastify';
import userImg from '../assets/images/user.png';
import logoImg from '../assets/images/logo.png';
import { getToken, getUserData } from '../utils/Utils';
import { useLogoutUserMutation } from '../redux/api/getMeApi';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [logoutUser, { isLoading, isSuccess, error, isError }] =
        useLogoutUserMutation();
    const accessToken = getToken();
    const userData = JSON.parse(getUserData());
    const navigate = useNavigate();
    const toggle = () => setIsOpen(!isOpen);

    useEffect(() => {
        if (isSuccess) {
            window.location.href = '/login';
        }

        if (isError) {
            toast.error(error.data.message, {
                position: 'top-right',
            });
        }
    }, [isLoading]);

    const onLogoutHandler = async () => {
        logoutUser();
    };

    return (
        <header>
            <div className='container'>
                <Navbar color="dark" dark expand="md">
                    <NavbarBrand href={accessToken ? userData?.role === 'admin' ? '/admin/dashboard' : '/dashboard' : '/'}>
                        <img src={logoImg} alt='beautySN' style={{ height: '55px', width: 'auto' }} />
                    </NavbarBrand>
                    <NavbarToggler onClick={toggle} className="ms-auto" />
                    <Collapse isOpen={isOpen} navbar>
                        <Nav className="ms-auto" navbar>
                            {!accessToken && (
                                <>
                                    <NavItem className='nav-item-responsive'>
                                        <NavLink onClick={() => navigate('/')}>Home</NavLink>
                                    </NavItem>
                                    <NavItem className='nav-item-responsive'>
                                        <NavLink onClick={() => navigate('/admin/login')}>Admin Login</NavLink>
                                    </NavItem>
                                    <NavItem className='nav-item-responsive'>
                                        <NavLink onClick={() => navigate('/login')}>Login</NavLink>
                                    </NavItem>
                                    <NavItem className='nav-item-responsive'>
                                        <NavLink onClick={() => navigate('/register')}>Register</NavLink>
                                    </NavItem>
                                </>
                            )}

                            {accessToken && userData?.role === 'admin' && (
                                <>
                                    <NavItem className='nav-item-responsive'>
                                        <NavLink onClick={() => navigate('/admin/dashboard')}>Home</NavLink>
                                    </NavItem>
                                    <NavItem className='nav-item-responsive'>
                                        <NavLink onClick={() => navigate('/admin/salons')}>Salons</NavLink>
                                    </NavItem>
                                    <NavItem className='nav-item-responsive'>
                                        <NavLink onClick={() => navigate('/admin/appointments')}>Appointments</NavLink>
                                    </NavItem>
                                    <NavItem className='nav-item-responsive'>
                                        <NavLink onClick={() => navigate('/admin/users')}>Users</NavLink>
                                    </NavItem>
                                    <UncontrolledDropdown nav inNavbar>
                                        <DropdownToggle nav caret>
                                            <img src={userImg} alt="user" className='user-img' />
                                        </DropdownToggle>
                                        <DropdownMenu end>
                                            <DropdownItem onClick={onLogoutHandler}>
                                                Log out
                                            </DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </>
                            )}
                            {accessToken && userData?.role !== 'admin' && (
                                <>
                                    <NavItem className='nav-item-responsive'>
                                        <NavLink onClick={() => navigate('/dashboard')}>Home</NavLink>
                                    </NavItem>
                                    <NavItem className='nav-item-responsive'>
                                        <NavLink onClick={() => navigate('/appointments')}>Appointments</NavLink>
                                    </NavItem>
                                    <UncontrolledDropdown nav inNavbar>
                                        <DropdownToggle nav caret>
                                            <img src={userImg} alt="user" className='user-img' />
                                        </DropdownToggle>
                                        <DropdownMenu end>
                                            <DropdownItem onClick={() => navigate('/profile')}>
                                                Profile
                                            </DropdownItem>
                                            <DropdownItem divider />
                                            <DropdownItem onClick={onLogoutHandler}>
                                                Log out
                                            </DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </>
                            )}
                        </Nav>
                    </Collapse>
                </Navbar>
            </div>
        </header>
    );
};

export default Header;
