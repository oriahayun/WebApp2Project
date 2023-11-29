import { Container, Row, Col, Card, CardBody, Label, FormGroup, Spinner, Button, Form } from "reactstrap";
import classnames from 'classnames';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Autocomplete from 'react-google-autocomplete';
import { useCreateSalonMutation } from "../redux/api/salonApi";

const SalonCreate = () => {
    const navigate = useNavigate();

    const [isProcessing, setProcessing] = useState(false);
    const [createSalon, { isLoading, isError, error, isSuccess }] = useCreateSalonMutation();

    const { register, handleSubmit, formState: { errors }, clearErrors } = useForm();
    const [addressObj, setAddressObj] = useState();

    useEffect(() => {
        if (isSuccess) {
            toast.success('You successfully created Salon!');
            navigate('/admin/salons');
        }
        if (isError) {
            toast.error(error.data, {
                position: 'top-right',
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading]);
    const onSubmit = (data) => {
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
        createSalon(data);
        setProcessing(false);
    }
    return (
        <div className='main-board'>
            <Container>
                <Row>
                    <Col>
                        <h5 className="display-6">Create Salon</h5>
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
                                                <Label className="form-label" for="name">
                                                    Name*
                                                </Label>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    name="name"
                                                    className={`form-control ${classnames({ 'is-invalid': errors.name })}`}
                                                    {...register("name", { required: true })}
                                                />
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
                                        <Col sm="12">
                                            <FormGroup>
                                                <Label className="form-label" for="description">
                                                    Description*
                                                </Label>
                                                <textarea
                                                    type="text"
                                                    id="description"
                                                    name="description"
                                                    className={`form-control ${classnames({ 'is-invalid': errors.description })}`}
                                                    {...register("description", { required: true })}
                                                ></textarea>
                                                
                                            </FormGroup>
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
                                                    <span>Save</span>
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

export default SalonCreate;