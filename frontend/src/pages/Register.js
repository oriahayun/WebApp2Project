import { useEffect, useState } from 'react';
import { Form, FormGroup, Label, Button, Card, CardBody } from 'reactstrap';
import { useForm, Controller } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useRegisterUserMutation } from '../redux/api/authApi';
import logo1Img from '../assets/images/logo-1.png';
import Select from 'react-select';
import Autocomplete from 'react-google-autocomplete';
import { isObjEmpty } from '../utils/Utils';
import { toast } from 'react-toastify';

const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
];
function Register() {
    const { register, setError, handleSubmit, formState: { errors }, control, clearErrors } = useForm();
    const [addressObj, setAddressObj] = useState();

    // 👇 Calling the Register Mutation
    const [registerUser, { isLoading, isSuccess, error, isError }] = useRegisterUserMutation();
    const navigate = useNavigate();
    const onSubmit = (data) => {
        if (!addressObj) {
            errors.address = {};
            setError('address', {
                type: 'manual',
                message: 'Please select an address using the suggested option',
            });
        }
        if (isObjEmpty(errors)) {
            data.location = addressObj;
            data.gender = data.gender.value;
            console.log(data, addressObj.geometry.location);
            const { lat, lng } = addressObj.geometry.location;
            const latitude = lat();
            const longitude = lng();
            console.log('Latitude:', latitude);
            console.log('Longitude:', longitude);

            registerUser(data);
        }

    };

    useEffect(() => {
        if (isSuccess) {
          toast.success('User registered successfully');
          navigate('/login');
        }
    
        if (isError) {
          console.log(error);
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
    console.log(errors)

    return (
        <div className="auth-wrapper auth-v1 px-2">
            <div className="auth-inner py-2">
                <div className='row justify-content-center'>
                    <img src={logo1Img} alt='beautySN' style={{ height: '80px', width: 'auto' }} />
                </div>

                <h4 className="brand-logo">Register</h4>
                <Card className='mb-0'>
                    <CardBody>
                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <FormGroup>
                                <Label>Firstname</Label>
                                <input
                                    className='form-control'
                                    type="text"
                                    id="firstname"
                                    {...register("firstName", { required: true })}
                                />
                                {errors.firstname && <span className="text-danger">Firstname is required.</span>}
                            </FormGroup>
                            <FormGroup>
                                <Label>Lastname</Label>
                                <input
                                    className='form-control'
                                    type="text"
                                    id="lastname"
                                    {...register("lastName", { required: true })}
                                />
                                {errors.lastname && <span className="text-danger">Lastname is required.</span>}
                            </FormGroup>
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
                                <Label>Gender</Label>
                                <Controller
                                    name="gender"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <Select {...field} options={genderOptions} />
                                    )}
                                />
                                {errors.gender && (
                                    <p className="text-danger mt-1">Gender is required.</p>
                                )}
                            </FormGroup>
                            <FormGroup>
                                <Label>Location</Label>
                                <Autocomplete
                                    className="form-control"
                                    apiKey={process.env.REACT_APP_GOOGLE_API_KEY}
                                    onChange={(e) => setAddressObj()}
                                    onPlaceSelected={(place) => {
                                        clearErrors('address');
                                        setAddressObj(place);
                                    }}
                                    options={{
                                        types: ['address'],
                                    }}
                                />
                                {Object.keys(errors).length && errors.address ? (
                                    <small className="text-danger mt-1">{errors.address.message}</small>
                                ) : null}
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

export default Register;
