import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {Row, Col, Form, Card, Modal, Container} from "react-bootstrap";

import {actionSelector} from "../store/selectors";
import {removeAction, updateAction} from "../store/store";
import {SaveDiscardButtons, DeleteButton, EditButton} from "./buttons";
import available_actions from "../data/actions.json";


function ActionOptions(props) {
    const actionTemplate = available_actions.find(action_template => action_template.name === props.action);
    const optionsTemplate = actionTemplate ? actionTemplate.options : [];

    const [options, setOptions] = useState(getDefaultOptions());
    useEffect(() => {
        props.callback && props.callback(options);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [options]); // Do NOT add props in the dependencies!!!! This causes infinite render loop

    function getDefaultOptions() {
        const options = props.options ? {...props.options} : {};
        if (!actionTemplate)
            return options;
        actionTemplate.options.forEach(option => {
            if (options[option.name] === undefined)
                options[option.name] = option.default || '';
        });
        return options;
    }

    function optionChanged(event) {
        setOptions(prevOptions => ({
            ...prevOptions,
            [event.target.name]: event.target.type === 'checkbox' ? event.target.checked :
                ['number', 'float'].includes(event.target.type) ? Number(event.target.value) : event.target.value
        }));
    }

    return (
        <>
            {/*<Row>*/}
            {/*    <Col>*/}
            {/*        <Form.Label htmlFor="arduino-target">Arduino cible</Form.Label>*/}
            {/*    </Col>*/}
            {/*    <Col>*/}
            {/*        <Form.Control type="text" id="arduino-target" name="arduino" onChange={optionChanged}/>*/}
            {/*    </Col>*/}
            {/*</Row>*/}
            {optionsTemplate.map(option => (
                <Row key={option.name}>
                    <Col>
                        <Form.Label htmlFor={option.name}>{option.desc}</Form.Label>
                    </Col>
                    <Col>
                        {(() => {
                            const commonProps = {
                                id: option.name,
                                name: option.name,
                                onChange: optionChanged
                            };
                            switch (option.type) {
                                case 'string':
                                    return <Form.Control {...commonProps} type="text" value={options[option.name]}/>;
                                case 'int':
                                    return <Form.Control {...commonProps} type="number" step={1} value={options[option.name]}/>;
                                case 'float':
                                    return <Form.Control {...commonProps} type="number" step="any" value={options[option.name]}/>;
                                case 'bool':
                                    return <Form.Check {...commonProps} checked={options[option.name]}/>;
                                case 'choice':
                                    return option.choices.map(choice => (
                                        <Form.Check
                                            {...commonProps}
                                            inline
                                            id={option.name+choice.value}
                                            type="radio"
                                            value={choice.value}
                                            label={choice.label}
                                            checked={options[option.name] === choice.value}
                                        />
                                    ));
                                default:
                                    return null;
                            }
                        })()}
                    </Col>
                </Row>
            ))}
        </>
    );
}


export function Action(props) {
    const dispatch = useDispatch();
    const actionFromStore = useSelector((state) => actionSelector(state, props.id));
    const [showEdit, setShowEdit] = useState(false);
    const [action, setAction] = useState(actionFromStore);

    const actionTemplate = available_actions.find(action_template => action_template.name === action.action)

    const handleClose = () => setShowEdit(false);
    const handleEdit = () => setShowEdit(true);
    const handleSave = () => {
        dispatch(updateAction(action));
        handleClose();
    };
    const handleDiscard = () => {
        setAction(actionFromStore);
        handleClose();
    }

    const delAction = () => {
        dispatch(removeAction(action.id));
        props.onDelete && props.onDelete();
    }
    const nameChanged = (event) => {
        setAction(action => ({
            ...action,
            name: event.target.value
        }))
    }
    const optionsUpdated = (newOptions) => {
        setAction(action => ({
            ...action,
            options: newOptions
        }))
    }
    const actionTypeChanged = (event) => {
        const action_template = available_actions.find(action_template => action_template.name === event.target.value);
        action_template && setAction((action) => ({
            ...action,
            "action": event.target.value,
            "type": action_template.type,
            "options": {},
            "options_order": action_template.options.map(option => option.name)
        }));
    }

    return (
        <>
            <Card className="action">
                <Card.Body>
                    <Card.Title>{action.name}</Card.Title>
                    <Card.Text>
                        {actionTemplate ? actionTemplate.description : ''}
                    </Card.Text>
                    <DeleteButton onClick={delAction}/>
                    <EditButton onClick={handleEdit}/>
                </Card.Body>
            </Card>

            <Modal show={showEdit} onHide={handleDiscard} backdrop="static" size="lg">
                <Modal.Header>
                    <Modal.Title>{action.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <Row>
                            <Col><Form.Label htmlFor="action-name">Nom de l'action</Form.Label></Col>
                            <Col><Form.Control id="action-name" type="text" value={action.name} onChange={nameChanged}/></Col>
                        </Row>
                        <Row>
                            <Col><Form.Label htmlFor="action-type">Action à effectuer</Form.Label></Col>
                            <Col>
                                <Form.Control id="action-type" as="select" defaultValue="default" value={action.action} onChange={actionTypeChanged}>
                                    <option value="default" disabled hidden>Sélectionner</option>
                                    {available_actions.map(action_template => (
                                        <option key={action_template.name} value={action_template.name}>{action_template.description}</option>
                                    ))}
                                </Form.Control>
                            </Col>
                        </Row>
                        <ActionOptions action={action.action} options={action.options} callback={optionsUpdated}/>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <SaveDiscardButtons onSave={handleSave} onDiscard={handleDiscard}/>
                </Modal.Footer>
            </Modal>
        </>
    )
}