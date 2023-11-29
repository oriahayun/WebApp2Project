/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Card, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, CardBody, InputGroup, InputGroupText, Input, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import DataTable from 'react-data-table-component';
import {
    ChevronDown, MoreVertical, Archive, Search, Trash2, Plus,
} from 'react-feather';
import { toast } from 'react-toastify';
import { useDeleteSalonMutation, useGetSalonsQuery } from '../redux/api/salonApi';

export const columns = () => [
    {
        name: 'Name',
        maxwidth: '100px',
        selector: (row) => `${row.name}`,
        sortable: true,
    },
    {
        name: 'Location',
        maxwidth: '100px',
        selector: (row) => `${row.location}`,
        sortable: true,
    },
    {
        name: 'Latitude',
        maxwidth: '100px',
        selector: (row) => `${row.latitude}`,
        sortable: true,
    },
    {
        name: 'Longitutde',
        maxwidth: '100px',
        selector: (row) => `${row.longitude}`,
        sortable: true,
    },
    {
        name: 'Actions',
        width: '120px',
        cell: (row) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const navigate = useNavigate();
            const [modalVisibility, setModalVisibility] = useState(false);
            const [deleteSalon, { isLoading, isError, error, isSuccess }] = useDeleteSalonMutation();
            useEffect(() => {
                if (isSuccess) {
                    toast.success('Salon deleted successfully');
                    navigate('/admin/salons');
                }
                if (isError) {
                    toast.error(error.data.message, {
                        position: 'top-right',
                    });
                }
                // eslint-disable-next-line react-hooks/exhaustive-deps
            }, [isLoading]);
            const handleDeleteSalon = (id) => {
                deleteSalon(id);
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
                                        onClick={() => navigate(`/admin/salons/edit/${row._id}`)}
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
                                    <Button color="primary" onClick={() => handleDeleteSalon(row._id)}>
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
]

const Salons = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const queryParams = {
        q: searchTerm,
    };

    const { data: salons, isError, isSuccess, error, isLoading } = useGetSalonsQuery(queryParams);

    const paginationRowsPerPageOptions = [15, 30, 50, 100];
    const handleFilter = (q) => {
        setSearchTerm(q);
    };
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
    return (
        <div className='main-board'>
            <Container>
                <Row className="table-header">
                    <Col>
                        <h5 className="display-6">Salons</h5>
                    </Col>
                    <Col
                        xl="4"
                        className="d-flex align-items-center justify-content-end"
                    >
                        <Button
                            size="sm"
                            color="primary"
                            onClick={() => navigate('/admin/salons/create')}
                        >
                            <Plus size={14} />
                            <span className="align-middle "> Add Salon</span>
                        </Button>
                    </Col>
                </Row>

                <Card>
                    <CardBody>
                        <Row className="justify-content-end">
                            <Col
                                md="4"
                                className="d-flex align-items-center"
                            >
                                <InputGroup>
                                    <InputGroupText>
                                        <Search size={14} />
                                    </InputGroupText>
                                    <Input
                                        id="search_salon"
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => handleFilter(e.target.value ? e.target.value : '')}
                                    />
                                </InputGroup>
                                {searchTerm && (<Button size="sm" className="clear-link d-block" onClick={() => { handleFilter(''); }} color="flat-light">
                                    clear
                                </Button>)}
                            </Col>
                        </Row>
                    </CardBody>
                    <DataTable
                        data={salons}
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

export default Salons;
