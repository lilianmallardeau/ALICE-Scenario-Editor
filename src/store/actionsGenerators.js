export function resetScenario() {
    return ({
        type: "resetScenario"
    });
}

export function updateWholeScenario(scenario) {
    return ({
        type: "updateWholeScenario",
        payload: scenario
    });
}