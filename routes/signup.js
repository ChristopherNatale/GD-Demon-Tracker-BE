import express from "express"
import { createJSONToken, registerUser } from "../util/auth.js";
import { isUsernameTaken, isValidPassword } from "../util/validation.js";

const signupRouter = express.Router();

signupRouter.post('/', async (req, res, next) => {
    const data = req.body;
    let errors = {};
    if (!isValidPassword(data.password)) {
        errors.password = "Password must be at least 6 characters long."
    }
    try {
        if (await isUsernameTaken(data.username)) {
            errors.username = "Username has already been taken.";
        }
    }
    catch (error) {
        return res.status(401).json({message: 'Fetching user data failed.'})
    }

    if (Object.keys(errors).length > 0) {
        return res.status(459).json({
            message: 'Could not sign up.',
            errors,
        });
    }

    try {
    registerUser(data)
    console.log(data.username + " was successfully registered!");
    const token = createJSONToken(data.username)
    res.json({token});
    }
    catch (error) {
        return res.status(401).json({message: 'Unable to register.'})
    }
});


export default signupRouter;