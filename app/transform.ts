import { JSONRoot, TransformResult } from "./util.ts"

export function transform(data: JSONRoot): TransformResult  {
    return {status: 201, data: data};
}
