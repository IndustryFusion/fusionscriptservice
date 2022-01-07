export declare type MapValue = string | number | bigint | boolean;
export declare type PrimitiveMap = Map<string, MapValue>;
import { log } from "./deps.ts"

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

// deno-lint-ignore no-empty-interface
export interface JSONArray extends Array<JSONValue> { }

export type JSONRoot =
    | JSONArray
    | JSONObject
    | JSONValue;

export interface TransformResult {
    status: number;
    statusText?: string;
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

export function mapEnumValue(objectData: JSONObject, key: string, sourceEnum: unknown, enumMap: Map<number, number | string>): void {
    if (!isObject(sourceEnum)) {
        const message = `Invalid sourceEnum ${sourceEnum}`;
        log.error(message)
        throw new Error(message);
    }
    if (key in objectData) {
        if (!isNumber(objectData[key])) {
            log.warning(`Invalid value for ${key}: ${objectData[key]} (not a number)`)
            delete objectData[key];
            return;
        }
        const enumValue = objectData[key] as number;
        if (isValidEnumValue(sourceEnum, enumValue)) {
            if (enumMap.has(enumValue)) {
                objectData[key] = enumMap.get(enumValue) as number | string;
            } else {
                log.warning(`Value ${enumValue} for ${key} not mapped`)
                delete objectData[key];
                return;
            }
        } else {
            log.warning(`Invalid value for ${key}: ${enumValue} (enum value does not exist)`)
            delete objectData[key];
            return;
        }
    }
}

export function mapNumberValue(objectData: JSONObject, key: string, enumMap: Map<number, number>): void {
    if (key in objectData) {
        if (!isNumber(objectData[key])) {
            log.warning(`Invalid value for ${key}: ${objectData[key]} (not a number)`)
            delete objectData[key];
            return;
        }
        const numValue = objectData[key] as number;
        if (enumMap.has(numValue)) {
            objectData[key] = enumMap.get(numValue) as number;
        } else {
            log.warning(`Value ${numValue} for ${key} not mapped`)
            delete objectData[key];
            return;
        }
    }
}

export function ensureTrailingSlash(url: string) {
    if (!url.endsWith('/')) {
        return url + '/';
    }
    return url;
}

export function bcdToInt(bcd: number) {
    let result = 0;
    let multiplier = 1;
    while (bcd > 0) {
        result += ((bcd & 15) * multiplier);
        bcd = bcd >>> 4;
        multiplier *= 10;
    }
    return result;
}
