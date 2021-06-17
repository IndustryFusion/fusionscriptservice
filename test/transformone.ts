import { isObject, TransformResult, JSONRoot, JSONObject, isNumber } from "./util.ts"

export function transform(data: JSONRoot): TransformResult {
    if (!isObject(data)) {
        return { status: 400, statusMessage: "Only JSON objects supported" };
    }
    const objectData = data as JSONObject;

    const result: TransformResult = { status: 201 };

    if ('speed' in objectData) {
        if (!isNumber(objectData['speed'])) {
            return { status: 400, statusMessage: "Speed not a number " + objectData['speed'] };
        }
        const speed = objectData['speed'] as number;
        objectData['speed'] = speed / 100;
    }
    result.data = objectData;

    return result;
}
