import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {nanoid} from "@reduxjs/toolkit";
import {Form, Col, Row, Container} from "react-bootstrap";

import {Action} from "./actions";
import {eventSelector, eventsIDSelector, eventsSelector, firstEventSelector, scenarioSelector} from "../store/selectors";
import {createAction, createEvent, setNextEvent} from "../store/store";
import {updateEvent, updateFirstEvent} from "../store/store";
import {UpButton, DownButton, AddButton} from "./buttons";


function Event(props) {
    const dispatch = useDispatch();
    const [event, setEvent] = useState(useSelector((state) => eventSelector(state, props.id)));
    useEffect(() => {
        dispatch(updateEvent(event));
    }, [event, dispatch]);

    function addAction() {
        const id = nanoid();
        dispatch(createAction(id));
        setEvent(event => ({
            ...event,
            start_actions: event.start_actions.concat(id)
        }))
    }
    function addActionFromPreset(action) {
        // TODO: addActionFromPreset
    }
    function removeAction(id) {
        setEvent(event => ({
            ...event,
            start_actions: event.start_actions.filter(action_id => action_id !== id)
        }))
    }
    function setDuration(e) {
        setEvent(event => ({
            ...event,
            delay: Number(e.target.value)
        }))
    }

    return (
        <Row className="timeline-event">
            <Col lg={1}>
                <Row><UpButton onClick={props.up}/></Row>
                <Row><Form.Control type="number" min={0} className="hide-arrows" placeholder="Durée" value={event.delay} onChange={setDuration}/></Row>
                <Row><DownButton onClick={props.down}/></Row>
            </Col>
            <Col className="timeline-event">
                {event.start_actions.map(action_id =>
                    <Action key={action_id} id={action_id} onDelete={() => removeAction(action_id)}/>
                )}
                <AddButton onClick={addAction}/>
            </Col>
        </Row>
    );
}

function TimelinePanel(props) {
    const dispatch = useDispatch();
    const eventsFromStore = useSelector(eventsIDSelector);
    const firstEventFromStore = useSelector(firstEventSelector);
    const [events, setEvents] = useState(eventsFromStore);
    const [firstEvent, setFirstEvent] = useState(firstEventFromStore);

    useEffect(() => {
        setEvents(eventsFromStore);
    }, [JSON.stringify(eventsFromStore)]);
    // }, [eventsFromStore]);
    //
    // useEffect(() => {
    //     setFirstEvent(firstEventFromStore);
    // }, [firstEventFromStore]);

    useEffect(() => {
        if (events.length === 0) {
            setFirstEvent('');
        } else {
            setFirstEvent(events[0]);
            for (let i = 0; i < events.length-1; ++i) {
                dispatch(setNextEvent({
                    id: events[i],
                    next: events[i + 1]
                }));
            }
            dispatch(setNextEvent({
                id: events[events.length - 1],
                next: null
            }));
        }
    }, [events, dispatch]);

    useEffect(() => {
        dispatch(updateFirstEvent(firstEvent));
    }, [firstEvent, dispatch]);

    // To start with an empty event:
    // useEffect(() => {
    //     addEvent();
    // }, []);

    const addEvent = () => {
        const id = nanoid();
        dispatch(createEvent(id));
        setEvents(events => events.concat(id));
    }
    const addEventAfter = (event_id) => {
        const id = nanoid();
        dispatch(createEvent(id))
        const index = events.indexOf(event_id);
        setEvents(events => {
            const newEvents = events.slice();
            newEvents.splice(index + 1, 0, id);
            return newEvents;
        });
    }
    function swapEvents(index1, index2) {
        setEvents(events => {
            const newEvents = events.slice();
            [newEvents[index1], newEvents[index2]] = [newEvents[index2], newEvents[index1]];
            return newEvents;
        });
    }
    const upEvent = (event_id) => {
        const index = events.indexOf(event_id);
        if (index > 0)
            swapEvents(index, index-1);
    }
    const downEvent = (event_id) => {
        const index = events.indexOf(event_id);
        if (index < events.length - 1)
            swapEvents(index, index+1);
    }

    return (
        <div id="timeline-panel" className="panel">
            <div className="panel-header">Timeline</div>
            <Container>
            {/*<div>*/}
                {events.map((event_id) =>
                    <div key={event_id}>
                        <Event
                            id={event_id}
                            up={() => upEvent(event_id)}
                            down={() => downEvent(event_id)}
                        />
                        <AddButton onClick={() => addEventAfter(event_id)}/>
                    </div>
                )}
            {/*</div>*/}
            </Container>
            {events.length > 0 || <AddButton onClick={addEvent}/>}
        </div>
    );
}

export { TimelinePanel }