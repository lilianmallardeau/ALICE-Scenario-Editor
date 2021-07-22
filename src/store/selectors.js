export function scenarioSelector(state) {
    return state.scenario;
}

export function sensorsSelector(state) {
    return scenarioSelector(state).sensors;
}

export function mediaListsSelector(state) {
    return scenarioSelector(state).media_channels;
}

export function soundChannelsNameSelector(state) {
    return scenarioSelector(state).media_channels.map(channel => channel.name);
}

export function actionsSelector(state) {
    return scenarioSelector(state).actions;
}

export function actionSelector(state, id) {
    return scenarioSelector(state).actions.find(action => action.id === id);
}

export function eventsSelector(state) {
    return scenarioSelector(state).events;
}

export function eventsIDSelector(state) {
    return scenarioSelector(state).events.map(event => event.id);
}

export function eventSelector(state, id) {
    return scenarioSelector(state).events.find(event => event.id === id);
}

export function firstEventSelector(state) {
    return scenarioSelector(state).first_event;
}

export function timelineSelector(state) {
    return scenarioSelector(state).timeline;
}

export function presetsSelector(state) {
    return state.presets;
}

export function arduinosSelector(state) {
    return state.arduinos;
}