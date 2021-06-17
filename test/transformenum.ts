import { isObject, TransformResult, JSONRoot, JSONObject, isNumber, isValidEnumValue } from "./util.ts"

export function transform(data: JSONRoot): TransformResult {
    if (!isObject(data)) {
        return { status: 400, statusMessage: "Only JSON objects supported" };
    }
    const objectData = data as JSONObject;

    const result: TransformResult = { status: 201 };

    const stateKey = 'operatingstate';
    if (stateKey in objectData) {
        if (!isNumber(objectData[stateKey])) {
            return { status: 400, statusMessage: "operatingstate not a number " + objectData[stateKey] };
        }
        const operatingstate = objectData[stateKey] as number;
        if (isValidEnumValue(SourceState, operatingstate)) {
            const sourceState: SourceState = operatingstate as SourceState;
            const stateMapping = new Map<SourceState, TargetState>([
                [SourceState.OFF, TargetState.OFF],
                [SourceState.IDLE, TargetState.IDLE],
                [SourceState.STARTING, TargetState.RUNNING],
                [SourceState.RUNNING, TargetState.RUNNING],
                [SourceState.STOPPING, TargetState.RUNNING],
                [SourceState.ERROR, TargetState.ERROR]
            ]);
            objectData[stateKey] = stateMapping.get(sourceState) as TargetState;
        } else {
            delete objectData[stateKey];
        }
    }
    result.data = objectData;

    return result;
}

enum SourceState {
    OFF = -1,
    IDLE = 0,
    STARTING = 1,
    RUNNING = 2,
    STOPPING = 3,
    ERROR = 4,
}

enum TargetState {
    OFF = 0,
    IDLE = 1,
    RUNNING = 2,
    ERROR = 3
}
