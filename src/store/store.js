import {combineReducers, configureStore, createSlice, nanoid} from '@reduxjs/toolkit';
import {loadState, saveState} from "./localStorage";

const defaultScenario = {
    sensors: [],
    media_channels: [
        {
            id: nanoid(),
            name: "Musiques",
            content: []
        },
        {
            id: nanoid(),
            name: "Dialogues",
            content: []
        },
        {
            id: nanoid(),
            name: "Bruitages",
            content: []
        },
        {
            id: nanoid(),
            name: "Ambiances",
            content: []
        }
    ],
    actions: [],
    events: [],
    sensor_events: [],
    timeline: []
}

// eslint-disable-next-line no-unused-vars
const defaultState = {
    scenario: defaultScenario,
    presets: []
}

const sensorSlice = createSlice({
    name: "sensors",
    initialState: [],
    reducers: {
        updateSensors: (state, action) => {
            return action.payload;
        }
    }
});

const mediaSlice = createSlice({
    name: "media_channels",
    initialState: [
        {
            id: nanoid(),
            name: "Musiques",
            content: []
        },
        {
            id: nanoid(),
            name: "Dialogues",
            content: []
        },
        {
            id: nanoid(),
            name: "Bruitages",
            content: []
        },
        {
            id: nanoid(),
            name: "Ambiances",
            content: []
        }
    ],
    reducers: {
        // addMediaChannel: (state, action) => {
        //     // payload: "new channel_name"
        //     if (!state.map(e => e.name).includes(action.payload))
        //         state.push({
        //             name: action.payload,
        //             content: []
        //         })
        // },
        // updateMediaChannel: (state, action) => {
        //     // payload: {
        //     //     name: "channel_name",
        //     //     content: ["media1", "media2", ...]
        //     // }
        //     return state.map(channel => channel.name === action.payload.name ? action.payload : channel);
        // },
        // deleteMediaChannel: (state, action) => {
        //     // payload: "channel_name"
        //     return state.filter(channel => channel.name !== action.payload)
        // },
        // addMediaToChannel: (state, action) => {
        //     // payload : {
        //     //     channel: "channel_name",
        //     //     media: "media_name"
        //     // }
        //     let channel = state.find((channel) => channel.name === action.payload.channel);
        //     if (channel)
        //         channel.content.push(action.payload.media);
        // }
        updateAllChannels: (state, action) => {
            return action.payload;
        }
    }
});

const actionsSlice = createSlice({
    name: "actions",
    initialState: [],
    reducers: {
        createAction: (state, action) => {
            // action.payload = id of the new action
            return state.concat({
                id: action.payload,
                name: 'New action',
                type: '',
                action: '',
                options: {}
            });
        },
        importAction: (state, action) => {
            return state.concat(action.payload);
        },
        removeAction: (state, action) => {
            // action.payload = id of the action to delete
            return state.filter(action_state => action_state.id !== action.payload);
        },
        updateAction: (state, action) => {
            return state.map(action_state => action_state.id === action.payload.id ? action.payload : action_state);
        },
        updateAllActions: (state, action) => {
            return action.payload;
        }
    }
});

const eventSlice = createSlice({
    name: "events",
    initialState: [],
    reducers: {
        createEvent: (state, action) => {
            // action.payload = id of the new event to create
            return state.concat({
                id: action.payload,
                name: "New event",
                start_actions: [],
                stop_actions: [],
                start_listening: [],
                stop_listening: [],
                delay: '',
                next: null
            })
        },
        deleteEvent: (state, action) => {
            // action.payload = id of the event to delete
            return state.filter(event => event.id !== action.payload);
        },
        updateEvent: (state, action) => {
            return state.map(event => event.id === action.payload.id ? action.payload : event);
        },
        setNextEvent: (state, action) => {
            return state.map(event => event.id === action.payload.id ? {
                ...event,
                next: action.payload.next
            } : event);
        },
        updateAllEvents: (state, action) => {
            return action.payload;
        }
    }
});

const sensorEventSlice = createSlice({
    name: "sensor_events",
    initialState: [],
    reducers: {

    }
});

const timelineSlice = createSlice({
    name: "actions",
    initialState: [],
    reducers: {
        addTimelineEvent: (state, action) => {
            return state.concat(action.payload);
        },
        removeTimelineEvent: (state, action) => {
            return state.filter(event => event.id !== action.payload.id);
        },
        updateTimelineEvent: (state, action) => {
            return state.map(event => event.id === action.payload.id ? action.payload : event)
        },
        updateWholeTimeline: (state, action) => {
            return action.payload;
        }
    }
});

const firstEventSlice = createSlice({
    name: "first_event",
    initialState: '',
    reducers: {
        updateFirstEvent: (state, action) => {
            return action.payload;
        }
    }

})


const scenarioReducer = function(state, action) {
    if (action.type === "resetScenario")
        return defaultScenario;
    if (action.type === "updateWholeScenario")
        return action.payload;
    return combineReducers({
        sensors: sensorSlice.reducer,
        media_channels: mediaSlice.reducer,
        actions: actionsSlice.reducer,
        events: eventSlice.reducer,
        sensor_events: sensorEventSlice.reducer,
        timeline: timelineSlice.reducer,
        first_event: firstEventSlice.reducer
    })(state, action);
}

const presetsReducer = function(state, action) {
    return combineReducers({

    })(state, action);
}

const arduinosReducer = createSlice({
    name: "arduinos",
    initialState: [],
    reducers: {
        updateAllArduinos: (state, action) => {
            return action.payload;
        },
        addArduino: (state, action) => {
            return state.concat(action.payload);
        }
    }
})

// const store = createStore(rootReducer);
const store = configureStore({
    reducer: {
        scenario: scenarioReducer,
        //presets: []
        arduinos: arduinosReducer.reducer
    },
    preloadedState: loadState()
});

store.subscribe(() => {
    saveState(store.getState());
})

export { store };
export const { updateSensors } = sensorSlice.actions
export const { updateAllChannels } = mediaSlice.actions
export const { createAction, importAction, removeAction, updateAction, updateAllActions } = actionsSlice.actions
export const { createEvent, deleteEvent, updateEvent, setNextEvent, updateAllEvents } = eventSlice.actions
export const { addTimelineEvent, removeTimelineEvent, updateTimelineEvent, updateWholeTimeline } = timelineSlice.actions
export const { updateFirstEvent } = firstEventSlice.actions
export const { updateAllArduinos, addArduino } = arduinosReducer.actions