import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, CardBody, CardHeader, CardTitle } from 'reactstrap';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { useGetReportQuery } from '../redux/api/reportApi';
import moment from 'moment';
import Select from 'react-select';

const CustomTooltip = (data) => {
    if (data.active && data.payload) {
        return (
            <div className="recharts-custom-tooltip">
                <p className="font-weight-bold mb-0">{data.label}</p>
                <hr />
                <div className="active">
                    {data.payload.map((i) => (
                        <div className="d-flex align-items-center" key={i.dataKey}>
                            <span
                                className="bullet  bullet-sm bullet-bordered mr-50"
                                style={{
                                    backgroundColor: i.fill,
                                }}
                            />
                            <span className="align-middle text-capitalize mr-75">
                                {i.dataKey}
                                :
                                {' '}
                                {i.payload[i.dataKey]}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return null;
};

const Dashboard = () => {
    const [currentStatus, setCurrentStatus] = useState({ value: '', label: 'Status...' })
    const [appointReportData, setAppointReportData] = useState([]);

    const queryParams = {
        status: currentStatus.value,
    };
    
    const { data: reportData, refetch } = useGetReportQuery(queryParams);
    const build10DayReport = (data) => {
        const formattedReportData = data.map((obj) => ({ date: moment(new Date(obj.groupedDate)).format('D MMM'), appointments: obj.appointments }));

        const lastThirtyDays = [...new Array(10)].map((i, idx) => {
            const formattedDate = moment().startOf('day').subtract(idx, 'days').format('D MMM');
            const exists = formattedReportData.find((k) => k.date === formattedDate);
            return (exists || { date: formattedDate });
        });
        return (lastThirtyDays.reverse());
    };
    useEffect(() => {
        refetch();
      }, [refetch]);

    const statusOptions = [
        { value: 'pending', label: 'Pending' },
        { value: 'approve', label: 'Approve' },
        { value: 'decline', label: 'Decline' },
    ];

    const handleStatusChange = (data) => {
        setCurrentStatus(data || { value: '', label: 'Status...' });
    };

    useEffect(() => {
        if (reportData) {
            const report = build10DayReport(reportData);
            setAppointReportData(report);
        }
    }, [reportData]);
    return (
        <div className='main-board'>
            <Container>
                <Row>
                    <Col>
                        <h1 className="display-6">Welcome to BeautySN!</h1>
                    </Col>
                </Row>
                <Row className='mt-3'>
                    <Col md="12">
                        <Card>
                            <CardHeader>
                                <div className='p-2'>
                                    <CardTitle tag="h4">
                                        Appointment
                                    </CardTitle>

                                </div>
                            </CardHeader>
                            <CardBody>
                                <Row className="justify-content-end mb-3">
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
                                <div className="recharts-wrapper bar-chart">
                                    <ResponsiveContainer>
                                        <BarChart height={300} data={appointReportData} barSize={20}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="date" />
                                            <YAxis />
                                            <Tooltip content={CustomTooltip} />
                                            <Bar dataKey='appointments' stackId="a" fill="#7f3f98" radius={[10, 10, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardBody>
                        </Card>

                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Dashboard;
