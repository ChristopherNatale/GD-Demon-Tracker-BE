import express from "express"
import { getUsers } from "../server.js";
import { getUser } from "../server.js";
import { createJSONToken, loginUser } from "../util/auth.js";


const loginRouter = express.Router();

loginRouter.post('/', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const credentials = {
        username: username,
        password: password
    }
    try {
        if (await loginUser(credentials) === true) {
            const token = createJSONToken(credentials.username)
            res.json({token})
        }
        else {
            return res.status(459).json({message: "Incorrect username/password."})
        }
        
    }
    catch (error) {
        console.log("Caught the error!")
        return res.status(401).json({ message: "Authentication failed!"})
    }
    
})

export default loginRouter;