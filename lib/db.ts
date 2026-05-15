import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var _pgPool: Pool | undefined;
}

function createPool() {
  return new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:
      process.env.DATABASE_SSL === "true"
        ? { rejectUnauthorized: false }
        : false,
  });
}

// Reuse pool across hot-reloads in dev
const pool = global._pgPool ?? createPool();
if (process.env.NODE_ENV !== "production") global._pgPool = pool;

export default pool;
