import express from "express";
import { getUser, getUsers } from "../server.js";

const userRouter = express.Router();

userRouter.get('/', async (req, res) => {
    try {
        const users = await getUsers();
        res.json({users});
    }
    catch {
        return res.status(500);
    }
});

userRouter.get('/:id', async (req, res) => {
    const user = await getUser(req.username);
    res.json({user});
});

/*userRouter.get('/find/signedin', async (req, res) => {
    console.log("Hello.");
    const authenticatedUser = await getUser(req.token.username);
    console.log(authenticatedUser);
    res.json({user});
})*/

export default userRouter;
