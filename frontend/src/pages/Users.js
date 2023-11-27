/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Card, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, CardBody, InputGroup, InputGroupText, Input, Badge, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import DataTable from 'react-data-table-component';
import { useDeleteUserMutation, useGetUsersQuery } from '../redux/api/userApi';
import {
    ChevronDown, MoreVertical, Archive, Search, Trash2,
} from 'react-feather';
import { toast } from 'react-toastify';

const renderRole = (row) => (
    <span className="text-truncate text-capitalize align-middle">
        <Badge color="info" className='px-2 py-1' pill>
            {row.role}
        </Badge>
    </span>
);

export const columns = () => [
    {
        name: 'Firstname',
        maxwidth: '100px',
        selector: (row) => `${row.firstName}`,
        sortable: true,
    },
    {
        name: 'Lastname',
        maxwidth: '100px',
        selector: (row) => `${row.lastName}`,
        sortable: true,
    },
    {
        name: 'Email',
        maxwidth: '100px',
        selector: (row) => `${row.email}`,
        sortable: true,
    },
    {
        name: 'Role',
        sortable: true,
        cell: (row) => renderRole(row),
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
            const [deleteUser, { isLoading, isError, error, isSuccess }] = useDeleteUserMutation();
            useEffect(() => {
                if (isSuccess) {
                    toast.success('User deleted successfully');
                    navigate('/admin/users');
                }
                if (isError) {
                    toast.error(error.data.message, {
                        position: 'top-right',
                    });
                }
                // eslint-disable-next-line react-hooks/exhaustive-deps
            }, [isLoading]);
            const handleDeleteUser = (id) => {
                deleteUser(id);
            }
            return (
                <>
                    {row.role !== 'admin' && (
                        <>
                            <UncontrolledDropdown>
                                <DropdownToggle tag="div" className="btn btn-sm">
                                    <MoreVertical size={14} className="cursor-pointer action-btn" />
                                </DropdownToggle>
                                <DropdownMenu end>
                                    <DropdownItem
                                        className="w-100"
                                        onClick={() => navigate(`/admin/users/edit/${row._id}`)}
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
                                    <Button color="primary" onClick={() => handleDeleteUser(row._id)}>
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

const Users = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const queryParams = {
        q: searchTerm,
    };

    const { data: users, isError, isSuccess, error, isLoading } = useGetUsersQuery(queryParams);
    
    const paginationRowsPerPageOptions = [15, 30, 50, 100];
    const handleFilter = (q) => {
        setSearchTerm(q);
    };

    console.log(users, 'ddd')
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
                <Row>
                    <Col>
                        <h5 className="display-6">Users</h5>
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
                                        id="search-user"
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
                        data={users}
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

export default Users;
