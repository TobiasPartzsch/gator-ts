import { Feed, User } from "src/lib/db/schema";
import { createFeed, createFeedFollow, getFeeds } from "../lib/db/queries/feeds";
import { getUserById } from "../lib/db/queries/users";

export async function handlerAddFeed(
    cmdName: string,
    user: User,
    ...args: string[]) {
    if (args.length !== 2) {
        throw new Error(`usage: ${cmdName} <feed_name> <url>`);
    }

    const feedName = args[0];
    const url = args[1];

    const feed = await createFeed(feedName, url, user.id);
    if (!feed) {
        throw new Error(`Failed to create feed`);
    }

    console.log("Feed created successfully:");
    printFeed(feed, user);

    const feedFollow = await createFeedFollow(user.id, feed.id);
    console.log(`User ${feedFollow.userName} is now following feed ${feedFollow.feedName}`);
}

export async function handlerListFeeds(_: string) {
    const feeds = await getFeeds();

    if (feeds.length === 0) {
        console.log(`No feeds found.`);
        return;
    }

    console.log(`Found %d feeds:\n`, feeds.length);
    for (let feed of feeds) {
        const user = await getUserById(feed.userId);
        if (!user) {
            throw new Error(`Failed to find user for feed ${feed.id}`);
        }

        printFeed(feed, user);
        console.log(`=====================================`);
    }
}

export function printFeed(feed: Feed, user: User) {
    console.log(`* ID:            ${feed.id}`);
    console.log(`* Created:       ${feed.createdAt}`);
    console.log(`* Updated:       ${feed.updatedAt}`);
    console.log(`* name:          ${feed.name}`);
    console.log(`* URL:           ${feed.url}`);
    console.log(`* User:          ${user.name}`);
}
