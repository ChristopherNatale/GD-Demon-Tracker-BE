import {hash, compare} from "bcrypt";
import { isUsernameTaken, isValidPassword } from "./validation.js";
import { addUser, getUser } from "../server.js";
import pkg from "jsonwebtoken";
const {sign, verify} = pkg;
import dotenv from "dotenv";
dotenv.config();

export async function registerUser(credentials) {
    try {
        const hashedPw = await hash(credentials.password, 12);
        await addUser(credentials.username, hashedPw);
    }
    catch(error) {
        console.log("Couldn't fetch the user data.");
        throw error;
    }
        
}

export async function loginUser(credentials) {
    try {
        const db_data = await getUser(credentials.username);
    if (credentials.username === db_data.username) {
        if (await compare(credentials.password, db_data.password)) {
            return true;
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }
    }
    catch (error) {
        console.log("Couldn't fetch the user data.");
        throw error;
    }
}

export function createJSONToken(username) {
    return sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

export function validateJSONToken(token) {
    return verify(token, process.env.JWT_SECRET);
  }

export function checkAuthMiddleware(req, res) { //This is assuming absolutely everything goes as expected.
    const authFragments = req.headers['authorization'].split(' ');
    const authToken = authFragments[1];
    const validatedToken = validateJSONToken(authToken);
    req.token = validatedToken;
}

