import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Modal, Form, Button} from "react-bootstrap";

import {arduinosSelector} from "../store/selectors";
import {updateAllArduinos} from "../store/store";
import {SaveDiscardButtons} from "./buttons";

export function ArduinosModal(props) {
    const arduinosFromStore = useSelector(arduinosSelector)
    const dispatch = useDispatch();
    const [show, setShow] = useState(false);
    const [arduinos, setArduinos] = useState("");

    const handleClose = () => {
        setShow(false);
        setArduinos("");
    }
    const handleShow = () => {
        setArduinos(arduinosFromStore.join("\n"));
        setShow(true);
    }
    const handleSave = () => {
        dispatch(updateAllArduinos(arduinos.split("\n").map(line => line.trim()).filter(line => line)));
        handleClose();
    }

    return (
        <>
            <Button onClick={handleShow}>
                Arduinos
            </Button>

            <Modal show={show} onHide={handleClose} backdrop="static">
                <Modal.Header>
                    <Modal.Title>Arduinos</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Control as="textarea" value={arduinos} onChange={(e) => setArduinos(e.target.value)}/>
                </Modal.Body>
                <Modal.Footer>
                    <SaveDiscardButtons onSave={handleSave} onDiscard={handleClose}/>
                </Modal.Footer>
            </Modal>
        </>
    )
}