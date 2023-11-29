import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import { getToken, getUserData } from '../utils/Utils';
import logo1Img from '../assets/images/logo-1.png';
import error404Img from '../assets/images/not-authorized-dark.svg';

const Error404 = () => {
    const accessToken = getToken();
    const userData = JSON.parse(getUserData());
    return (
        <div className="misc-wrapper">
            <a className="brand-logo" href={accessToken ? userData?.role === 'admin' ? '/admin/dashboard' : '/dashboard' : '/'}>
                <img src={logo1Img} alt="BeautySN" className="mb-2 " />
            </a>
            <div className="misc-inner p-2 p-sm-3">
                <div className="w-100 text-center">
                    <h2 className="mb-1">Page Not Found 🕵🏻‍♀️</h2>
                    <p className="mb-2">Oops! 😖 The requested URL was not found on this server.</p>
                    <Button tag={Link} to={accessToken ? userData?.role === 'admin' ? '/admin/dashboard' : '/dashboard' : '/'} color="primary" className="btn-sm-block mb-2">
                        Back to home
                    </Button>
                    <div className="py-4">
                        <img className="img-fluid" style={{ maxHeight: '300px' }} src={error404Img} alt="Page Not Found" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Error404;
