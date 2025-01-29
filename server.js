import dotenv from "dotenv";
dotenv.config();
import bodyParser from "body-parser";
import mysql, { createPool } from "mysql2";


const pool = mysql.createPool({
    host: process.env.MYSQL_HOST, //environment variables: good not to hard code localhost
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()

export async function getAllDemons() {
    const result = await pool.query("SELECT * FROM demons");
    const rows = result[0];
    return rows;
}

export async function getJoinedDemons(user_id1, user_id2) {
    const result = await pool.query(`SELECT name, creator, difficulty, username, levelID, status FROM demons 
        INNER JOIN users ON demons.user_id = users.user_id WHERE demons.user_id = ? OR demons.user_id = ?`, [user_id1, user_id2]);
    return result[0];
}

export async function getDemon(user_id, levelID) {
    const [rows] = await pool.query(`SELECT * FROM demons WHERE user_id = ? AND levelID = ?`, [user_id, levelID]);
    return rows[0]; //just so we always get an object instead of having an annoying array.
}

export async function getUserDemons(user_id) {
    const result = await pool.query(`SELECT * FROM demons WHERE user_id = ?`, [user_id]);
    const rows = result[0];
    return rows;
}

export async function addDemon(demonData) {
    const { user_id, levelID, name, difficulty, creator, status, progress, comments } = demonData;
    if (await getDemon(user_id, levelID) !== undefined) {
        return; //demon was already added to list
    }
    const result = await pool.query(`INSERT INTO demons (user_id, levelID, name, difficulty, creator, status, progress, comments)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [user_id, levelID, name, difficulty, creator, status, progress, comments]);
    const id = result.insertId;
    return getDemon(id);
}

export async function updateDemon(demonData) {
    const { status, progress, comments, user_id, levelID } = demonData;
    const [rows] = await pool.query(`UPDATE demons SET status = ?, progress = ?, comments = ? WHERE user_id = ? AND levelID = ?`,
        [status, progress, comments, user_id, levelID]);
    return rows[0];
}

export async function deleteDemon(user_id, levelID) {
    const result = await pool.query(`DELETE FROM demons WHERE user_id = ? AND levelID = ?`, [user_id, levelID]);
    return result;
}

export async function getUsers() {
    const result = await pool.query("SELECT * FROM users");
    const rows = result[0];
    return rows;
}

export async function getUser(username) {
    const [rows] = await pool.query(`SELECT * FROM users WHERE username = ?`, [username]);
    return rows[0]; 
}

export async function addUser(username, password) {
    const result = await pool.query(`INSERT INTO users (username, password)
        VALUES (?, ?)`,
    [username, password]);
    const id = result.insertId;
    return getUser(id);
}
