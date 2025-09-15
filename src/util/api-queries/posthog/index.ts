import { makeApi, Zodios } from "@zodios/core";
import { getInsightResultEndpoint, getInsightsEndpoint } from "./endpoints";
import { createSafeClient, loggerPlugin } from "../plugins";
import { POSTHOG_API_URL } from "@/config";
const posthogApi = makeApi([getInsightsEndpoint, getInsightResultEndpoint]);

const posthogClient = new Zodios(POSTHOG_API_URL, posthogApi);

posthogClient.use(loggerPlugin);

const posthogSafeClient = createSafeClient(posthogClient, posthogApi);

export { posthogClient, posthogSafeClient };