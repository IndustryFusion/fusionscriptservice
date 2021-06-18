import { isObject, TransformResult, JSONRoot, JSONObject, mapNumberValue } from "./util.ts"

export function transform(data: JSONRoot): TransformResult {
    if (!isObject(data)) {
        return { status: 400, statusMessage: "Only JSON objects supported" };
    }
    const objectData = data as JSONObject;

    mapNumberValue(objectData, 'operatingstate', stateMapping);

    return { status: 201, data: objectData };
}

const stateMapping = new Map<number, number>([
    [-1, 0],
    [0, 1],
    [1, 2],
    [2, 2],
    [3, 2],
    [4, 3]
]);
