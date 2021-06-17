import { Application, Router, RouterContext } from "./deps.ts";
import { TransformResult } from "./util.ts";
import { transform } from "./transform.ts";

const SERVER_PORT = Number(Deno.env.get("FUSION_PORT"));

const app = new Application();
const router = new Router();

const transformData = async (ctx: RouterContext) => {
    const data = await ctx.request.body({ type: "json" }).value;
    let result: TransformResult;
    try {
        result = transform(data);
    } catch {
        result =  {status: 500};
    }
    ctx.response.status = result.status;
    if (result.status >= 300) {
        ctx.response.body = result.statusMessage;
    } else {
        ctx.response.body = result.data;
    }
}

router
    .post('/transform', transformData);

app
    .use(router.routes())
    .use(router.allowedMethods())
    .listen({ port: SERVER_PORT });

