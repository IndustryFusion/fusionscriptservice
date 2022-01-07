import { isObject, TransformResult, JSONRoot, JSONObject, mapEnumValue } from "./util.ts"

export function transform(data: JSONRoot): TransformResult {
    if (!isObject(data)) {
        return { status: 400, statusText: "Only JSON objects supported" };
    }
    const objectData = data as JSONObject;

    mapEnumValue(objectData, 'mode', SourceState, stateMapping);

    return { status: 201, data: objectData };
}

enum SourceState {
    MANUAL = 0,
    AUTOMATIC = 1,
    SEMIAUTOMATIC = 2,
    AUTOMATIC_FLUID_GAS = 3
}

enum TargetState {
    MANUAL = "MANUAL",
    AUTOMATIC = "AUTOMATIC",
    SEMIAUTOMATIC = "SEMIAUTOMATIC",
    AUTOMATIC_FLUID_GAS = "AUTOMATIC_FLUID_GAS"
}

const stateMapping = new Map<SourceState, TargetState>([
    [SourceState.MANUAL, TargetState.MANUAL],
    [SourceState.AUTOMATIC, TargetState.AUTOMATIC],
    [SourceState.SEMIAUTOMATIC, TargetState.SEMIAUTOMATIC],
    [SourceState.AUTOMATIC_FLUID_GAS, TargetState.AUTOMATIC_FLUID_GAS],
]);
