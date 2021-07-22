import React, {createRef} from 'react';
import {useDispatch, useSelector} from "react-redux";
import Button from "react-bootstrap/Button";
import {DownloadIcon, FileSymlinkFileIcon} from "@primer/octicons-react";

import {store} from "../store/store";
import {SensorsModal} from './sensors-modal';
import {ChannelsModal} from "./medialists-modal";
import {scenarioSelector, presetsSelector} from "../store/selectors";
import {updateWholeScenario, resetScenario} from "../store/actionsGenerators";
import {ArduinosModal} from "./arduinos-modal";

function downloadJSON(filename, content) {
    const stringifiedContent = JSON.stringify(content, null, 4);
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(stringifiedContent));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    element.click();
}

function openScenario(event) {
    let file = event.target.files[0];
    if (!file)
        return;
    let reader = new FileReader();
    reader.onload = (e) => {
        store.dispatch(updateWholeScenario(JSON.parse(String(e.target.result))));
    }
    reader.readAsText(file);
}

export function MenuBar(props) {
    const dispatch = useDispatch();
    const scenario = useSelector(scenarioSelector);
    const presets = useSelector(presetsSelector);
    const scenarioFilePicker = createRef();
    const presetsFilePicker = createRef();

    const openPresets = (event) => {
        // dispatch();
    }

    return (
        <div id="menubar">
            <ArduinosModal/>
            <SensorsModal/>
            <ChannelsModal/>
            <Button onClick={() => downloadJSON("scenario.json", scenario)}>
                <DownloadIcon size={16}/>Download scenario
            </Button>
            <Button onClick={() => scenarioFilePicker.current.click()}>
                <FileSymlinkFileIcon size={16}/>Open scenario
            </Button>
            <Button onClick={() => downloadJSON("presets.json", presets)}>
                <DownloadIcon size={16}/>Export presets
            </Button>
            <Button onClick={() => presetsFilePicker.current.click()}>
                <FileSymlinkFileIcon size={16}/>Import presets
            </Button>
            <input type="file" style={{display: 'none'}} ref={scenarioFilePicker} id="file-picker" onChange={openScenario}/>
            <input type="file" style={{display: 'none'}} ref={presetsFilePicker} id="file-picker" onChange={openPresets}/>
            <Button onClick={() => dispatch(resetScenario())}>
                Reset Scenario
            </Button>
        </div>
    );
}

