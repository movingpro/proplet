import { Hono } from "hono";

import { getConditionsQuery } from "./getConditionsQuery";
import { saveConditionsCommand } from "./saveConditionsCommand";

const conditionsApi = new Hono();

conditionsApi.get("/", getConditionsQuery);
conditionsApi.post("/", saveConditionsCommand);

export default conditionsApi;
