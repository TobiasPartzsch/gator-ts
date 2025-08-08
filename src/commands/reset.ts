import { DrizzleQueryError, sql } from "drizzle-orm";
import { db } from "src/lib/db";


export async function handlerReset(_cmdName: string, ..._args: string[]) {
    try {
        // await dropAllTables();
        // await runMigrations();
        // console.log("Reset successfull! Dropped all tables and ran migrations!");

        // const result = await deleteUsers();
        // console.log("Reset successful! Users deleted!");

        await db.execute(sql`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);

        await db.execute(sql`
            CREATE TABLE IF NOT EXISTS "users" (
                "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
                "created_at" timestamp DEFAULT now() NOT NULL,
                "updated_at" timestamp DEFAULT now() NOT NULL,
                "name" text NOT NULL,
                CONSTRAINT "users_name_unique" UNIQUE("name")
            )
        `);

        await db.execute(sql`
            CREATE TABLE IF NOT EXISTS "feeds" (
                "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
                "created_at" timestamp DEFAULT now() NOT NULL,
                "updated_at" timestamp DEFAULT now() NOT NULL,
                "name" text NOT NULL,
                "url" text NOT NULL,
                "user_id" uuid NOT NULL,
                CONSTRAINT "feeds_name_unique" UNIQUE("name"),
                CONSTRAINT "feeds_url_unique" UNIQUE("url")
            )
        `);

        // Now delete the data
        await db.execute(sql`DELETE FROM feeds`);
        await db.execute(sql`DELETE FROM users`);

        console.log("Reset successful! Tables created and data cleared!");
    }
    catch (error) {
        console.log(error);
        if (error instanceof DrizzleQueryError) {
            throw new Error("Couldn't delete users!");
        }
        else {
            throw new Error(`Unknown error: ${error}`);
        }
    }
}
