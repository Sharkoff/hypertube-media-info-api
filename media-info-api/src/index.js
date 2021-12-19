import fetch from "node-fetch";
import redis from "redis";
import express from "express"
import cors from "cors";
import bodyParser from "body-parser"

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

const redisClient = redis.createClient({url: 'redis://hypertube-media-info-api-redis:6379'});
await redisClient.connect();

console.log('Connected to redis')

const fetchOMDB = imdbId => fetch(`http://www.omdbapi.com/?apikey=d69a36b&i=${imdbId}`).then(res => res.json());
const getMediaInfo = async imdbId => {
    const cache = await redisClient.get(imdbId);

    if (cache !== null) {
        return JSON.parse(cache);
    }

    const data = await fetchOMDB(imdbId);
    const poster = await fetch(data.Poster).then(res => res.arrayBuffer());
    data.Poster = new Buffer.from(poster).toString('base64');

    redisClient.set(imdbId, JSON.stringify(data));

    return data;
}

app.get('/', (req, res) => {
    const {imdbId} = req.query;

    if (!imdbId)
        res.status(403).send();
    else
        getMediaInfo(imdbId).then(mediaInfo => res.send(mediaInfo));
});

app.listen(8889, () => {
    console.log('Listening on port 8889')
});

