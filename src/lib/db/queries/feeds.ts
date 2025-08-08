import { db } from "..";
import { feeds } from "../schema";
import { firstOrUndefined } from "./utils";

export async function createFeed(
    feedName: string,
    url: string,
    userID: string,
) {
    try {
        // Add this before your insert to test
        const testQuery = await db.select().from(feeds).limit(1);
        console.log('Database connection test:', testQuery);

        const result = await db
            .insert(feeds)
            .values({
                name: feedName,
                url,
                userID,
            })
            .returning();

        return firstOrUndefined(result);
    } catch (error) {
        console.error('Database error details:', error);
        throw error;
    }
}