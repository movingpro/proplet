import { defineRelations } from "drizzle-orm";

import { conditions } from "./conditions";
import { damageLocations } from "./damageLocations";
import { files } from "./files";
import { locations } from "./locations";
import { tenants } from "./tenants";

export const relations = defineRelations(
  { tenants, conditions, damageLocations, locations, files },
  (r) => ({
    conditions: {
      tenant: r.one.tenants({
        from: r.conditions.tenantId,
        to: r.tenants.id,
      }),
    },
    damageLocations: {
      tenant: r.one.tenants({
        from: r.damageLocations.tenantId,
        to: r.tenants.id,
      }),
    },
    locations: {
      tenant: r.one.tenants({
        from: r.locations.tenantId,
        to: r.tenants.id,
      }),
    },
    tenants: {
      conditions: r.many.conditions(),
      damageLocations: r.many.damageLocations(),
      locations: r.many.locations(),
    },
  }),
);
