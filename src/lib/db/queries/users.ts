import { eq, sql } from "drizzle-orm";
import { db } from "..";
import { users } from "../schema";
import { firstOrUndefined } from "./utils";

export async function dropAllTables() {
    await db.execute(sql`DROP TABLE IF EXISTS feeds CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS users CASCADE`);
}

export async function runMigrations() {
    // await migrate(db, { migrationsFolder: "./src/lib/db/migrations" });
    await db.execute(sql`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);
}

export async function createUser(name: string) {
    const [result] = await db.insert(users).values({ name: name }).returning();
    return result;
}

export async function getUserByName(name: string) {
    const result = await db.select().from(users).where(eq(users.name, name));
    return firstOrUndefined(result);
}

export async function getUserById(id: string) {
    const result = await db.select().from(users).where(eq(users.id, id));
    return firstOrUndefined(result);
}

export async function getUsers() {
    const result = await db.select().from(users);
    return result;
}

export async function deleteUsers() {
    const [result] = await db.delete(users);
    return result
}

