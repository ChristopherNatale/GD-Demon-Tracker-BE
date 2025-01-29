import "isomorphic-fetch";
import bodyParser from "body-parser";
import GD from "gd.js";
import Client from "gd.js";
import express from "express";
import cors from "cors";
import loginRouter from "./routes/login.js";
import signupRouter from "./routes/signup.js";
import demonRouter from "./routes/demonlist.js";
import userRouter from "./routes/users.js";

const app = express();

app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    next();
  });
app.use('/login', loginRouter); //specifies the path; authRoutes is used so that we don't need to type the whole path in
app.use('/signup', signupRouter);
app.use('/demonlist', demonRouter);
app.use('/users', userRouter);


const gd = new GD({
    logLevel: 2
});

const author = new Client();

app.get('/search/:levelName', async (req, res) => {
    
    const name = req.params.levelName; 
    const arrayOfLevels = await gd.levels.search({demon: true, query: name}, 3); //Only search for demons!
    console.log(arrayOfLevels);
    const result = arrayOfLevels;

    let levelName = null;
    let levelID = null;
    let creatorID = null;
    let creator = null;
    let demonDifficulty = null;

    let demonOptions = [];

    for (var i = 0; i < result.length; i++) {
        levelName = result[i].name;
        levelID = result[i].id;
        creatorID = await author.users.getByAccountID(result[i].creator.accountID);
        creator = creatorID.username;
        demonDifficulty = result[i].difficulty.level.pretty;
        demonOptions.push({
            levelName: levelName,
            levelID: levelID,
            creator: creator,
            demonDifficulty: demonDifficulty
        })
    }
    console.log(demonOptions);

    res.json(demonOptions);
});

app.listen(3001, () => console.log("Server started on port 3001"));

