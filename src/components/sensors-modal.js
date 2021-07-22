import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {nanoid} from "@reduxjs/toolkit";
import {Button, Container, Form, Modal, Col, Row} from "react-bootstrap";

import {sensorsSelector} from "../store/selectors";
import {updateSensors} from "../store/store";
import {AddButton, DeleteButton, SaveDiscardButtons} from "./buttons";


export function SensorsModal(props) {
    const selector = useSelector(sensorsSelector);
    const dispatch = useDispatch();
    const [show, setShow] = useState(false);
    const [sensorsList, setSensorsList] = useState(selector);

    const handleClose = () => {
        setShow(false);
        setSensorsList([]);
    }
    const handleShow = () => {
        setSensorsList(selector);
        setShow(true);
    }
    const handleSave = () => {
        dispatch(updateSensors(sensorsList));
        handleClose();
    }
    const addSensor = () => {
        setSensorsList((sensorsList) => sensorsList.concat({
            id: nanoid(),
            name: '',
            type: null
        }))
    }
    const deleteSensor = (id) => {
        setSensorsList((sensorsList) => sensorsList.filter(sensor => sensor.id !== id))
    }

    const updateSensor = (id, event) => {
        setSensorsList((sensorsList) => sensorsList.map(sensor => sensor.id === id ? {
            ...sensor,
            [event.target.name]: event.target.value
        } : sensor));
    }

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Capteurs
            </Button>

            <Modal show={show} onHide={handleClose} backdrop="static">
                <Modal.Header>
                    <Modal.Title>Capteurs</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        {sensorsList.map(sensor => (
                            <Row key={sensor.id} className="sensor-list-row">
                                <Col>
                                    <Form.Control name="name" type="text" placeholder="Nom du capteur" onChange={(e) => updateSensor(sensor.id, e)} value={sensor.name}/>
                                </Col>
                                <Col>
                                    <Form.Control as="select" name="type" defaultValue="default" value={sensor.type} onChange={(e) => updateSensor(sensor.id, e)}>
                                        <option value="default" disabled hidden>Type de capteur</option>
                                        <option value="distance">Capteur de distance</option>
                                        <option value="movement">Capteur de mouvement</option>
                                        <option value="color">Capteur de couleur</option>
                                    </Form.Control>
                                </Col>
                                <Col md="auto">
                                    <DeleteButton onClick={() => deleteSensor(sensor.id)}/>
                                </Col>
                            </Row>
                        ))}
                    </Container>
                    <AddButton onClick={addSensor}>Ajouter</AddButton>
                </Modal.Body>
                <Modal.Footer>
                    <SaveDiscardButtons onSave={handleSave} onDiscard={handleClose}/>
                </Modal.Footer>
            </Modal>
        </>
    );
}

