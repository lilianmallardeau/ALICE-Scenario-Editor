export function resetScenario() {
    return ({
        type: "resetScenario",
        payload: 1
    });
}

export function updateWholeScenario(scenario) {
    return ({
        type: "updateWholeScenario",
        payload: scenario
    });
}