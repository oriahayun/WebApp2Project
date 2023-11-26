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
import { useAppSelector } from '../redux/store';
import { useLogoutUserMutation } from '../redux/api/authApi';
import { toast } from 'react-toastify';
import userImg from '../assets/images/user.png';
import logoImg from '../assets/images/logo.png';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [logoutUser, { isLoading, isSuccess, error, isError }] =
        useLogoutUserMutation();
    const user = useAppSelector((state) => state.userState.user);
    const navigate = useNavigate();
    console.log(isLoading, isSuccess, error, isError)
    const toggle = () => setIsOpen(!isOpen);

    useEffect(() => {
        if (isSuccess) {
            window.location.href = '/login';
        }

        if (isError) {
            if (Array.isArray(error.data.error)) {
                error.data.error.forEach(function (el) {
                    toast.error(el.message, {
                        position: 'top-right',
                    });
                });
            } else {
                toast.error(error.data.message, {
                    position: 'top-right',
                });
            }
        }
    }, [isLoading]);

    const onLogoutHandler = async () => {
        logoutUser();
    };

    return (
        <header>
            <div className='container'>
                <Navbar color="dark" dark expand="md">
                    <NavbarBrand href="/">
                        <img src={logoImg} alt='beautySN' style={{ height: '55px', width: 'auto' }} />
                    </NavbarBrand>
                    <NavbarToggler onClick={toggle} className="ms-auto" />
                    <Collapse isOpen={isOpen} navbar>
                        <Nav className="ms-auto" navbar>
                            {!user && (
                                <>
                                    <NavItem className='nav-item-responsive'>
                                        <NavLink onClick={() => navigate('/')}>Home</NavLink>
                                    </NavItem>
                                    <NavItem className='nav-item-responsive'>
                                        <NavLink onClick={() => navigate('/login')}>Login</NavLink>
                                    </NavItem>
                                    <NavItem className='nav-item-responsive'>
                                        <NavLink onClick={() => navigate('/register')}>Register</NavLink>
                                    </NavItem>
                                </>
                            )}

                            {user && (
                                <>
                                    <NavItem className='nav-item-responsive'>
                                        <NavLink onClick={() => navigate('/')}>Home</NavLink>
                                    </NavItem>
                                    <NavItem className='nav-item-responsive'>
                                        <NavLink onClick={() => navigate('/')}>Salons</NavLink>
                                    </NavItem>
                                    <NavItem className='nav-item-responsive'>
                                        <NavLink onClick={() => navigate('/')}>Appointments</NavLink>
                                    </NavItem>
                                    <UncontrolledDropdown nav inNavbar>
                                        <DropdownToggle nav caret>
                                            <img src={userImg} alt="user" className='user-img' />
                                        </DropdownToggle>
                                        <DropdownMenu end>
                                            <DropdownItem>
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
