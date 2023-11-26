import { Form, FormGroup, Label, Button, Card, CardBody } from 'reactstrap';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useLoginUserMutation } from '../redux/api/authApi';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo1Img from '../assets/images/logo-1.png';
import { toast } from 'react-toastify';

function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loginUser, { isLoading, isError, error, isSuccess }] = useLoginUserMutation();

  const navigate = useNavigate();
    const onSubmit = (data) => {
        console.log(data);
        loginUser(data);
    };

    useEffect(() => {
        if (isSuccess) {
          toast.success('You successfully logged in');
          navigate('/');
        }
        if (isError) {
        //   if (Array.isArray((error as any).data.error)) {
        //     (error as any).data.error.forEach((el: any) =>
        //       toast.error(el.message, {
        //         position: 'top-right',
        //       })
        //     );
        //   } else {
        //     toast.error((error as any).data.message, {
        //       position: 'top-right',
        //     });
        //   }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [isLoading]);

    return (
        <div className="auth-wrapper auth-v1 px-2">
            <div className="auth-inner py-2">
                <div className='row justify-content-center'>
                    <img src={logo1Img} alt='beautySN' style={{ height: '80px', width: 'auto' }} />
                </div>
                
                <h4 className="brand-logo">Login</h4>
                <Card className='mb-0'>
                    <CardBody>
                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <FormGroup>
                                <Label>Email</Label>
                                <input
                                    className='form-control'
                                    type="email"
                                    id="email"
                                    {...register("email", { required: true })}
                                />
                                {errors.email && <span className="text-danger">Email is required.</span>}
                            </FormGroup>
                            <FormGroup>
                                <Label>Password</Label>
                                <input
                                    className='form-control'
                                    type="password"
                                    id="password"
                                    {...register("password", { required: true })}
                                />
                                {errors.password && <span className="text-danger">Password is required.</span>}
                            </FormGroup>
                            <div className='mt-4'>
                                <Button color="primary" className='btn-block' type="submit">Login</Button>
                            </div>
                            
                        </Form>
                    </CardBody>
                </Card>
            </div>


        </div>
    );
}

export default Login;
