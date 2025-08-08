import { readConfig } from "src/config";
import { Feed, User } from "src/lib/db/schema";
import { createFeed } from "../lib/db/queries/feeds";
import { getUserByName } from "../lib/db/queries/users";

export async function handlerAddFeed(cmdName: string, ...args: string[]) {
    if (args.length !== 2) {
        throw new Error(`usage: ${cmdName} <feed_name> <url>`);
    }

    const config = readConfig();
    const user = await getUserByName(config.currentUserName);

    if (!user) {
        throw new Error(`User ${config.currentUserName} not found`);
    }

    const feedName = args[0];
    const url = args[1];

    const feed = await createFeed(feedName, url, user.id);
    if (!feed) {
        throw new Error(`Failed to create feed`);
    }

    console.log("Feed created successfully:");
    printFeed(feed, user);
}

function printFeed(feed: Feed, user: User) {
    console.log(`* ID:            ${feed.id}`);
    console.log(`* Created:       ${feed.createdAt}`);
    console.log(`* Updated:       ${feed.updatedAt}`);
    console.log(`* name:          ${feed.name}`);
    console.log(`* URL:           ${feed.url}`);
    console.log(`* User:          ${user.name}`);
}
