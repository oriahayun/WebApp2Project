import { Container, Row, Col, Card, CardBody, Label, FormGroup, Spinner, Button, Form } from "reactstrap";
import classnames from 'classnames';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from "react";
import { useGetUserQuery, useUpdateUserMutation } from "../redux/api/userApi";
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';

const UserDetail = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [isProcessing, setProcessing] = useState(false);
    const [updateUser, { isLoading, isError, error, isSuccess }] = useUpdateUserMutation();
    const { id } = useParams();
    const { data: user } = useGetUserQuery(id);
    
    useEffect(() => {
        // set defaults
        if (user) {
            const fields = ['firstName', 'lastName', 'email'];
            fields.forEach((field) => setValue(field, user[field]));
        }
    }, [setValue, user]);
    useEffect(() => {
        if (isSuccess) {
            toast.success('You successfully updated user!');
            navigate('/admin/users');
        }
        if (isError) {
            toast.error(error.data.message, {
                position: 'top-right',
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading]);
    const onSubmit = (data) => {
        setProcessing(true);
        updateUser({ id: id, user: data});
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
                                        <Col sm="12">
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

export default UserDetail;