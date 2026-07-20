import { Hono } from "hono";

import { getLocationsQuery } from "#application/locations/getLocationsQuery";
import { saveLocationsCommand } from "#application/locations/saveLocationsCommand";
import { currentTenantId } from "#infrastructure/sessionContext";

const locationsApi = new Hono();

locationsApi.get("/", async (c) => {
  const data = await getLocationsQuery(currentTenantId());

  return c.json(data);
});
locationsApi.post("/", async (c) => {
  const data = await c.req.json();
  await saveLocationsCommand(currentTenantId(), data);

  return c.json({ message: "Locations saved successfully" });
});

export default locationsApi;
