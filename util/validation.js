import {getUser} from "../server.js";

export async function isUsernameTaken(un) {
    try {
        if (await getUser(un) === undefined) {
            return false;
        }
        return true;
    }
    catch(error) {
        console.log("Couldn't fetch the user data.");
        throw error;
    }
}

export function isValidPassword(pw) {
    if (pw.length >= 6) {
        return true;
    }
    return false;
}