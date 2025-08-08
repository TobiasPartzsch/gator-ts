import { db } from "..";
import { feeds } from "../schema";
import { firstOrUndefined } from "./utils";

export async function createFeed(
    feedName: string,
    url: string,
    userID: string,
) {
    try {
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

export async function getFeeds() {
    try {
        return await db
            .select()
            .from(feeds)
    } catch (error) {
        console.error('Database error details:', error);
        throw error;
    }
}
