/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Card, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, CardBody, Modal, ModalHeader, ModalBody, ModalFooter, Badge } from 'reactstrap';
import DataTable from 'react-data-table-component';
import {
    ChevronDown, MoreVertical, CheckCircle, XCircle
} from 'react-feather';
import { toast } from 'react-toastify';
import { useChangeStatusAppointmentMutation, useGetAppointmentsQuery } from '../redux/api/appointmentApi';
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
        maxwidth: '100px',
        selector: (row) => `${getDateFormat(row.startDate)}`,
        sortable: true,
    },
    {
        name: 'End Date',
        maxwidth: '100px',
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
            const [changeStatus, { isLoading, isError, error, isSuccess }] = useChangeStatusAppointmentMutation();
            useEffect(() => {
                if (isSuccess) {
                    toast.success('Salon Changed successfully');
                    navigate('/admin/appointments');
                }
                if (isError) {
                    toast.error(error.data.message, {
                        position: 'top-right',
                    });
                }
                // eslint-disable-next-line react-hooks/exhaustive-deps
            }, [isLoading]);
            const handleStatusApprove = (id) => {
                changeStatus({ id: id, status: { status: 'approve' } });
                
            }
            const handleStatusDecline = (id) => {
                changeStatus({ id: id, status: { status: 'decline' } });
                setModalVisibility(false);
            }
            return (
                <>
                    {row.role !== 'admin' && row.status !== 'approved' && (
                        <>
                            <UncontrolledDropdown>
                                <DropdownToggle tag="div" className="btn btn-sm">
                                    <MoreVertical size={14} className="cursor-pointer action-btn" />
                                </DropdownToggle>
                                <DropdownMenu end container="body">
                                    <DropdownItem
                                        className="w-100"
                                        onClick={() => handleStatusApprove(row._id)}
                                    >
                                        <CheckCircle size={14} className="mr-50" />
                                        <span className="align-middle">Approve</span>
                                    </DropdownItem>
                                    <DropdownItem className="w-100" onClick={() => setModalVisibility(!modalVisibility)}>
                                        <XCircle size={14} className="mr-50" />
                                        <span className="align-middle">Decline</span>
                                    </DropdownItem>
                                </DropdownMenu>

                            </UncontrolledDropdown>
                            <Modal isOpen={modalVisibility} toggle={() => setModalVisibility(!modalVisibility)}>
                                <ModalHeader toggle={() => setModalVisibility(!modalVisibility)}>Confirm Decline?</ModalHeader>
                                <ModalBody>
                                    Are you sure you want to Decline?
                                    <div><strong>{row.email}</strong></div>
                                </ModalBody>
                                <ModalFooter className="justify-content-start">
                                    <Button color="primary" onClick={() => handleStatusDecline(row._id)}>
                                        Yes, Please Decline
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
]

const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'approve', label: 'Approve' },
    { value: 'decline', label: 'Decline' },
];

const AdminAppointments = () => {
    const [currentStatus, setCurrentStatus] = useState({ value: '', label: 'Status...' })
    const queryParams = {
        status: currentStatus.value,
    };

    const handleStatusChange = (data) => {
        setCurrentStatus(data || { value: '', label: 'Status...' });
    };

    const { data: appointments, isError, isSuccess, error, isLoading } = useGetAppointmentsQuery(queryParams);

    const paginationRowsPerPageOptions = [15, 30, 50, 100];

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
    return (
        <div className='main-board'>
            <Container>
                <Row className="table-header">
                    <Col>
                        <h5 className="display-6">Appointments</h5>
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

export default AdminAppointments;
