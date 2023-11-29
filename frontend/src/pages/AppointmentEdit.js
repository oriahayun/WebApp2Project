import { Container, Row, Col, Card, CardBody, Label, FormGroup, Spinner, Button, Form } from "reactstrap";
import classnames from 'classnames';
import { useForm, Controller } from 'react-hook-form';
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetAppointmentQuery, useUpdateAppointmentMutation } from "../redux/api/appointmentApi";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';
import { useGetSalonsQuery } from "../redux/api/salonApi";

const AppointmentEdit = () => {
    const navigate = useNavigate();

    const [isProcessing, setProcessing] = useState(false);
    const [updateAppointment, { isLoading, isError, error, isSuccess }] = useUpdateAppointmentMutation();
    const { id } = useParams();
    const { data: salons } = useGetSalonsQuery();
    const { data: appointment } = useGetAppointmentQuery(id);
    const { handleSubmit, setValue, watch, control, formState: { errors } } = useForm();
    const [selectedSalon, setSelectedSalon] = useState(null);
    const startDate = watch('startDate');
    const [salonList, setSalonList] = useState({});
 
    useEffect(() => {
        if (salons) {
            setSalonList(salons.map((obj) => ({ value: obj._id, label: `${obj.name}` })));
        }

    }, [salons])

    useEffect(() => {
        if (appointment && appointment.salonId) {
            setSelectedSalon({ value: appointment.salonId._id, label: appointment.salonId.name });
        }
    }, [appointment]);

    useEffect(() => {
        if (appointment) {
            const fields = ['startDate', 'endDate'];
            fields.forEach((field) => setValue(field, new Date(appointment[field])));
            
            setValue('salon', selectedSalon);
        }
    }, [setValue, appointment, selectedSalon]);

    useEffect(() => {
        if (isSuccess) {
            toast.success('You successfully updated Appointment!');
            navigate('/appointments');
        }
        if (isError) {
            toast.error(error.data, {
                position: 'top-right',
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading]);
    const onSubmit = (data) => {
        data.salon = data.salon.value;
        setProcessing(true);
        updateAppointment({ id: id, appointment: data});
        setProcessing(false);
    }

    const validateEndDate = (selectedDate) => {
        if (!startDate || !selectedDate) return true;
        return selectedDate >= startDate;
    };

    return (
        <div className='main-board'>
            <Container>
                <Row>
                    <Col>
                        <h5 className="display-6">Edit Appointment</h5>
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
                                                <Label className="form-label" for="startDate">
                                                    Start Date*
                                                </Label>
                                                <div>
                                                    <Controller
                                                        name="startDate"
                                                        control={control}
                                                        rules={{ required: true }}
                                                        render={({ field }) => (
                                                            <DatePicker
                                                                placeholderText='Select StartDate'
                                                                onChange={(date) => field.onChange(date)}
                                                                selected={field.value}
                                                                showTimeSelect
                                                                timeFormat="HH:mm"
                                                                timeIntervals={15}
                                                                timeCaption="time"
                                                                dateFormat="yyyy-MM-dd h:mm"
                                                                className={`form-control ${classnames({ 'is-invalid': errors.startDate })}`} />
                                                        )}
                                                    />
                                                    {errors.startDate && (
                                                        <p className="text-danger mt-1">Start Date is required.</p>
                                                    )}
                                                </div>

                                            </FormGroup>
                                        </Col>
                                        <Col md="6" sm="12">
                                            <FormGroup>
                                                <Label className="form-label" for="endDate">
                                                    End Date*
                                                </Label>
                                                <div>
                                                    <Controller
                                                        name="endDate"
                                                        control={control}
                                                        rules={{ required: true, validate: validateEndDate }}
                                                        render={({ field }) => (
                                                            <DatePicker
                                                                placeholderText='Select EndDate'
                                                                onChange={(date) => field.onChange(date)}
                                                                selected={field.value}
                                                                showTimeSelect
                                                                timeFormat="HH:mm"
                                                                timeIntervals={15}
                                                                timeCaption="time"
                                                                dateFormat="yyyy-MM-dd h:mm"
                                                                className={`form-control ${classnames({ 'is-invalid': errors.endDate })}`} />
                                                        )}
                                                    />

                                                    {errors.endDate && errors.endDate.type === 'required' && (
                                                        <p className="text-danger mt-1">End Date is required.</p>
                                                    )}
                                                    {errors.endDate && errors.endDate.type !== 'required' && (
                                                        <p className="text-danger mt-1">End Date should be greater than Start Date.</p>
                                                    )}
                                                </div>
                                            </FormGroup>
                                        </Col>
                                        <Col md="6" sm="12">
                                            <FormGroup>
                                                <Label>Salon</Label>
                                                <Controller
                                                    name="salon"
                                                    control={control}
                                                    rules={{ required: true }}
                                                    render={({ field }) => (
                                                        <Select
                                                            {...field}
                                                            options={salonList}
                                                            onChange={(value) => {
                                                                setSelectedSalon(value);
                                                                field.onChange(value);
                                                            }}
                                                        />
                                                    )}
                                                />
                                                {errors.salon && (
                                                    <p className="text-danger mt-1">Salon is required.</p>
                                                )}
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

export default AppointmentEdit;