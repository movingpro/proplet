import { Hono } from "hono";

import { getConditionsQuery } from "#application/conditions/getConditionsQuery";
import { saveConditionsCommand } from "#application/conditions/saveConditionsCommand";
import { currentTenantId } from "#infrastructure/sessionContext";

const conditionsApi = new Hono();

conditionsApi.get("/", async (c) => {
  const data = await getConditionsQuery(currentTenantId());

  return c.json(data);
});
conditionsApi.post("/", async (c) => {
  const data = await c.req.json();
  await saveConditionsCommand(currentTenantId(), data);

  return c.json({ message: "Conditions saved successfully" });
});

export default conditionsApi;
