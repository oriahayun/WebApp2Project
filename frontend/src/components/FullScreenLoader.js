import { Container, Row, Col, Spinner } from 'reactstrap';

const FullScreenLoader = () => {
  return (
    <Container fluid>
      <Row style={{ height: '100vh' }}>
        <Col className="d-flex align-items-center justify-content-center">
          <Spinner color="primary" style={{ width: '3rem', height: '3rem' }} />
        </Col>
      </Row>
    </Container>
  );
};

export default FullScreenLoader;
