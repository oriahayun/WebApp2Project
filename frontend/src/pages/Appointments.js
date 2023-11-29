/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Card, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, CardBody, Modal, ModalHeader, ModalBody, ModalFooter, Badge } from 'reactstrap';
import DataTable from 'react-data-table-component';
import {
    ChevronDown, MoreVertical, Archive, Trash2, Plus
} from 'react-feather';
import { toast } from 'react-toastify';
import { useDeleteAppointmentMutation, useGetAppointmentsQuery } from '../redux/api/appointmentApi';
import { getDateFormat } from '../utils/Utils';
import Select from 'react-select';

const renderStatus = (row) => {
    let colorV;
    if (row.status === 'pending') {
        colorV = 'warning'
    } else if (row.status === 'decline') {
        colorV = 'danger'
    } else {
        colorV = 'primary'
    }

    return (
        <span className="text-truncate text-capitalize align-middle">
            <Badge color={colorV} className='px-2 py-1' pill>
                {row.status}
            </Badge>
        </span>
    )
};

export const columns = () => [
    {
        name: 'Start Date',
        maxwidth: '150px',
        selector: (row) => `${getDateFormat(row.startDate)}`,
        sortable: true,
    },
    {
        name: 'End Date',
        maxwidth: '150px',
        selector: (row) => `${getDateFormat(row.endDate)}`,
        sortable: true,
    },
    {
        name: 'User',
        maxwidth: '100px',
        selector: (row) => `${row.userId?.firstName} ${row.userId?.lastName}`,
        sortable: true,
    },
    {
        name: 'Salon',
        maxwidth: '100px',
        selector: (row) => `${row.salonId?.name}`,
        sortable: true,
    },
    {
        name: 'Status',
        cell: (row) => renderStatus(row),
    },
    {
        name: 'Actions',
        width: '120px',
        cell: (row) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const navigate = useNavigate();
            const [modalVisibility, setModalVisibility] = useState(false);
            const [deleteAppointment, { isLoading, isError, error, isSuccess }] = useDeleteAppointmentMutation();
            useEffect(() => {
                if (isSuccess) {
                    toast.success('Salon deleted successfully');
                    navigate('/appointments');
                }
                if (isError) {
                    toast.error(error.data.message, {
                        position: 'top-right',
                    });
                }
                // eslint-disable-next-line react-hooks/exhaustive-deps
            }, [isLoading]);
            const handleDeleteAppointment = (id) => {
                deleteAppointment(id);
                setModalVisibility(false);
            }
            return (
                <>
                    {row.role !== 'admin' && (
                        <>
                            <UncontrolledDropdown>
                                <DropdownToggle tag="div" className="btn btn-sm">
                                    <MoreVertical size={14} className="cursor-pointer action-btn" />
                                </DropdownToggle>
                                <DropdownMenu end container="body">
                                    <DropdownItem
                                        className="w-100"
                                        onClick={() => navigate(`/admin/appointments/edit/${row._id}`)}
                                    >
                                        <Archive size={14} className="mr-50" />
                                        <span className="align-middle">Edit</span>
                                    </DropdownItem>
                                    <DropdownItem className="w-100" onClick={() => setModalVisibility(!modalVisibility)}>
                                        <Trash2 size={14} className="mr-50" />
                                        <span className="align-middle">Delete</span>
                                    </DropdownItem>
                                </DropdownMenu>

                            </UncontrolledDropdown>
                            <Modal isOpen={modalVisibility} toggle={() => setModalVisibility(!modalVisibility)}>
                                <ModalHeader toggle={() => setModalVisibility(!modalVisibility)}>Confirm Delete?</ModalHeader>
                                <ModalBody>
                                    Are you sure you want to delete?
                                    <div><strong>{row.email}</strong></div>
                                </ModalBody>
                                <ModalFooter className="justify-content-start">
                                    <Button color="primary" onClick={() => handleDeleteAppointment(row._id)}>
                                        Yes, Please Delete
                                    </Button>
                                    <Button color="secondary" onClick={() => setModalVisibility(!modalVisibility)} outline>
                                        No
                                    </Button>
                                </ModalFooter>
                            </Modal>
                        </>
                    )}

                </>
            )
        }
    },
];

const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'approve', label: 'Approve' },
    { value: 'decline', label: 'Decline' },
];

const Appointments = () => {
    const [currentStatus, setCurrentStatus] = useState({ value: '', label: 'Status...' })
    const queryParams = {
        status: currentStatus.value,
    };

    const { data: appointments, isError, isSuccess, error, isLoading } = useGetAppointmentsQuery(queryParams);

    const paginationRowsPerPageOptions = [15, 30, 50, 100];
    const navigate = useNavigate();

    useEffect(() => {
        if (isSuccess) {

        }
        if (isError) {
            toast.error(error.data, {
                position: 'top-right',
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading]);

    const handleStatusChange = (data) => {
        setCurrentStatus(data || { value: '', label: 'Status...' });
    };
    return (
        <div className='main-board'>
            <Container>
                <Row className="table-header">
                    <Col>
                        <h5 className="display-6">Appointments</h5>
                    </Col>
                    <Col
                        md="4"
                        className="d-flex align-items-center justify-content-end"
                    >
                        <Button
                            size="sm"
                            color="primary"
                            onClick={() => navigate('/admin/appointments/create')}
                        >
                            <Plus size={14} />
                            <span className="align-middle "> Add Appointment</span>
                        </Button>
                    </Col>
                </Row>

                <Card>
                    <CardBody>
                        <Row className="justify-content-end">
                            <Col
                                md="3"
                            >
                                <Select
                                    isClearable
                                    placeholder="Status..."
                                    className="react-select"
                                    classNamePrefix="select"
                                    options={statusOptions}
                                    value={currentStatus}
                                    onChange={(data) => { handleStatusChange(data); }}
                                />
                            </Col>
                        </Row>
                    </CardBody>
                    <DataTable
                        data={appointments}
                        responsive
                        className="react-dataTable"
                        noHeader
                        pagination
                        paginationRowsPerPageOptions={paginationRowsPerPageOptions}
                        columns={columns()}
                        sortIcon={<ChevronDown />}
                    />
                </Card>
            </Container>
        </div>
    );
}

export default Appointments;
