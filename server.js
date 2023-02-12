import express from 'express';
let app = express();
let port = process.env.PORT || 3000;
import route from './src/routes/route.js';
import bodyParser from 'body-parser';

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

route(app);

app.listen(port);

console.log('ChatGPT API server started on: ' + port);
