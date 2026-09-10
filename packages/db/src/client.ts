import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";
const url = process.env.DATABASE_URL;
export function createDb(databaseUrl = url) {
  if (!databaseUrl) throw new Error("DATABASE_URL is required to create a database client");
  const client = postgres(databaseUrl, { max: 10, prepare: false });
  return drizzle(client, { schema });
}
