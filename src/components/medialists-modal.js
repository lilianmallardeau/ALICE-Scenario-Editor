import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {nanoid} from "@reduxjs/toolkit";
import {Button, Tab, Form, Modal, Col, Row, ListGroup} from "react-bootstrap";
import {UnmuteIcon} from "@primer/octicons-react";

import {mediaListsSelector} from "../store/selectors";
import {updateAllChannels} from "../store/store";
import {AddButton, SaveDiscardButtons} from "./buttons";

export function ChannelsModal(props) {
    const channelsSelector = useSelector(mediaListsSelector);
    const dispatch = useDispatch();
    const [show, setShow] = useState(false);
    const [channels, setChannels] = useState(channelsSelector);

    const handleClose = () => {
        setShow(false);
        setChannels([]);
    }
    const handleShow = () => {
        setChannels(channelsSelector);
        setShow(true);
    };
    const handleSave = () => {
        dispatch(updateAllChannels(channels));
        handleClose();
    }
    const addChannel = () => {
        setChannels((channelsList) => channelsList.concat({
            id: nanoid(),
            name: '',
            content: []
        }))
    }
    const deleteChannel = (id) => {
        setChannels((channels) => channels.filter(channel => channel.id !== id))
    }
    const renameChannel = (id, e) => {
        setChannels((channels) => channels.map(channel => channel.id !== id ? channel : {
            ...channel,
            name: e.target.value
        }))
    }
    const updateChannelContent = (id, e) => {
        setChannels((channels) => channels.map(channel => channel.id === id ? {
            ...channel,
            content: e.target.value.split('\n')
        } : channel));
    }

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                <UnmuteIcon size={16} />Media Lists
            </Button>

            <Modal show={show} onHide={handleClose} backdrop="static" size="lg">
                <Modal.Header>
                    <Modal.Title>Media channels</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Tab.Container>
                        <Row>
                            <Col lg="auto">
                                <ListGroup>
                                    {channels.map(channel =>
                                        <ListGroup.Item href={channel.id} key={channel.id}>
                                            <Row>
                                                <Col lg="auto"><Form.Control
                                                    type="text"
                                                    placeholder="Channel name"
                                                    value={channel.name}
                                                    onChange={(e) => renameChannel(channel.id, e)}
                                                /></Col>
                                                <Col lg="auto"><Button variant="danger" onClick={() => deleteChannel(channel.id)}>-</Button></Col>
                                            </Row>
                                        </ListGroup.Item>
                                    )}
                                </ListGroup>
                            </Col>
                            <Col lg="auto">
                                <Tab.Content>
                                    {channels.map(channel =>
                                        <Tab.Pane eventKey={channel.id} key={channel.id}>
                                            <Form.Control
                                                as="textarea"
                                                onChange={(e) => updateChannelContent(channel.id, e)}
                                                value={channel.content.join('\n')}
                                            />
                                        </Tab.Pane>
                                    )}
                                </Tab.Content>
                            </Col>
                        </Row>
                    </Tab.Container>
                    <AddButton onClick={addChannel}>Ajouter une channel</AddButton>
                </Modal.Body>
                <Modal.Footer>
                    <SaveDiscardButtons onSave={handleSave} onDiscard={handleClose}/>
                </Modal.Footer>
            </Modal>
        </>
    );
}

