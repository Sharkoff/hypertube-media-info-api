const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const Transmission = require('transmission-promise')

const app = express();
const transmission = new Transmission({
    host: 'hypertube-transmission',
    port: 9091,
    url: '/transmission/rpc'
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.get('/torrent/', (req, res) => {
    transmission.get(0).then(torrents => {
        res.send(torrents);
    });
});

app.post('/torrent/', (req, res) => {
    transmission.addUrl(req.body.magnet)
        .then(res => {
            console.log(res);
        })
        .catch(error => {
            console.log(error);
        })
});


app.listen(8888, () => {
    console.log('media-info-api listening on port 8888')
});