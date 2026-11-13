import { getContext } from "hono/context-storage";

import type { Db } from "./db";

type Env = {
  Variables: {
    tenantId: string;
    db: Db;
  };
};

export const currentTenantId = () => {
  return getContext<Env>().var.tenantId;
};

export const currentDb = () => {
  return getContext<Env>().var.db;
};
