import express from "express"
import { addDemon, getDemon, updateDemon, getUserDemons, getUser, deleteDemon, getAllDemons, getJoinedDemons} from "../server.js"
import { validateJSONToken } from "../util/auth.js";
import { checkAuthMiddleware } from "../util/auth.js";

const demonRouter = express.Router();

demonRouter.get('/all', async (req, res) => {
    const allDemons = await getAllDemons();
    res.json({allDemons});
})

demonRouter.get('/join/:username1/:username2', async (req, res) => {
    
    const loggedUser = await getUser(req.params.username1);
    const otherUser = await getUser(req.params.username2);
    const joinedDemons = await getJoinedDemons(loggedUser.user_id, otherUser.user_id);
    res.json(joinedDemons);
})

demonRouter.get('/:username', async (req, res) => {
    const user = await getUser(req.params.username);
    const user_id = user.user_id;
    const demons = await getUserDemons(user_id);
    res.json({demons});
})

demonRouter.get('/:username/:id', async (req, res) => {
    const user = await getUser(req.params.username);
    const user_id = user.user_id;
    const levelID = req.params.id;
    const demon = await getDemon(user_id, levelID);
    res.json({demon});
})

demonRouter.post('/add', async (req, res) => {
    checkAuthMiddleware(req, res);
    const authenticatedUser = await getUser(req.token.username)
    const data = {
        user_id: authenticatedUser.user_id,
        levelID: req.body.levelID,
        name: req.body.name,
        difficulty: req.body.difficulty,
        creator: req.body.creator,
        status: req.body.status,
        progress: req.body.progress,
        comments: req.body.comments
    };
    console.log(req.body);
    if (await getDemon(data.user_id, data.levelID) !== undefined) {
        res.json({message: "This demon has already been added to the list!"});
    }

    await addDemon(data);
    res.json({message: "Demon was successfully added to the list!", username: req.token.username});
})

demonRouter.patch('/:id', async (req, res) => {
    checkAuthMiddleware(req, res);
    const authenticatedUser = await getUser(req.token.username);
    const user_id = authenticatedUser.user_id;
    const levelID = req.params.id;
    const demonData = {
        status: req.body.status,
        progress: req.body.progress,
        comments: req.body.comments,
        user_id: user_id,
        levelID: levelID
    }
    await updateDemon(demonData);
    res.json({message: "Demon has been updated.", username: req.token.username});
})

demonRouter.delete('/:id', async (req, res) => {
    checkAuthMiddleware(req, res);
    const authenticatedUser = await getUser(req.token.username);
    const user_id = authenticatedUser.user_id;
    const levelID = req.params.id;
    await deleteDemon(user_id, levelID);
    res.json({message: "Demon was removed from the list.", username: req.token.username})
})

export default demonRouter;