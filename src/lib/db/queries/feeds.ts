import { eq } from "drizzle-orm";
import { db } from "..";
import { feedFollows, feeds, users } from "../schema";
import { firstOrUndefined } from "./utils";

export async function createFeed(
    feedName: string,
    url: string,
    userId: string,
) {
    try {
        const result = await db
            .insert(feeds)
            .values({
                name: feedName,
                url,
                userId,
            })
            .returning();

        return firstOrUndefined(result);
    } catch (error) {
        console.error('Database error details:', error);
        throw error;
    }
}

export async function getFeedByUrl(url: string) {
    const matchingFeeds = await db.select().from(feeds).where(eq(feeds.url, url));
    if (matchingFeeds.length === 0) {
        return null;
    }
    return matchingFeeds[0];
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

export async function createFeedFollow(userId: string, feedId: string) {
    try {
        const [newFeedFollow] = await db.insert(feedFollows)
            .values({
                userId: userId,
                feedId: feedId,
            })
            .returning();

        const result = await db
            .select({
                id: feedFollows.id,
                createdAt: feedFollows.createdAt,
                updatedAt: feedFollows.updatedAt,
                userId: feedFollows.userId,
                feedId: feedFollows.feedId,
                feedName: feeds.name,
                userName: users.name,
            })
            .from(feedFollows)
            .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
            .innerJoin(users, eq(feedFollows.userId, users.id))
            .where(eq(feedFollows.id, newFeedFollow.id));
        return result[0];
    } catch (error) {
        console.error('Database error details:', error);
        throw error;
    }
}

export async function getFeedFollowsForUser(userId: string) {
    const results = await db
        .select({
            // Same fields as createFeedFollow
            id: feedFollows.id,
            createdAt: feedFollows.createdAt,
            updatedAt: feedFollows.updatedAt,
            userId: feedFollows.userId,
            feedId: feedFollows.feedId,
            feedName: feeds.name,
            userName: users.name,
        })
        .from(feedFollows)
        .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
        .innerJoin(users, eq(feedFollows.userId, users.id))
        .where(eq(feedFollows.userId, userId));

    return results;
}