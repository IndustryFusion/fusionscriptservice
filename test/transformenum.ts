import { isObject, TransformResult, JSONRoot, JSONObject, mapEnumValue } from "./util.ts"

export function transform(data: JSONRoot): TransformResult {
    if (!isObject(data)) {
        return { status: 400, statusText: "Only JSON objects supported" };
    }
    const objectData = data as JSONObject;

    mapEnumValue(objectData, 'operatingstate', SourceState, stateMapping);

    return { status: 201, data: objectData };
}

enum SourceState {
    OFF = -1,
    IDLE = 0,
    STARTING = 1,
    RUNNING = 2,
    STOPPING = 3,
    ERROR = 4,
    TEST = 5
}

enum TargetState {
    OFF = 0,
    IDLE = 1,
    RUNNING = 2,
    ERROR = 3
}

const stateMapping = new Map<SourceState, TargetState>([
    [SourceState.OFF, TargetState.OFF],
    [SourceState.IDLE, TargetState.IDLE],
    [SourceState.STARTING, TargetState.RUNNING],
    [SourceState.RUNNING, TargetState.RUNNING],
    [SourceState.STOPPING, TargetState.RUNNING],
    [SourceState.ERROR, TargetState.ERROR]
]);
