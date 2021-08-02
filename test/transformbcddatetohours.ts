import { isObject, TransformResult, JSONRoot, JSONObject, isNumber, bcdToInt } from "./util.ts"
import { datetime } from "./deps.ts"

export function transform(data: JSONRoot): TransformResult {
    if (!isObject(data)) {
        return { status: 400, statusText: "Only JSON objects supported" };
    }
    const objectData = data as JSONObject;

    if ('Jahr_Folgewartung' in objectData && 'MonatTag_Folgewartung' in objectData) {
        if (!isNumber(objectData['Jahr_Folgewartung'])) {
            return { status: 400, statusText: "MonatTag_Folgewartung not a number " + objectData['Jahr_Folgewartung'] };
        }
        if (!isNumber(objectData['MonatTag_Folgewartung'])) {
            return { status: 400, statusText: "MonatTag_Folgewartung not a number " + objectData['MonatTag_Folgewartung'] };
        }
        const jahr = objectData['Jahr_Folgewartung'] as number;
        const monatTag = objectData['MonatTag_Folgewartung'] as number;

        const monatTagStr = String(bcdToInt(monatTag)).padStart(4, "0");
        const strDate = monatTagStr.slice(2) + monatTagStr.slice(0,2) + String(bcdToInt(jahr)).padStart(2, "0");
        objectData['Datum_Folgewartung'] = strDate;

        const maintenanceDate = datetime.parse(strDate, "ddMMyy")
        const now = new Date();

        let datediffHours = datetime.difference(now, maintenanceDate, { units: ["hours"] }).hours as number;
        if (maintenanceDate < now) {
            datediffHours = -datediffHours;
        }
        objectData['Stunden_Folgewartung'] = datediffHours;
    }

    return { status: 201, data: objectData };
}
