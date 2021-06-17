export declare type MapValue = string | number | bigint | boolean;
export declare type PrimitiveMap = Map<string, MapValue>;

export type JSONValue =
    | string
    | number
    | boolean
    | null
    | JSONValue[]
    | { [key: string]: JSONValue }

export interface JSONObject {
    [k: string]: JSONValue
}

export interface JSONArray extends Array<JSONValue> { }

export type JSONRoot =
    | JSONArray
    | JSONObject
    | JSONValue;

export interface TransformResult {
    status: number;
    statusMessage?: string;
    data?: JSONRoot;
}

export function isArray(data: unknown): boolean {
    return Array.isArray(data);
}

export function isObject(data: unknown): boolean {
    return (typeof data === 'object') && (data !== null) && (!isArray(data));
}

export function isNumber(data: unknown): boolean {
    return (typeof data === 'number');
}

export function isValidEnumValue(enumToCheck: unknown, value: unknown): boolean {
    if (typeof enumToCheck !== 'object') {
        return false;
    }
    return Object.values(enumToCheck as Record<string, unknown>).indexOf(value) >= 0;
}
