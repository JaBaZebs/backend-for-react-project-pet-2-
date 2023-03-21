import express from "express"
import verify from "./Links/verify.js";
import jwt from 'jsonwebtoken';
import config from 'dotenv';
import cookieParser from "cookie-parser";
import cors from 'cors';
import User from "./User.js";
import { connectDataBase } from "./api/db.js";
import bodyParser from "body-parser";
import login from "./Links/login.js";
import register from "./Links/register.js";
import outlogin from "./Links/outlogin.js";
import putTodo from "./Links/putTodo.js";
import removeTodo from "./Links/removeTodo.js";
import updateChekTodos from "./Links/updateChekTodos.js";
import https from 'node:https';

const PORT = 5000;
const app = express();
config.config();
const secretAccess = process.env.ACCESS_TOKEN_PRIVATE_KEY;
const secretRefresh = process.env.REFRESH_TOKEN_PRIVATE_KEY;
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
})) 


app.post('/update', async(req, res) => {updateChekTodos(req, res, secretAccess, secretRefresh)})
app.post('/register', async (req, res) => {register(req, res, secretAccess, secretRefresh)});
app.post('/login', async (req, res) => {login(req, res, secretAccess, secretRefresh)});
app.get('/verify', async (req, res) => {verify(req, res, secretAccess, secretRefresh)});
app.post('/outlogin', async (req, res) => {outlogin(req, res, secretAccess, secretRefresh)});
app.put('/puttodo', async(req, res) => {putTodo(req, res, secretAccess, secretRefresh)});
app.delete('/deltodo', async(req, res) => {removeTodo(req, res, secretAccess, secretRefresh)})
function setResponseHeader(res){
    res.setHeader('Content-Type', 'application/json');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
}
app.post('/gener', async (req, res)=>{
    const user = new User({username: 'Jon912111111112', password: '123454',todos: [{text: 'comp', completed: true}, {text: 'comp', completed: true}]});
    const accessData = {name: user.username, todos: user.todos};
    const access = jwt.sign(accessData, 'jaba', {expiresIn: '1m'});
    const refresh  = jwt.sign(accessData, 'jaba', {expiresIn: '5m'});
    user.accessToken = access;
    user.refreshToken = refresh;
    user.save();
    res.cookie('access', access, {httpOnly: true});
    res.cookie('refresh', refresh, {httpOnly: true});
    setResponseHeader(res);
    res.status(200).send(access);
});
app.get('/verify', async (req, res) => verify(req, res))


app.listen(PORT, async () => connectDataBase());