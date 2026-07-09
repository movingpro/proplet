import { Hono } from "hono";

import { getLocationsQuery } from "./getLocationsQuery";
import { saveLocationsCommand } from "./saveLocationsCommand";

const locationsApi = new Hono();

locationsApi.get("/getLocations", getLocationsQuery);
locationsApi.get("/saveLocations", saveLocationsCommand);
locationsApi.get("/saveLocationsEx", saveLocationsCommand);

export default locationsApi;
