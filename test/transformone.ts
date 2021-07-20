import { isObject, TransformResult, JSONRoot, JSONObject, isNumber } from "./util.ts"

export function transform(data: JSONRoot): TransformResult {
    if (!isObject(data)) {
        return { status: 400, statusText: "Only JSON objects supported" };
    }
    const objectData = data as JSONObject;

    if ('speed' in objectData) {
        if (!isNumber(objectData['speed'])) {
            return { status: 400, statusText: "Speed not a number " + objectData['speed'] };
        }
        const speed = objectData['speed'] as number;
        objectData['speed'] = speed / 100;
    }

    return { status: 201, data: objectData };
}
