import { Container, Row, Col, Card, CardBody, Label, FormGroup, Spinner, Button, Form } from "reactstrap";
import classnames from 'classnames';
import { useForm, Controller } from 'react-hook-form';
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { getMeApi, useUpdateMeMutation } from "../redux/api/getMeApi";
import Autocomplete from 'react-google-autocomplete';

const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
];

const Profile = () => {
    const navigate = useNavigate();

    const [isProcessing, setProcessing] = useState(false);
    const [updateMe, { isLoading, isError, error, isSuccess }] = useUpdateMeMutation();

    const { data: user } = getMeApi.endpoints.getMe.useQuery(null);
    const [selectedGender, setSelectedGender] = useState(user && user.gender ? { value: user.gender, label: user.gender.charAt(0).toUpperCase() + user.gender.slice(1) } : { value: '', label: '' });
    const { register, handleSubmit, setValue, formState: { errors }, control, clearErrors } = useForm();
    const [addressObj, setAddressObj] = useState();

    useEffect(() => {
        // set defaults
        if (user) {
            const fields = ['firstName', 'lastName', 'email'];
            fields.forEach((field) => setValue(field, user[field]));
            setValue('gender', selectedGender);
            setAddressObj(user.location);
        }
    }, [selectedGender, setValue, user, setAddressObj]);
    useEffect(() => {
        if (isSuccess) {
            toast.success('You successfully updated profile!');
            navigate('/profile');
        }
        if (isError) {
            toast.error(error.data, {
                position: 'top-right',
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading]);
    const onSubmit = (data) => {
        data.gender = data.gender.value;
        if (addressObj.geometry) {
            const { lat, lng } = addressObj.geometry.location;
            const latitude = lat();
            const longitude = lng();
            data.latitude = latitude;
            data.longitude = longitude;
            data.location = addressObj.formatted_address;
        }
        else {
            data.location = addressObj;
        }
        
        setProcessing(true);
        updateMe({ id: user._id, user: data });
        setProcessing(false);
    }
    return (
        <div className='main-board'>
            <Container>
                <Row>
                    <Col>
                        <h5 className="display-6">Manage Your Profile</h5>
                    </Col>
                </Row>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Row>
                        <Col md="9" sm="12">
                            <Card>
                                <CardBody>
                                    <Row>
                                        <Col md="6" sm="12">
                                            <FormGroup>
                                                <Label className="form-label" for="firstName">
                                                    First Name*
                                                </Label>
                                                <input
                                                    type="text"
                                                    id="firstName"
                                                    name="firstName"
                                                    className={`form-control ${classnames({ 'is-invalid': errors.firstName })}`}
                                                    {...register("firstName", { required: true })}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md="6" sm="12">
                                            <FormGroup>
                                                <Label className="form-label" for="lastName">
                                                    Last Name*
                                                </Label>
                                                <input
                                                    type="text"
                                                    id="lastName"
                                                    name="lastName"
                                                    className={`form-control ${classnames({ 'is-invalid': errors.lastName })}`}
                                                    {...register("lastName", { required: true })}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md="6" sm="12">
                                            <FormGroup>
                                                <Label className="form-label" for="email">
                                                    Email*
                                                </Label>
                                                <input
                                                    type="text"
                                                    id="email"
                                                    name="email"
                                                    className={`form-control ${classnames({ 'is-invalid': errors.email })}`}
                                                    {...register("email", { required: true })}
                                                />
                                                <small className="mt-2 text-muted">Be careful: By changing your email, you are also changing the login username for BeautySN</small>
                                            </FormGroup>
                                        </Col>
                                        <Col md="6" sm="12">
                                            <FormGroup>
                                                <Label>Gender*</Label>
                                                <Controller
                                                    name="gender"
                                                    control={control}
                                                    rules={{ required: true }}
                                                    render={({ field }) => (
                                                        <Select
                                                            {...field}
                                                            options={genderOptions}
                                                            onChange={(value) => {
                                                                setSelectedGender(value);
                                                                field.onChange(value);
                                                            }}
                                                        />
                                                    )}
                                                />
                                                {errors.gender && (
                                                    <p className="text-danger mt-1">Gender is required.</p>
                                                )}
                                            </FormGroup>
                                        </Col>
                                        <Col md="6" sm="12">
                                            <FormGroup>
                                                <Label>Location</Label>
                                                <Autocomplete
                                                    className="form-control"
                                                    defaultValue={addressObj}
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
                                                ) : null}</FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col sm="12">
                                            <FormGroup className="d-flex">
                                                <Button type="submit" className="mr-1 d-flex" color="primary" disabled={isProcessing}>
                                                    {isProcessing && (
                                                        <div className="d-flex align-items-center mr-1">
                                                            <Spinner color="light" size="sm" />
                                                        </div>
                                                    )}
                                                    <span>Update</span>
                                                </Button>
                                            </FormGroup>
                                        </Col>

                                    </Row>

                                </CardBody>
                            </Card>

                        </Col>
                    </Row>
                </Form>

            </Container>
        </div>
    );
}

export default Profile;