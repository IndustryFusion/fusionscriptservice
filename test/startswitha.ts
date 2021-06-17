import { isObject, TransformResult, JSONRoot, JSONObject } from "./util.ts"

export function transform(data: JSONRoot): TransformResult {
    if (!isObject(data)) {
        return { status: 400, statusMessage: "Only JSON objects supported" };
    }
    const objectData = data as JSONObject;

    const result: TransformResult = { status: 201 };

    const filteredProps = Object.entries(objectData).filter((entry) => entry[0].toLowerCase().startsWith("a"));
    result.data = Object.fromEntries(filteredProps);

    return result;
}
