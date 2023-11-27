import { Form, FormGroup, Label, Button, Card, CardBody } from 'reactstrap';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useAdminLoginUserMutation } from '../redux/api/authApi';
import { useNavigate } from 'react-router-dom';
import logo1Img from '../assets/images/logo-1.png';
import { toast } from 'react-toastify';
import classnames from 'classnames';

function AdminLogin() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [adminLoginUser, { isLoading, isError, error, isSuccess }] = useAdminLoginUserMutation();

    const navigate = useNavigate();
    const onSubmit = (data) => {
        console.log(data);
        adminLoginUser(data);
    };

    useEffect(() => {
        console.log(isLoading, isError, error, isSuccess)
        if (isSuccess) {
            toast.success('You successfully logged in');
            navigate('/admin/dashboard');
        }
        if (isError) {
            toast.error(error.data.message, {
                position: 'top-right',
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading]);

    return (
        <div className="auth-wrapper auth-v1 px-2">
            <div className="auth-inner py-2">
                <div className='row justify-content-center'>
                    <img src={logo1Img} alt='beautySN' style={{ height: '80px', width: 'auto' }} />
                </div>

                <h4 className="brand-logo">Admin Login</h4>
                <Card className='mb-0'>
                    <CardBody>
                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <FormGroup>
                                <Label>Email</Label>
                                <input
                                    className={`form-control ${classnames({ 'is-invalid': errors.email })}`}
                                    type="email"
                                    id="email"
                                    {...register("email", { required: true })}
                                />
                                {errors.email && <span className="text-danger">Email is required.</span>}
                            </FormGroup>
                            <FormGroup>
                                <Label>Password</Label>
                                <input
                                    className={`form-control ${classnames({ 'is-invalid': errors.password })}`}
                                    type="password"
                                    id="password"
                                    {...register("password", { required: true })}
                                />
                                {errors.password && <span className="text-danger">Password is required.</span>}
                            </FormGroup>
                            <div className='mt-4'>
                                <Button color="dark" className='btn-block' type="submit">Login</Button>
                            </div>
                        </Form>
                    </CardBody>
                </Card>
            </div>


        </div>
    );
}

export default AdminLogin;
