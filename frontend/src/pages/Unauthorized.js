import { Container, Row, Col } from 'reactstrap';

const UnauthorizePage = () => {
    return (
        <div className='main-board'>
            <Container>
                <Row className="mt-4">
                    <Col className="bg-light d-flex align-items-center justify-content-center" style={{ height: '15rem' }}>
                        <h1 className="text-dark font-weight-bold">Unauthorized Page</h1>
                    </Col>
                </Row>
            </Container>
        </div>

    );
};

export default UnauthorizePage;
