const express = require('express')
const mongoose = require('mongoose')
const {MONGO_USER,MONGO_IP,MONGO_PWD, MONGO_PORT, SESSION_SECRET, REDIS_PORT,REDIS_URL } = require("./config/config")

const postRouter = require("./routes/postRoutes")
const authRouter = require("./routes/userRoutes")

const session = require("express-session")
const redis = require("redis")
const cors = require("cors")

let RedisStore = require("connect-redis")(session) 


let redisClient = redis.createClient({
    host: REDIS_URL,
    port: REDIS_PORT
})



const app= express()

const mongoURl = `mongodb://${MONGO_USER}:${MONGO_PWD}@${MONGO_IP}:${MONGO_IP}/?authSource=admin`;

const connectWithRetry = () => {
    mongoose.connect(mongoURl,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true
})
    .then(() => console.log("database connection sucess "))
    .catch((e) => {console.log(e)
        setTimeout(connectWithRetry,5000)
    });
}

connectWithRetry()

app.enable("trust proxy");

app.use(cors({}))

app.use(session({
    store: new RedisStore({client: redisClient}),
    secret: SESSION_SECRET,
    cookie: {
        secure: false,
        resave:false,
        saveUninitialized: false,
        httpOnly: true,
        maxAge: 300000}
}));

app.use(express.json());

app.get("/api/v1", (req,resp) => {
    resp.send("<h2>Hi there!</h2>")
})
const port=process.env.PORT || 3000;


app.use("/api/v1/posts", postRouter);

app.use("/api/v1/users", authRouter);


app.listen(port, () => console.log(`listening on port ${port}`));