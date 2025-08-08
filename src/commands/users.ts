import { DrizzleQueryError } from "drizzle-orm";
import { createUser, getUserByName, getUsers } from "src/lib/db/queries/users";
import { readConfig, setUser } from "../config";

export async function handlerLogin(cmdName: string, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error(`usage: ${cmdName} <name>`);
    }

    const userName = args[0];
    if (!await getUserByName(userName)) {
        throw new Error(`user name "${userName}" doesn't exist in the database!`)
    }

    setUser(userName);
    console.log("User switched successfully!");
}

export async function handlerRegister(cmdName: string, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error(`usage: ${cmdName} <name>`);
    }

    const userName = args[0];
    let result = undefined;
    try {
        result = await createUser(userName);
    }
    catch (error) {
        console.log(error)
        if (error instanceof DrizzleQueryError) {
            throw new Error("User already exists!");
        }
        else {
            throw new Error(`Unknown error: ${error}`);
        }
    }
    setUser(result.name)
    console.log("User created successfully!");
    console.log(`User data: ${JSON.stringify(result)}`)
}

export async function handlerListUsers(_cmdName: string, ..._args: string[]) {
    let users = undefined;
    try {
        users = await getUsers();
    }
    catch (error) {
        console.log(error)
        if (error instanceof DrizzleQueryError) {
            throw new Error("Couldn't get users from database!");
        }
        else {
            throw new Error(`Unknown error: ${error}`);
        }
    }
    const config = readConfig();
    const currentUserName = config.currentUserName;

    if (users.length === 0) {
        console.log("No users defined in the database!")
        return;
    }

    for (const user of users) {
        console.log(`* ${user.name}${currentUserName == user.name ? " (current)" : ""}`)
    }
}

