import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import {Row, Col, Container} from "react-bootstrap";

import { EventsPanel } from './components/events';
import { TimelinePanel } from './components/timeline';
import { MenuBar } from "./components/menubar";
import { store } from './store/store';
import './css/index.css';

function ScenarioEditor(props) {
    return (
        <div>
            <header className="main-header">ALICE Scenario Editor</header>
            <MenuBar/>
            <Container fluid>
                <Row>
                    <Col lg={4}>
                        {/*<Row><ActionsPanel/></Row>*/}
                        <Row><EventsPanel/></Row>
                    </Col>
                    <Col lg={8}>
                        <TimelinePanel/>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

ReactDOM.render(
    <Provider store={store}>
        <ScenarioEditor/>
    </Provider>,
    document.getElementById('root')
);
