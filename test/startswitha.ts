import { isObject, TransformResult, JSONRoot, JSONObject } from "./util.ts"

export function transform(data: JSONRoot): TransformResult {
    if (!isObject(data)) {
        return { status: 400, statusMessage: "Only JSON objects supported" };
    }
    let objectData = data as JSONObject;

    const filteredProps = Object.entries(objectData).filter((entry) => entry[0].toLowerCase().startsWith("a"));
    objectData = Object.fromEntries(filteredProps);

    return { status: 201, data: objectData };
}
