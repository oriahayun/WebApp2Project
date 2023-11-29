import React from 'react';
import { Row, Col } from 'reactstrap';
import salonVideo from '../assets/images/salon.mp4';

function Home() {
    return (
        <div className='main-board'>
            <div className='container-fluid'>
                <Row>
                    <Col>
                        <video autoPlay muted loop id="salonVideo">
                            <source src={salonVideo} type="video/mp4" />
                            Your browser does not support HTML5 video.
                        </video>
                    </Col>
                </Row>
            </div>
        </div>
    );
}

export default Home;
