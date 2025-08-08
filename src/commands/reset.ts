import { DrizzleQueryError } from "drizzle-orm";
import { deleteUsers } from "src/lib/db/queries/users";


export async function handlerReset(_cmdName: string, ..._args: string[]) {
    let result = undefined;
    try {
        result = await deleteUsers();
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
    console.log("Reset successfull! Users deleted!");
}
