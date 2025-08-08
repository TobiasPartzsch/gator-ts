import { createFeedFollow, getFeedByUrl, getFeedFollowsForUser } from "src/lib/db/queries/feeds";
import { User } from "src/lib/db/schema";


export async function handlerFollow(
    cmdName: string,
    user: User,
    ...args: string[]) {
    if (args.length !== 1) {
        throw new Error(`usage: ${cmdName} <follow_<url>`);
    }

    const url = args[0];
    const feed = await getFeedByUrl(url);
    if (!feed) {
        throw new Error(`feed not found for URL: ${url}`);
    }
    const feedFollow = await createFeedFollow(user.id, feed.id);
    console.log(`User ${feedFollow.userName} is now following feed ${feedFollow.feedName}`);
}

export async function handlerListFeedFollows(_: string, user: User) {
    const feedFollows = await getFeedFollowsForUser(user.id);
    if (feedFollows.length === 0) {
        console.log(`No feed follows found for this user.`);
        return;
    }

    console.log(`Feed follows for user %s:`, user.id);
    for (let ff of feedFollows) {
        console.log(`* %s`, ff.feedName);
    }
}

export function printFeedFollow(username: string, feedname: string) {
    console.log(`* User:          ${username}`);
    console.log(`* Feed:          ${feedname}`);
}

