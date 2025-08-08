import { readConfig } from "src/config";
import { createFeedFollow, getFeedByUrl, getFeedFollowsForUser } from "src/lib/db/queries/feeds";
import { getUserByName } from "src/lib/db/queries/users";


export async function handlerFollow(cmdName: string, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error(`usage: ${cmdName} <follow_<url>`);
    }

    const config = readConfig();
    const user = await getUserByName(config.currentUserName);

    if (!user) {
        throw new Error("no user logged in");
    }

    const url = args[0];
    const feed = await getFeedByUrl(url);
    if (!feed) {
        throw new Error(`feed not found for URL: ${url}`);
    }
    const feedFollow = await createFeedFollow(user.id, feed.id);
    console.log(`User ${feedFollow.userName} is now following feed ${feedFollow.feedName}`);
} export async function handlerListFollowing(_cmdName: string, ..._args: string[]) {
    const config = readConfig();
    const user = await getUserByName(config.currentUserName);

    if (!user) {
        throw new Error("no user logged in");
    }

    const feedFollows = await getFeedFollowsForUser(user.id);
    if (feedFollows.length === 0) {
        console.log("You are not following any feeds yet.");
        return;
    }
    for (const feedFollow of feedFollows) {
        console.log(feedFollow.feedName);
    }
}

