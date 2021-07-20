import React from 'react';
import {Button} from "react-bootstrap";
import {XIcon, TasklistIcon, PlusIcon, ArrowUpIcon, ArrowDownIcon, PencilIcon} from '@primer/octicons-react'


export function AddButton(props) {
    return (
        <Button className="button" variant="success" onClick={props.onClick}>
            <PlusIcon size={16}/>{props.children}
        </Button>
    );
}

export function DeleteButton(props) {
    return (
        <Button className="button" variant="danger" onClick={props.onClick}>
            <XIcon size={16}/>{props.children}
        </Button>
    );
}

export function EditButton(props) {
    return (
        <Button className="button" variant="primary" onClick={props.onClick}>
            <PencilIcon size={16}/>{props.children}
        </Button>
    );
}

export function UpButton(props) {
    return (
        <Button className="button" onClick={props.onClick}>
            <ArrowUpIcon size={16}/>
        </Button>
    )
}

export function DownButton(props) {
    return (
        <Button className="button" onClick={props.onClick}>
            <ArrowDownIcon size={16}/>
        </Button>
    )
}

export function SaveDiscardButtons(props) {
    return (
        <>
            <Button className="button" variant="secondary" onClick={props.onDiscard}>
                <XIcon size={16}/> Discard
            </Button>
            <Button className="button" variant="primary" onClick={props.onSave}>
                <TasklistIcon size={16}/> Save Changes
            </Button>
        </>
    )
}