import { Application, Router, RouterContext, log } from "./deps.ts";
import { TransformResult, ensureTrailingSlash } from "./util.ts";
import { transform } from "./transform.ts";

const SERVER_PORT = Number(Deno.env.get("FUSION_PORT"));
const DOWNSTREAM_URL = ensureTrailingSlash(Deno.env.get("FUSION_DOWNSTREAM_URL") as string);

const app = new Application();
const router = new Router();

const transformData = async (ctx: RouterContext) => {
    const data = await ctx.request.body({ type: "json" }).value;
    let transformResponse: TransformResult;
    try {
        transformResponse = transform(data);
    } catch (error) {
        log.warning("transform exception: " + JSON.stringify(error))
        transformResponse = { status: 500 };
    }
    log.info("tranform response: " + JSON.stringify(transformResponse))
    let downstreamResponse;
    try {
        downstreamResponse = await fetch(
            DOWNSTREAM_URL + ctx.params.jobId,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(transformResponse.data),
            },
        );
    } catch (error) {
        log.warning("fetch exception: " + JSON.stringify(error))
        downstreamResponse = { status: 500 };
    }
    log.info("downstream response: " + JSON.stringify(downstreamResponse))
    if (downstreamResponse.status >= 400) {
        ctx.response.status = downstreamResponse.status;
        if (downstreamResponse.statusText) {
            ctx.response.body = downstreamResponse.statusText;
        }
    } else {
        ctx.response.status = transformResponse.status;
        if (transformResponse.statusText) {
            ctx.response.body = transformResponse.statusText;
        }
    }
}

router
    .post('/:jobId', transformData);

log.info("Server starting on port " + SERVER_PORT);

app
    .use(router.routes())
    .use(router.allowedMethods())
    .listen({ port: SERVER_PORT });
